import { defineStore } from 'pinia'
import { HangmanService } from '@/services/games/HangmanService'
import type {
  HangmanGameState,
  DailyHangmanWord,
  HangmanGameResult,
} from '@/types'

const hangmanService = new HangmanService()

export const useHangmanStore = defineStore('hangman', {
  state: () => ({
    gameState: null as HangmanGameState | null,
    dailyWord: null as DailyHangmanWord | null,
    loading: false,
    error: null as string | null,
    partidaDelDia: null as HangmanGameResult | null,
    mostrarPista: false,
  }),

  getters: {
    puedeJugar: (state) => {
      return state.gameState?.estadoJuego === 'jugando'
    },

    juegoTerminado: (state) => {
      return (
        state.gameState?.estadoJuego === 'ganado' ||
        state.gameState?.estadoJuego === 'perdido'
      )
    },

    gano: (state) => state.gameState?.estadoJuego === 'ganado',

    perdio: (state) => state.gameState?.estadoJuego === 'perdido',

    palabraSecreta: (state) => state.gameState?.palabraSecreta || '',

    palabraVisual: (state) => {
      if (!state.gameState) return ''
      return state.gameState.palabraOculta.join(' ')
    },

    intentosUsados: (state) => {
      if (!state.gameState) return 0
      return state.gameState.intentosMaximos - state.gameState.intentosRestantes
    },

    yaJugoHoy: (state) => state.partidaDelDia !== null,

    /**
     * Genera el abecedario completo con estados
     */
    teclado: (state) => {
      const letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('')

      return letras.map((letra) => {
        let estado: 'correcto' | 'incorrecto' | 'sin_usar' = 'sin_usar'

        if (state.gameState?.letrasAdivinadas.includes(letra)) {
          estado = 'correcto'
        } else if (state.gameState?.letrasIncorrectas.includes(letra)) {
          estado = 'incorrecto'
        }

        return {
          letra,
          estado,
          deshabilitado: estado !== 'sin_usar',
        }
      })
    },
  },

  actions: {
    /**
     * Inicializa un nuevo juego
     */
    async iniciarJuego(userId: string) {
      this.loading = true
      this.error = null

      try {
        // Verificar si ya jugó hoy
        const { yaJugo, partida } = await hangmanService.verificarPartidaDelDia(userId)

        if (yaJugo && partida) {
          this.partidaDelDia = partida
          this.error = 'Ya jugaste tu partida gratuita de hoy. Compra tickets para seguir jugando.'
          this.loading = false
          return false
        }

        // Obtener palabra del día
        this.dailyWord = await hangmanService.getPalabraDelDia()

        // Inicializar estado del juego
        this.gameState = hangmanService.inicializarJuego(this.dailyWord)
        this.mostrarPista = false

        console.log('🎮 Juego iniciado - Palabra:', this.dailyWord.palabra)

        return true
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al iniciar juego'
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Procesa el intento de una letra
     */
    async intentarLetra(letra: string, userId?: string) {
      if (!this.gameState || !this.puedeJugar) return false

      // Validar letra
      const validacion = hangmanService.validarLetra(letra)
      if (!validacion.valida) {
        this.error = validacion.error || 'Letra inválida'
        setTimeout(() => (this.error = null), 2000)
        return false
      }

      // Procesar letra
      const esCorrecta = hangmanService.procesarLetra(letra, this.gameState)

      // Si el juego terminó, guardar partida
      if (this.juegoTerminado && userId) {
        await this.guardarPartida(userId)
      }

      return esCorrecta
    },

    /**
     * Muestra la pista (reduce el puntaje)
     */
    revelarPista() {
      if (!this.gameState || !this.dailyWord) return

      hangmanService.usarPista(this.gameState)
      this.mostrarPista = true
    },

    /**
     * Guarda la partida en Supabase
     */
    async guardarPartida(userId: string) {
      if (!this.gameState) return

      try {
        const resultado = await hangmanService.guardarPartida(userId, this.gameState)

        if (resultado) {
          this.gameState.gameId = resultado.gameId
          this.partidaDelDia = resultado

          console.log('💾 Partida guardada:', resultado)
        }
      } catch (error) {
        console.error('Error guardando partida:', error)
      }
    },

    /**
     * Reinicia el juego
     */
    reiniciarJuego() {
      this.gameState = null
      this.dailyWord = null
      this.error = null
      this.mostrarPista = false
    },

    /**
     * Maneja el input del teclado físico
     */
    manejarTecladoFisico(event: KeyboardEvent, userId?: string) {
      if (!this.puedeJugar) return

      const key = event.key.toUpperCase()

      // Letras A-Z y Ñ
      if (/^[A-ZÑ]$/.test(key)) {
        this.intentarLetra(key, userId)
      }
    },

    clearError() {
      this.error = null
    },
  },
})

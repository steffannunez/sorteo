import { defineStore } from 'pinia'
import { WordleService } from '@/services/games/WordleService'
import type {
  WordleGameState,
  DailyWord,
  WordleLetter,
  WordleGameResult,
} from '@/types'

const wordleService = new WordleService()

export const useWordleStore = defineStore('wordle', {
  state: () => ({
    gameState: null as WordleGameState | null,
    dailyWord: null as DailyWord | null,
    loading: false,
    error: null as string | null,
    palabraActual: '',
    partidaDelDia: null as WordleGameResult | null,
    keyboardStatus: new Map<string, 'correct' | 'present' | 'absent'>(),
  }),

  getters: {
    filaActual: (state) => {
      if (!state.gameState) return null
      return state.gameState.filas[state.gameState.intentoActual]
    },

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

    intentosRestantes: (state) => {
      if (!state.gameState) return 0
      return state.gameState.intentosMaximos - state.gameState.intentoActual
    },

    yaJugoHoy: (state) => state.partidaDelDia !== null,
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
        const { yaJugo, partida } = await wordleService.verificarPartidaDelDia(userId)

        if (yaJugo && partida) {
          this.partidaDelDia = partida
          this.error = 'Ya jugaste tu partida gratuita de hoy. Compra tickets para seguir jugando.'
          this.loading = false
          return false
        }

        // Obtener palabra del día
        this.dailyWord = await wordleService.getPalabraDelDia()

        // Inicializar estado del juego
        this.gameState = wordleService.inicializarJuego(this.dailyWord)
        this.palabraActual = ''
        this.keyboardStatus.clear()

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
     * Agrega una letra a la palabra actual
     */
    agregarLetra(letra: string) {
      if (!this.gameState || !this.puedeJugar) return

      if (this.palabraActual.length < 5) {
        this.palabraActual += letra.toUpperCase()

        // Actualizar la fila visual
        const filaActual = this.gameState.filas[this.gameState.intentoActual]
        const index = this.palabraActual.length - 1
        filaActual.letters[index] = {
          letter: letra.toUpperCase(),
          status: 'empty',
        }
      }
    },

    /**
     * Elimina la última letra
     */
    borrarLetra() {
      if (!this.gameState || !this.puedeJugar) return

      if (this.palabraActual.length > 0) {
        const index = this.palabraActual.length - 1
        this.palabraActual = this.palabraActual.slice(0, -1)

        // Actualizar la fila visual
        const filaActual = this.gameState.filas[this.gameState.intentoActual]
        filaActual.letters[index] = {
          letter: '',
          status: 'empty',
        }
      }
    },

    /**
     * Envía la palabra actual como intento
     */
    async enviarPalabra(userId?: string) {
      if (!this.gameState || !this.puedeJugar) return false

      // Validar palabra
      const validacion = wordleService.validarPalabra(this.palabraActual)
      if (!validacion.valida) {
        this.error = validacion.error || 'Palabra inválida'
        setTimeout(() => (this.error = null), 2000)
        return false
      }

      // Procesar intento
      const resultado = wordleService.procesarIntento(
        this.palabraActual,
        this.gameState.palabraSecreta
      )

      // Actualizar fila con el resultado
      const filaActual = this.gameState.filas[this.gameState.intentoActual]
      filaActual.letters = resultado
      filaActual.isSubmitted = true

      // Actualizar estado del teclado
      resultado.forEach((letterResult) => {
        const currentStatus = this.keyboardStatus.get(letterResult.letter)

        // Solo actualizar si es mejor o igual status (correct > present > absent)
        if (
          !currentStatus ||
          (letterResult.status === 'correct') ||
          (letterResult.status === 'present' && currentStatus !== 'correct')
        ) {
          this.keyboardStatus.set(letterResult.letter, letterResult.status)
        }
      })

      // Verificar si ganó
      const gano = resultado.every((letter) => letter.status === 'correct')

      if (gano) {
        this.gameState.estadoJuego = 'ganado'
        this.gameState.intentoActual++
        this.gameState.tiempoFin = new Date()
        this.gameState.puntaje = wordleService.calcularPuntaje(
          this.gameState.intentoActual,
          true
        )

        // Guardar partida si tiene userId
        if (userId) {
          await this.guardarPartida(userId)
        }

        return true
      }

      // Siguiente intento
      this.gameState.intentoActual++

      // Verificar si perdió (agotó intentos)
      if (this.gameState.intentoActual >= this.gameState.intentosMaximos) {
        this.gameState.estadoJuego = 'perdido'
        this.gameState.tiempoFin = new Date()
        this.gameState.puntaje = 0

        // Guardar partida si tiene userId
        if (userId) {
          await this.guardarPartida(userId)
        }
      }

      this.palabraActual = ''
      return false
    },

    /**
     * Guarda la partida en Supabase
     */
    async guardarPartida(userId: string) {
      if (!this.gameState) return

      try {
        const resultado = await wordleService.guardarPartida(userId, this.gameState)

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
      this.palabraActual = ''
      this.error = null
      this.keyboardStatus.clear()
    },

    /**
     * Obtiene el status de una tecla para el teclado visual
     */
    getKeyStatus(letra: string): 'correct' | 'present' | 'absent' | 'unused' {
      return this.keyboardStatus.get(letra.toUpperCase()) || 'unused'
    },

    /**
     * Maneja el input del teclado físico
     */
    manejarTecladoFisico(event: KeyboardEvent, userId?: string) {
      if (!this.puedeJugar) return

      const key = event.key.toUpperCase()

      // Letras A-Z y Ñ
      if (/^[A-ZÑ]$/.test(key)) {
        this.agregarLetra(key)
      }
      // Backspace
      else if (key === 'BACKSPACE') {
        this.borrarLetra()
      }
      // Enter
      else if (key === 'ENTER') {
        this.enviarPalabra(userId)
      }
    },

    clearError() {
      this.error = null
    },
  },
})

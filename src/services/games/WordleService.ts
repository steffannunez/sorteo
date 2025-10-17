import { supabase, isSupabaseConfigured } from '@/config/supabase'
import type {
  DailyWord,
  WordleGameState,
  WordleRow,
  WordleLetter,
  LetterStatus,
  WordleGameResult,
} from '@/types'

/**
 * Servicio para el juego Wordle
 * Maneja la lógica del juego y la persistencia en Supabase
 */
export class WordleService {
  private readonly INTENTOS_MAXIMOS = 6
  private readonly LONGITUD_PALABRA = 5

  // Palabras de prueba locales (usadas cuando Supabase no está configurado)
  // TODAS deben tener exactamente 5 letras
  private palabrasPrueba = [
    'PLAYA', 'GATOS', 'LIBRO', 'NOCHE', 'MUNDO',
    'QUESO', 'RADIO', 'PIANO', 'CIELO', 'BRAVO',
    'TIGRE', 'ARENA', 'SANTO', 'FLORES', 'COCHE',
    'MANGO', 'SOLAR', 'DANZA', 'BRISA', 'GRUPO'
  ]

  /**
   * Obtiene la palabra del día desde Supabase o genera una local
   */
  async getPalabraDelDia(): Promise<DailyWord> {
    if (isSupabaseConfigured()) {
      try {
        const fechaHoy = new Date().toISOString().split('T')[0]

        const { data, error } = await supabase
          .from('daily_words')
          .select('*')
          .eq('fecha', fechaHoy)
          .single()

        if (error) {
          console.warn('Error obteniendo palabra del día:', error)
          return this.generarPalabraLocal()
        }

        return {
          id: data.id,
          palabra: data.palabra.toUpperCase(),
          fecha: data.fecha,
          dificultad: data.dificultad as 'facil' | 'media' | 'dificil',
          categoria: data.categoria,
        }
      } catch (error) {
        console.error('Error en getPalabraDelDia:', error)
        return this.generarPalabraLocal()
      }
    }

    return this.generarPalabraLocal()
  }

  /**
   * Genera una palabra local para desarrollo
   */
  private generarPalabraLocal(): DailyWord {
    const hoy = new Date()
    const indice = hoy.getDate() % this.palabrasPrueba.length

    return {
      id: `local-${hoy.toISOString().split('T')[0]}`,
      palabra: this.palabrasPrueba[indice],
      fecha: hoy.toISOString().split('T')[0],
      dificultad: 'media',
      categoria: 'Desarrollo',
    }
  }

  /**
   * Inicializa un nuevo estado de juego
   */
  inicializarJuego(dailyWord: DailyWord): WordleGameState {
    const filas: WordleRow[] = []

    // Crear filas vacías
    for (let i = 0; i < this.INTENTOS_MAXIMOS; i++) {
      const letters: WordleLetter[] = []
      for (let j = 0; j < this.LONGITUD_PALABRA; j++) {
        letters.push({
          letter: '',
          status: 'empty',
        })
      }
      filas.push({
        letters,
        isSubmitted: false,
      })
    }

    return {
      gameId: null,
      dailyWordId: dailyWord.id,
      palabraSecreta: dailyWord.palabra,
      intentosMaximos: this.INTENTOS_MAXIMOS,
      intentoActual: 0,
      filas,
      estadoJuego: 'jugando',
      puntaje: 0,
      tiempoInicio: new Date(),
      tiempoFin: null,
    }
  }

  /**
   * Valida que una palabra sea válida (5 letras, solo letras)
   */
  validarPalabra(palabra: string): { valida: boolean; error?: string } {
    if (!palabra || palabra.length !== this.LONGITUD_PALABRA) {
      return {
        valida: false,
        error: `La palabra debe tener ${this.LONGITUD_PALABRA} letras`,
      }
    }

    if (!/^[A-ZÑ]+$/.test(palabra)) {
      return {
        valida: false,
        error: 'La palabra solo puede contener letras',
      }
    }

    // TODO: Aquí podrías validar contra un diccionario en Supabase
    return { valida: true }
  }

  /**
   * Procesa un intento y devuelve el estado de cada letra
   */
  procesarIntento(palabra: string, palabraSecreta: string): WordleLetter[] {
    const resultado: WordleLetter[] = []
    const letrasSecretas = palabraSecreta.split('')
    const palabraArray = palabra.split('')

    // Primero marcamos las letras correctas (verdes)
    const letrasRestantes = [...letrasSecretas]
    palabraArray.forEach((letra, index) => {
      if (letra === letrasSecretas[index]) {
        resultado[index] = { letter: letra, status: 'correct' }
        letrasRestantes[index] = '' // Marcar como usada
      } else {
        resultado[index] = { letter: letra, status: 'absent' }
      }
    })

    // Luego marcamos las letras presentes pero en posición incorrecta (amarillas)
    palabraArray.forEach((letra, index) => {
      if (resultado[index].status === 'correct') return

      const indexEnSecreto = letrasRestantes.indexOf(letra)
      if (indexEnSecreto !== -1) {
        resultado[index] = { letter: letra, status: 'present' }
        letrasRestantes[indexEnSecreto] = '' // Marcar como usada
      }
    })

    return resultado
  }

  /**
   * Calcula el puntaje basado en intentos usados
   */
  calcularPuntaje(intentosUsados: number, ganado: boolean): number {
    if (!ganado) return 0

    // Sistema de puntaje:
    // 1 intento: 100 puntos
    // 2 intentos: 90 puntos
    // 3 intentos: 75 puntos
    // 4 intentos: 60 puntos
    // 5 intentos: 45 puntos
    // 6 intentos: 30 puntos

    const puntajes = [100, 90, 75, 60, 45, 30]
    return puntajes[intentosUsados - 1] || 0
  }

  /**
   * Guarda la partida en Supabase
   */
  async guardarPartida(
    userId: string,
    gameState: WordleGameState
  ): Promise<WordleGameResult | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase no configurado, partida no guardada')
      return null
    }

    try {
      const tiempoSegundos = gameState.tiempoFin && gameState.tiempoInicio
        ? Math.floor(
            (gameState.tiempoFin.getTime() - gameState.tiempoInicio.getTime()) / 1000
          )
        : 0

      const { data, error } = await supabase
        .from('wordle_games')
        .insert({
          user_id: userId,
          daily_word_id: gameState.dailyWordId,
          intentos_usados: gameState.intentoActual,
          completado: gameState.estadoJuego !== 'jugando',
          ganado: gameState.estadoJuego === 'ganado',
          puntaje: gameState.puntaje,
          tiempo_segundos: tiempoSegundos,
          fecha_juego: new Date().toISOString().split('T')[0],
        })
        .select()
        .single()

      if (error) {
        console.error('Error guardando partida:', error)
        return null
      }

      return {
        gameId: data.id,
        userId: data.user_id,
        dailyWordId: data.daily_word_id,
        intentosUsados: data.intentos_usados,
        completado: data.completado,
        ganado: data.ganado,
        puntaje: data.puntaje,
        tiempoSegundos: data.tiempo_segundos,
        fechaJuego: new Date(data.fecha_juego),
      }
    } catch (error) {
      console.error('Error en guardarPartida:', error)
      return null
    }
  }

  /**
   * Verifica si el usuario ya jugó hoy
   */
  async verificarPartidaDelDia(userId: string): Promise<{
    yaJugo: boolean
    partida?: WordleGameResult
  }> {
    if (!isSupabaseConfigured()) {
      // En modo local, verificar localStorage
      const partidasLocal = localStorage.getItem('wordle_partidas')
      if (partidasLocal) {
        const partidas = JSON.parse(partidasLocal)
        const hoy = new Date().toISOString().split('T')[0]
        const partidaHoy = partidas[userId]?.[hoy]

        if (partidaHoy) {
          return { yaJugo: true, partida: partidaHoy }
        }
      }

      return { yaJugo: false }
    }

    try {
      const fechaHoy = new Date().toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('wordle_games')
        .select('*')
        .eq('user_id', userId)
        .eq('fecha_juego', fechaHoy)
        .single()

      if (error) {
        // No hay partida, puede jugar
        return { yaJugo: false }
      }

      return {
        yaJugo: true,
        partida: {
          gameId: data.id,
          userId: data.user_id,
          dailyWordId: data.daily_word_id,
          intentosUsados: data.intentos_usados,
          completado: data.completado,
          ganado: data.ganado,
          puntaje: data.puntaje,
          tiempoSegundos: data.tiempo_segundos,
          fechaJuego: new Date(data.fecha_juego),
        },
      }
    } catch (error) {
      console.error('Error verificando partida del día:', error)
      return { yaJugo: false }
    }
  }

  /**
   * Normaliza texto (remueve acentos, convierte a mayúsculas)
   */
  normalizarTexto(texto: string): string {
    return texto
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }
}

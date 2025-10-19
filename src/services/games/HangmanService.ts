import { supabase, isSupabaseConfigured } from '@/config/supabase'
import type {
  DailyHangmanWord,
  HangmanGameState,
  HangmanGameResult,
} from '@/types'

/**
 * Servicio para el juego del Ahorcado (Hangman)
 * Maneja la lógica del juego y la persistencia en Supabase
 */
export class HangmanService {
  private readonly INTENTOS_MAXIMOS = 6 // 6 partes del ahorcado

  // Palabras de prueba locales (usadas cuando Supabase no está configurado)
  private palabrasPrueba = [
    { palabra: 'PROGRAMACION', pista: 'Actividad de escribir código', categoria: 'Tecnología' },
    { palabra: 'ELEFANTE', pista: 'Animal grande con trompa', categoria: 'Animales' },
    { palabra: 'GUITARRA', pista: 'Instrumento de cuerdas', categoria: 'Música' },
    { palabra: 'CHOCOLATE', pista: 'Dulce hecho de cacao', categoria: 'Comida' },
    { palabra: 'MONTAÑA', pista: 'Elevación natural del terreno', categoria: 'Geografía' },
    { palabra: 'COMPUTADORA', pista: 'Máquina para procesar información', categoria: 'Tecnología' },
    { palabra: 'BIBLIOTECA', pista: 'Lugar con muchos libros', categoria: 'Cultura' },
    { palabra: 'DINOSAURIO', pista: 'Reptil prehistórico extinto', categoria: 'Historia' },
    { palabra: 'ASTRONAUTA', pista: 'Viajero del espacio', categoria: 'Ciencia' },
    { palabra: 'MARIPOSA', pista: 'Insecto con alas coloridas', categoria: 'Naturaleza' },
  ]

  /**
   * Obtiene la palabra del día desde Supabase o genera una local
   */
  async getPalabraDelDia(): Promise<DailyHangmanWord> {
    if (isSupabaseConfigured()) {
      try {
        const fechaHoy = new Date().toISOString().split('T')[0]

        const { data, error } = await supabase
          .from('daily_hangman_words')
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
          pista: data.pista,
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
  private generarPalabraLocal(): DailyHangmanWord {
    const hoy = new Date()
    const indice = hoy.getDate() % this.palabrasPrueba.length
    const palabraData = this.palabrasPrueba[indice]

    return {
      id: `local-${hoy.toISOString().split('T')[0]}`,
      palabra: palabraData.palabra,
      pista: palabraData.pista,
      fecha: hoy.toISOString().split('T')[0],
      dificultad: this.calcularDificultad(palabraData.palabra),
      categoria: palabraData.categoria,
    }
  }

  /**
   * Calcula la dificultad basada en la longitud de la palabra
   */
  private calcularDificultad(palabra: string): 'facil' | 'media' | 'dificil' {
    const longitud = palabra.length
    if (longitud <= 6) return 'facil'
    if (longitud <= 9) return 'media'
    return 'dificil'
  }

  /**
   * Inicializa un nuevo estado de juego
   */
  inicializarJuego(dailyWord: DailyHangmanWord): HangmanGameState {
    const palabraOculta = dailyWord.palabra.split('').map(() => '_')

    return {
      gameId: null,
      dailyWordId: dailyWord.id,
      palabraSecreta: dailyWord.palabra,
      palabraOculta,
      letrasAdivinadas: [],
      letrasIncorrectas: [],
      intentosMaximos: this.INTENTOS_MAXIMOS,
      intentosRestantes: this.INTENTOS_MAXIMOS,
      estadoJuego: 'jugando',
      puntaje: 0,
      tiempoInicio: new Date(),
      tiempoFin: null,
      pistaUsada: false,
    }
  }

  /**
   * Procesa el intento de una letra
   * Retorna true si la letra está en la palabra, false si no
   */
  procesarLetra(letra: string, gameState: HangmanGameState): boolean {
    const letraMayuscula = letra.toUpperCase()

    // Verificar si la letra ya fue usada
    if (
      gameState.letrasAdivinadas.includes(letraMayuscula) ||
      gameState.letrasIncorrectas.includes(letraMayuscula)
    ) {
      return false // Letra ya usada, no cuenta como intento
    }

    // Verificar si la letra está en la palabra
    const letrasEnPalabra = gameState.palabraSecreta.split('')
    const estaEnPalabra = letrasEnPalabra.includes(letraMayuscula)

    if (estaEnPalabra) {
      // Letra correcta
      gameState.letrasAdivinadas.push(letraMayuscula)

      // Actualizar palabra oculta
      letrasEnPalabra.forEach((char, index) => {
        if (char === letraMayuscula) {
          gameState.palabraOculta[index] = char
        }
      })

      // Verificar si ganó (todas las letras fueron adivinadas)
      if (!gameState.palabraOculta.includes('_')) {
        gameState.estadoJuego = 'ganado'
        gameState.tiempoFin = new Date()
        gameState.puntaje = this.calcularPuntaje(
          gameState.intentosRestantes,
          gameState.pistaUsada,
          gameState.palabraSecreta.length
        )
      }

      return true
    } else {
      // Letra incorrecta
      gameState.letrasIncorrectas.push(letraMayuscula)
      gameState.intentosRestantes--

      // Verificar si perdió
      if (gameState.intentosRestantes <= 0) {
        gameState.estadoJuego = 'perdido'
        gameState.tiempoFin = new Date()
        gameState.puntaje = 0
      }

      return false
    }
  }

  /**
   * Usa la pista (reduce el puntaje final)
   */
  usarPista(gameState: HangmanGameState): void {
    gameState.pistaUsada = true
  }

  /**
   * Calcula el puntaje basado en intentos restantes y uso de pista
   */
  calcularPuntaje(
    intentosRestantes: number,
    pistaUsada: boolean,
    longitudPalabra: number
  ): number {
    // Puntos base según intentos restantes
    const puntosBase = intentosRestantes * 20

    // Bonus por longitud de palabra
    const bonusLongitud = longitudPalabra * 5

    // Penalización por usar pista (30% menos)
    const multiplicador = pistaUsada ? 0.7 : 1

    return Math.floor((puntosBase + bonusLongitud) * multiplicador)
  }

  /**
   * Guarda la partida en Supabase
   */
  async guardarPartida(
    userId: string,
    gameState: HangmanGameState
  ): Promise<HangmanGameResult | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase no configurado, partida no guardada')
      // Guardar en localStorage para desarrollo
      this.guardarPartidaLocal(userId, gameState)
      return this.crearResultadoLocal(userId, gameState)
    }

    try {
      const tiempoSegundos =
        gameState.tiempoFin && gameState.tiempoInicio
          ? Math.floor(
              (gameState.tiempoFin.getTime() - gameState.tiempoInicio.getTime()) / 1000
            )
          : 0

      const intentosUsados = this.INTENTOS_MAXIMOS - gameState.intentosRestantes

      const { data, error } = await supabase
        .from('hangman_games')
        .insert({
          user_id: userId,
          daily_word_id: gameState.dailyWordId,
          intentos_usados: intentosUsados,
          completado: gameState.estadoJuego !== 'jugando',
          ganado: gameState.estadoJuego === 'ganado',
          puntaje: gameState.puntaje,
          tiempo_segundos: tiempoSegundos,
          pista_usada: gameState.pistaUsada,
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
        pistaUsada: data.pista_usada,
        fechaJuego: new Date(data.fecha_juego),
      }
    } catch (error) {
      console.error('Error en guardarPartida:', error)
      return null
    }
  }

  /**
   * Guarda partida en localStorage (para desarrollo)
   */
  private guardarPartidaLocal(userId: string, gameState: HangmanGameState): void {
    const hoy = new Date().toISOString().split('T')[0]
    const partidasLocal = localStorage.getItem('hangman_partidas') || '{}'
    const partidas = JSON.parse(partidasLocal)

    if (!partidas[userId]) {
      partidas[userId] = {}
    }

    partidas[userId][hoy] = this.crearResultadoLocal(userId, gameState)
    localStorage.setItem('hangman_partidas', JSON.stringify(partidas))
  }

  /**
   * Crea un resultado local
   */
  private crearResultadoLocal(
    userId: string,
    gameState: HangmanGameState
  ): HangmanGameResult {
    const tiempoSegundos =
      gameState.tiempoFin && gameState.tiempoInicio
        ? Math.floor(
            (gameState.tiempoFin.getTime() - gameState.tiempoInicio.getTime()) / 1000
          )
        : 0

    const intentosUsados = this.INTENTOS_MAXIMOS - gameState.intentosRestantes

    return {
      gameId: `local-${Date.now()}`,
      userId,
      dailyWordId: gameState.dailyWordId,
      intentosUsados,
      completado: gameState.estadoJuego !== 'jugando',
      ganado: gameState.estadoJuego === 'ganado',
      puntaje: gameState.puntaje,
      tiempoSegundos,
      pistaUsada: gameState.pistaUsada,
      fechaJuego: new Date(),
    }
  }

  /**
   * Verifica si el usuario ya jugó hoy
   */
  async verificarPartidaDelDia(userId: string): Promise<{
    yaJugo: boolean
    partida?: HangmanGameResult
  }> {
    if (!isSupabaseConfigured()) {
      // En modo local, verificar localStorage
      const partidasLocal = localStorage.getItem('hangman_partidas')
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
        .from('hangman_games')
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
          pistaUsada: data.pista_usada,
          fechaJuego: new Date(data.fecha_juego),
        },
      }
    } catch (error) {
      console.error('Error verificando partida del día:', error)
      return { yaJugo: false }
    }
  }

  /**
   * Valida que una letra sea válida (A-Z o Ñ)
   */
  validarLetra(letra: string): { valida: boolean; error?: string } {
    if (!letra || letra.length !== 1) {
      return {
        valida: false,
        error: 'Debes ingresar una sola letra',
      }
    }

    if (!/^[A-ZÑ]$/i.test(letra)) {
      return {
        valida: false,
        error: 'Solo puedes ingresar letras (A-Z, Ñ)',
      }
    }

    return { valida: true }
  }
}

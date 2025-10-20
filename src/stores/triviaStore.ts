import { defineStore } from 'pinia'
import { TriviaService } from '@/services/games/TriviaService'
import type {
  TriviaGameState,
  TriviaQuestionDisplay,
  TriviaGameResult,
} from '@/types'

const triviaService = new TriviaService()

export const useTriviaStore = defineStore('trivia', {
  state: () => ({
    gameState: {
      gameId: null,
      currentQuestion: null,
      questionNumber: 0,
      totalScore: 0,
      skipsUsed: 0,
      gameStatus: 'not_started',
      tiempoInicio: null,
      tiempoFin: null,
      questionsAnswered: 0,
    } as TriviaGameState,
    loading: false,
    error: null as string | null,
    partidaDelDia: null as TriviaGameResult | null,
    selectedAnswer: null as string | null,
    showingResult: false, // Mostrar resultado de la pregunta actual
    lastAnswerCorrect: false,
    usedQuestions: [] as string[], // Preguntas ya mostradas en la partida actual
  }),

  getters: {
    isPlaying: (state) => state.gameState.gameStatus === 'playing',

    isGameOver: (state) => state.gameState.gameStatus === 'game_over',

    yaJugoHoy: (state) => state.partidaDelDia !== null,

    /**
     * Calcula el costo del próximo salto (exponencial)
     * Fórmula: -5 × (3^n) donde n = número de saltos usados
     */
    nextSkipCost: (state) => {
      return -5 * Math.pow(3, state.gameState.skipsUsed)
    },

    /**
     * Determina si puede saltar (tiene suficientes puntos)
     */
    canSkip: (state) => {
      const cost = -5 * Math.pow(3, state.gameState.skipsUsed)
      return state.gameState.totalScore + cost >= 0
    },

    /**
     * Obtiene la dificultad actual según el número de pregunta
     */
    currentDifficulty(state): 'easy' | 'medium' | 'hard' {
      const q = state.gameState.questionNumber
      if (q <= 3) return 'easy'
      if (q <= 7) return 'medium'
      return 'hard'
    },

    /**
     * Puntos que se ganarán por responder correctamente
     */
    pointsForCorrectAnswer(state): number {
      const q = state.gameState.questionNumber
      if (q <= 3) return 10  // fácil
      if (q <= 7) return 20  // medio
      if (q <= 10) return 30 // difícil
      return 50              // experto
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
        const { yaJugo, partida } = await triviaService.verificarPartidaDelDia(userId)

        if (yaJugo && partida) {
          this.partidaDelDia = partida
          this.error = 'Ya jugaste tu partida gratuita de hoy. Compra tickets para seguir jugando.'
          this.loading = false
          return false
        }

        // Reiniciar estado
        this.gameState = {
          gameId: null,
          currentQuestion: null,
          questionNumber: 0,
          totalScore: 0,
          skipsUsed: 0,
          gameStatus: 'playing',
          tiempoInicio: new Date(),
          tiempoFin: null,
          questionsAnswered: 0,
        }

        this.selectedAnswer = null
        this.showingResult = false
        this.usedQuestions = [] // Limpiar preguntas usadas al iniciar nueva partida

        // Cargar primera pregunta
        await this.cargarSiguientePregunta()

        console.log('🎮 Juego de Trivia iniciado')

        return true
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al iniciar juego'
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Carga la siguiente pregunta desde la API
     */
    async cargarSiguientePregunta() {
      try {
        this.loading = true
        this.selectedAnswer = null
        this.showingResult = false

        // Incrementar número de pregunta
        this.gameState.questionNumber++

        // Obtener dificultad actual
        const difficulty = this.currentDifficulty

        // Cargar pregunta de la API, pasando las preguntas ya usadas
        const question = await triviaService.fetchQuestion(difficulty, this.usedQuestions)

        this.gameState.currentQuestion = question

        // Agregar la pregunta al registro de preguntas usadas
        this.usedQuestions.push(question.question)

        console.log(`❓ Pregunta ${this.gameState.questionNumber} cargada (${difficulty})`)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al cargar pregunta'
        this.gameState.gameStatus = 'game_over'
      } finally {
        this.loading = false
      }
    },

    /**
     * Procesa la respuesta del jugador
     */
    async responderPregunta(respuesta: string, userId?: string) {
      if (!this.gameState.currentQuestion || this.showingResult) return

      this.selectedAnswer = respuesta
      this.showingResult = true

      const esCorrecta = respuesta === this.gameState.currentQuestion.correctAnswer

      if (esCorrecta) {
        // Respuesta correcta: sumar puntos y continuar
        const puntos = this.pointsForCorrectAnswer
        this.gameState.totalScore += puntos
        this.gameState.questionsAnswered++
        this.lastAnswerCorrect = true

        console.log(`✅ Correcto! +${puntos} puntos. Total: ${this.gameState.totalScore}`)

        // Esperar 2 segundos para mostrar resultado, luego cargar siguiente
        setTimeout(async () => {
          await this.cargarSiguientePregunta()
        }, 2000)
      } else {
        // Respuesta incorrecta: GAME OVER
        this.lastAnswerCorrect = false
        this.gameState.gameStatus = 'game_over'
        this.gameState.tiempoFin = new Date()

        console.log(`❌ Incorrecto. Juego terminado. Puntaje final: ${this.gameState.totalScore}`)

        // Guardar partida
        if (userId) {
          await this.guardarPartida(userId)
        }
      }
    },

    /**
     * Salta la pregunta actual con penalización
     */
    async saltarPregunta() {
      if (!this.canSkip || !this.isPlaying) return

      const costo = this.nextSkipCost
      this.gameState.totalScore += costo // costo es negativo
      this.gameState.skipsUsed++

      console.log(`⏭️ Pregunta saltada. Penalización: ${costo}. Total: ${this.gameState.totalScore}`)

      // Cargar siguiente pregunta (misma dificultad)
      this.gameState.questionNumber-- // Decrementar para mantener misma dificultad
      await this.cargarSiguientePregunta()
    },

    /**
     * Guarda la partida en Supabase
     */
    async guardarPartida(userId: string) {
      if (!this.gameState.tiempoInicio) return

      try {
        const tiempoSegundos = this.gameState.tiempoFin
          ? Math.floor((this.gameState.tiempoFin.getTime() - this.gameState.tiempoInicio.getTime()) / 1000)
          : 0

        const resultado = await triviaService.guardarPartida(userId, {
          questionsAnswered: this.gameState.questionsAnswered,
          totalScore: this.gameState.totalScore,
          skipsUsed: this.gameState.skipsUsed,
          timeSeconds: tiempoSegundos,
          highestDifficulty: this.currentDifficulty,
        })

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
      this.gameState = {
        gameId: null,
        currentQuestion: null,
        questionNumber: 0,
        totalScore: 0,
        skipsUsed: 0,
        gameStatus: 'not_started',
        tiempoInicio: null,
        tiempoFin: null,
        questionsAnswered: 0,
      }
      this.selectedAnswer = null
      this.showingResult = false
      this.error = null
      this.usedQuestions = [] // Limpiar preguntas usadas al reiniciar
    },

    clearError() {
      this.error = null
    },
  },
})

import { supabase, isSupabaseConfigured } from '@/config/supabase'
import type {
  TriviaQuestion,
  TriviaQuestionDisplay,
  TriviaGameResult,
  TriviaDifficulty,
} from '@/types'

/**
 * Servicio para el juego de Trivia
 * Usa un banco de preguntas en español y persistencia en Supabase
 */
export class TriviaService {
  // Banco de preguntas en español
  private readonly preguntasEspanol = {
    easy: [
      {
        question: '¿Cuál es la capital de Chile?',
        correct_answer: 'Santiago',
        incorrect_answers: ['Valparaíso', 'Concepción', 'Viña del Mar'],
        category: 'Geografía',
      },
      {
        question: '¿Cuántos días tiene un año bisiesto?',
        correct_answer: '366',
        incorrect_answers: ['365', '364', '367'],
        category: 'Conocimiento General',
      },
      {
        question: '¿Cuál es el océano más grande del mundo?',
        correct_answer: 'Pacífico',
        incorrect_answers: ['Atlántico', 'Índico', 'Ártico'],
        category: 'Geografía',
      },
      {
        question: '¿Qué animal es conocido como el rey de la selva?',
        correct_answer: 'León',
        incorrect_answers: ['Tigre', 'Elefante', 'Gorila'],
        category: 'Naturaleza',
      },
      {
        question: '¿Cuántos continentes hay en el mundo?',
        correct_answer: '7',
        incorrect_answers: ['5', '6', '8'],
        category: 'Geografía',
      },
      {
        question: '¿Cuál es el planeta más cercano al Sol?',
        correct_answer: 'Mercurio',
        incorrect_answers: ['Venus', 'Marte', 'Tierra'],
        category: 'Ciencia',
      },
      {
        question: '¿Qué color resulta de mezclar rojo y amarillo?',
        correct_answer: 'Naranja',
        incorrect_answers: ['Verde', 'Morado', 'Marrón'],
        category: 'Arte',
      },
      {
        question: '¿Cuántas patas tiene una araña?',
        correct_answer: '8',
        incorrect_answers: ['6', '10', '12'],
        category: 'Naturaleza',
      },
    ],
    medium: [
      {
        question: '¿En qué año se descubrió América?',
        correct_answer: '1492',
        incorrect_answers: ['1482', '1502', '1512'],
        category: 'Historia',
      },
      {
        question: '¿Cuál es el río más largo del mundo?',
        correct_answer: 'Amazonas',
        incorrect_answers: ['Nilo', 'Yangtsé', 'Misisipi'],
        category: 'Geografía',
      },
      {
        question: '¿Quién pintó la Mona Lisa?',
        correct_answer: 'Leonardo da Vinci',
        incorrect_answers: ['Miguel Ángel', 'Rafael', 'Donatello'],
        category: 'Arte',
      },
      {
        question: '¿Cuál es la moneda de Japón?',
        correct_answer: 'Yen',
        incorrect_answers: ['Won', 'Yuan', 'Rupia'],
        category: 'Conocimiento General',
      },
      {
        question: '¿En qué país se encuentra la Torre Eiffel?',
        correct_answer: 'Francia',
        incorrect_answers: ['Italia', 'España', 'Alemania'],
        category: 'Geografía',
      },
      {
        question: '¿Cuál es el metal más abundante en la corteza terrestre?',
        correct_answer: 'Aluminio',
        incorrect_answers: ['Hierro', 'Cobre', 'Oro'],
        category: 'Ciencia',
      },
      {
        question: '¿Qué órgano del cuerpo humano bombea sangre?',
        correct_answer: 'Corazón',
        incorrect_answers: ['Pulmones', 'Hígado', 'Riñones'],
        category: 'Ciencia',
      },
      {
        question: '¿Cuántos huesos tiene el cuerpo humano adulto?',
        correct_answer: '206',
        incorrect_answers: ['186', '216', '196'],
        category: 'Ciencia',
      },
    ],
    hard: [
      {
        question: '¿En qué año cayó el Muro de Berlín?',
        correct_answer: '1989',
        incorrect_answers: ['1987', '1991', '1985'],
        category: 'Historia',
      },
      {
        question: '¿Cuál es el elemento químico con símbolo Au?',
        correct_answer: 'Oro',
        incorrect_answers: ['Plata', 'Aluminio', 'Argón'],
        category: 'Ciencia',
      },
      {
        question: '¿Quién escribió "Cien años de soledad"?',
        correct_answer: 'Gabriel García Márquez',
        incorrect_answers: ['Mario Vargas Llosa', 'Jorge Luis Borges', 'Pablo Neruda'],
        category: 'Literatura',
      },
      {
        question: '¿Cuál es la velocidad de la luz en el vacío (aproximadamente)?',
        correct_answer: '300,000 km/s',
        incorrect_answers: ['150,000 km/s', '450,000 km/s', '200,000 km/s'],
        category: 'Ciencia',
      },
      {
        question: '¿En qué año comenzó la Primera Guerra Mundial?',
        correct_answer: '1914',
        incorrect_answers: ['1912', '1916', '1918'],
        category: 'Historia',
      },
      {
        question: '¿Cuál es la capital de Australia?',
        correct_answer: 'Canberra',
        incorrect_answers: ['Sídney', 'Melbourne', 'Brisbane'],
        category: 'Geografía',
      },
      {
        question: '¿Quién desarrolló la teoría de la relatividad?',
        correct_answer: 'Albert Einstein',
        incorrect_answers: ['Isaac Newton', 'Galileo Galilei', 'Stephen Hawking'],
        category: 'Ciencia',
      },
      {
        question: '¿Cuál es el idioma más hablado en el mundo por número de hablantes nativos?',
        correct_answer: 'Chino Mandarín',
        incorrect_answers: ['Inglés', 'Español', 'Hindi'],
        category: 'Conocimiento General',
      },
    ],
  }

  /**
   * Obtiene una pregunta de trivia en español
   * @param difficulty - Dificultad de la pregunta
   * @param usedQuestions - Array de preguntas ya mostradas (para evitar repeticiones)
   */
  async fetchQuestion(difficulty: TriviaDifficulty, usedQuestions: string[] = []): Promise<TriviaQuestionDisplay> {
    try {
      // Obtener preguntas de la dificultad solicitada
      const questions = this.preguntasEspanol[difficulty]

      // Filtrar preguntas que no se han mostrado aún
      const availableQuestions = questions.filter(
        q => !usedQuestions.includes(q.question)
      )

      // Si no hay preguntas disponibles (todas fueron usadas), resetear y usar todas
      const questionsToUse = availableQuestions.length > 0 ? availableQuestions : questions

      // Seleccionar una pregunta aleatoria de las disponibles
      const randomIndex = Math.floor(Math.random() * questionsToUse.length)
      const selectedQuestion = questionsToUse[randomIndex]

      const question: TriviaQuestion = {
        id: crypto.randomUUID(),
        question: selectedQuestion.question,
        correct_answer: selectedQuestion.correct_answer,
        incorrect_answers: selectedQuestion.incorrect_answers,
        category: selectedQuestion.category,
        difficulty: difficulty,
        type: 'multiple',
      }

      // Mezclar opciones
      return this.prepareQuestionForDisplay(question)
    } catch (error) {
      console.error('Error obteniendo pregunta:', error)
      // En caso de error, retornar pregunta por defecto
      return this.getDefaultQuestion(difficulty)
    }
  }

  /**
   * Prepara la pregunta para mostrar, mezclando las opciones
   */
  private prepareQuestionForDisplay(question: TriviaQuestion): TriviaQuestionDisplay {
    // Combinar respuesta correcta con incorrectas
    const allOptions = [question.correct_answer, ...question.incorrect_answers]

    // Mezclar opciones usando Fisher-Yates shuffle
    const shuffledOptions = this.shuffleArray([...allOptions])

    return {
      question: question.question,
      options: shuffledOptions,
      correctAnswer: question.correct_answer,
      difficulty: question.difficulty as TriviaDifficulty,
      category: question.category,
    }
  }

  /**
   * Mezcla un array usando algoritmo Fisher-Yates
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  /**
   * Pregunta por defecto en caso de error
   */
  private getDefaultQuestion(difficulty: TriviaDifficulty): TriviaQuestionDisplay {
    const defaults = {
      easy: {
        question: '¿Cuál es la capital de Francia?',
        options: ['París', 'Londres', 'Berlín', 'Madrid'],
        correctAnswer: 'París',
        category: 'Geografía',
      },
      medium: {
        question: '¿En qué año llegó el hombre a la Luna?',
        options: ['1969', '1968', '1970', '1971'],
        correctAnswer: '1969',
        category: 'Historia',
      },
      hard: {
        question: '¿Cuál es el elemento químico con símbolo Fe?',
        options: ['Hierro', 'Plata', 'Cobre', 'Oro'],
        correctAnswer: 'Hierro',
        category: 'Ciencia',
      },
    }

    const fallback = defaults[difficulty]
    return {
      ...fallback,
      difficulty,
      options: this.shuffleArray(fallback.options),
    }
  }

  /**
   * Verifica si el usuario ya jugó hoy
   */
  async verificarPartidaDelDia(
    userId: string
  ): Promise<{ yaJugo: boolean; partida: TriviaGameResult | null }> {
    if (!isSupabaseConfigured()) {
      return { yaJugo: false, partida: null }
    }

    try {
      const fechaHoy = new Date().toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('trivia_game_results')
        .select('*')
        .eq('user_id', userId)
        .gte('fecha_juego', `${fechaHoy}T00:00:00`)
        .lte('fecha_juego', `${fechaHoy}T23:59:59`)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        console.warn('Error verificando partida:', error)
      }

      if (data) {
        return {
          yaJugo: true,
          partida: {
            gameId: data.id,
            userId: data.user_id,
            questionsAnswered: data.questions_answered,
            totalScore: data.total_score,
            skipsUsed: data.skips_used,
            timeSeconds: data.time_seconds,
            highestDifficulty: data.highest_difficulty,
            fechaJuego: new Date(data.fecha_juego),
          },
        }
      }

      return { yaJugo: false, partida: null }
    } catch (error) {
      console.error('Error en verificarPartidaDelDia:', error)
      return { yaJugo: false, partida: null }
    }
  }

  /**
   * Guarda la partida en Supabase
   */
  async guardarPartida(
    userId: string,
    gameData: {
      questionsAnswered: number
      totalScore: number
      skipsUsed: number
      timeSeconds: number
      highestDifficulty: TriviaDifficulty
    }
  ): Promise<TriviaGameResult | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase no configurado, partida no guardada')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('trivia_game_results')
        .insert({
          user_id: userId,
          questions_answered: gameData.questionsAnswered,
          total_score: gameData.totalScore,
          skips_used: gameData.skipsUsed,
          time_seconds: gameData.timeSeconds,
          highest_difficulty: gameData.highestDifficulty,
          fecha_juego: new Date().toISOString(),
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
        questionsAnswered: data.questions_answered,
        totalScore: data.total_score,
        skipsUsed: data.skips_used,
        timeSeconds: data.time_seconds,
        highestDifficulty: data.highest_difficulty,
        fechaJuego: new Date(data.fecha_juego),
      }
    } catch (error) {
      console.error('Error en guardarPartida:', error)
      return null
    }
  }
}

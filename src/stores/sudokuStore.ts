import { defineStore } from 'pinia'
import { sudokuService } from '@/services/SudokuService'
import { useTicketStore } from './ticketStore'
import { usePerfilStore } from './perfilStore'
import type {
  SudokuGameState,
  SudokuDifficulty,
  SudokuMove,
  SudokuGameResult,
  SudokuStats,
} from '@/types'

/**
 * Store de Sudoku - Maneja el estado del juego y la lógica de negocio
 * Implementa integración con sistema de tickets y puntos
 */
export const useSudokuStore = defineStore('sudoku', {
  state: () => ({
    gameState: null as SudokuGameState | null,
    loading: false,
    error: null as string | null,
    history: [] as SudokuMove[], // Historial de movimientos para deshacer/rehacer
    redoStack: [] as SudokuMove[], // Stack para rehacer movimientos
    lastPlayedToday: null as Date | null, // Última vez que jugó gratis hoy
    timerInterval: null as number | null, // Intervalo del timer
    stats: null as SudokuStats | null,
  }),

  getters: {
    /**
     * Verifica si hay un juego en progreso
     */
    gameInProgress: (state) => state.gameState !== null && !state.gameState.isComplete,

    /**
     * Verifica si puede jugar (no completado, no pausado)
     */
    canPlay: (state) => {
      return (
        state.gameState !== null &&
        !state.gameState.isComplete &&
        !state.gameState.isPaused
      )
    },

    /**
     * Obtiene el tablero actual como matriz numérica
     */
    currentBoard: (state) => {
      if (!state.gameState) return null
      return state.gameState.board.cells.map((row) => row.map((cell) => cell.value))
    },

    /**
     * Verifica si puede deshacer un movimiento
     */
    canUndo: (state) => state.history.length > 0,

    /**
     * Verifica si puede rehacer un movimiento
     */
    canRedo: (state) => state.redoStack.length > 0,

    /**
     * Calcula el puntaje actual basado en el estado del juego
     */
    currentScore: (state) => {
      if (!state.gameState) return 0

      const difficulty = state.gameState.difficulty
      const basePoints = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50
      const errorPenalty = state.gameState.errors * 2
      const hintPenalty = state.gameState.hintsUsed * 5

      return Math.max(0, basePoints - errorPenalty - hintPenalty)
    },

    /**
     * Verifica si ya jugó su partida gratuita hoy
     */
    hasPlayedFreeGameToday(state) {
      if (!state.lastPlayedToday) return false

      const today = new Date()
      const lastPlayed = new Date(state.lastPlayedToday)

      return (
        today.getFullYear() === lastPlayed.getFullYear() &&
        today.getMonth() === lastPlayed.getMonth() &&
        today.getDate() === lastPlayed.getDate()
      )
    },

    /**
     * Obtiene el tiempo formateado MM:SS
     */
    formattedTime: (state) => {
      if (!state.gameState) return '00:00'
      const seconds = state.gameState.elapsedTime
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    },

    /**
     * Calcula el porcentaje de completado
     */
    completionPercentage: (state) => {
      if (!state.gameState) return 0
      let filledCells = 0
      const totalCells = 81

      state.gameState.board.cells.forEach((row) => {
        row.forEach((cell) => {
          if (cell.value !== 0) filledCells++
        })
      })

      return Math.round((filledCells / totalCells) * 100)
    },
  },

  actions: {
    /**
     * Inicia un nuevo juego de Sudoku
     */
    async startNewGame(difficulty: SudokuDifficulty, userId?: string) {
      this.loading = true
      this.error = null

      try {
        const ticketStore = useTicketStore()

        // Verificar si puede jugar gratis o necesita tickets
        if (this.hasPlayedFreeGameToday) {
          // Ya jugó gratis hoy, necesita tickets
          if (!ticketStore.tieneTicketsDisponibles) {
            this.error = 'No tienes tickets disponibles. Compra más tickets para seguir jugando.'
            this.loading = false
            return false
          }

          // Usar un ticket
          if (!ticketStore.usarTicket()) {
            this.error = 'Error al usar ticket'
            this.loading = false
            return false
          }

          console.log('🎫 Ticket usado para jugar Sudoku')
        } else {
          // Primera partida gratis del día
          this.lastPlayedToday = new Date()
          console.log('🆓 Partida gratuita de Sudoku')
        }

        // Generar nuevo puzzle
        const puzzle = sudokuService.generatePuzzle(difficulty)

        // Inicializar estado del juego
        this.gameState = {
          gameId: `sudoku-${Date.now()}`,
          board: puzzle,
          difficulty,
          startTime: new Date(),
          endTime: null,
          elapsedTime: 0,
          errors: 0,
          hintsUsed: 0,
          isComplete: false,
          isPaused: false,
          pencilMode: false,
        }

        // Limpiar historial
        this.history = []
        this.redoStack = []

        // Iniciar timer
        this.startTimer()

        console.log(`🎮 Nuevo juego de Sudoku iniciado - Dificultad: ${difficulty}`)
        return true
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al iniciar juego'
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Inicia el timer del juego
     */
    startTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
      }

      this.timerInterval = window.setInterval(() => {
        if (this.gameState && !this.gameState.isPaused && !this.gameState.isComplete) {
          this.gameState.elapsedTime++
        }
      }, 1000)
    },

    /**
     * Detiene el timer
     */
    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
    },

    /**
     * Pausa o reanuda el juego
     */
    togglePause() {
      if (!this.gameState) return

      this.gameState.isPaused = !this.gameState.isPaused

      if (this.gameState.isPaused) {
        this.stopTimer()
        console.log('⏸️ Juego pausado')
      } else {
        this.startTimer()
        console.log('▶️ Juego reanudado')
      }
    },

    /**
     * Coloca un número en una celda
     */
    placeNumber(row: number, col: number, num: number) {
      if (!this.gameState || !this.canPlay) return false

      const cell = this.gameState.board.cells[row][col]

      // No se puede modificar celdas originales
      if (cell.isOriginal) {
        this.error = 'No puedes modificar los números originales'
        setTimeout(() => (this.error = null), 2000)
        return false
      }

      // Si es modo lápiz, agregar nota
      if (this.gameState.pencilMode) {
        this.toggleNote(row, col, num)
        return true
      }

      // Guardar en historial para deshacer
      const move: SudokuMove = {
        row,
        col,
        previousValue: cell.value,
        newValue: num,
        timestamp: new Date(),
      }
      this.history.push(move)
      this.redoStack = [] // Limpiar stack de rehacer

      // Colocar número
      cell.value = num
      cell.notes = [] // Limpiar notas al colocar número

      // Validar movimiento
      const board = this.currentBoard
      if (board) {
        cell.isValid = sudokuService.isValidMove(board, row, col, num)

        // Contar error si el movimiento no es válido
        if (!cell.isValid) {
          this.gameState.errors++
          console.log(`❌ Error detectado (Total: ${this.gameState.errors})`)
        }
      }

      // Verificar si el juego está completo
      this.checkCompletion()

      return true
    },

    /**
     * Borra el número de una celda
     */
    clearCell(row: number, col: number) {
      if (!this.gameState || !this.canPlay) return false

      const cell = this.gameState.board.cells[row][col]

      if (cell.isOriginal) {
        this.error = 'No puedes borrar los números originales'
        setTimeout(() => (this.error = null), 2000)
        return false
      }

      // Guardar en historial
      const move: SudokuMove = {
        row,
        col,
        previousValue: cell.value,
        newValue: 0,
        timestamp: new Date(),
      }
      this.history.push(move)
      this.redoStack = []

      cell.value = 0
      cell.isValid = true
      cell.notes = []

      return true
    },

    /**
     * Alterna una nota en modo lápiz
     */
    toggleNote(row: number, col: number, num: number) {
      if (!this.gameState || !this.canPlay) return

      const cell = this.gameState.board.cells[row][col]

      if (cell.isOriginal || cell.value !== 0) return

      const noteIndex = cell.notes.indexOf(num)
      if (noteIndex > -1) {
        cell.notes.splice(noteIndex, 1)
      } else {
        cell.notes.push(num)
        cell.notes.sort()
      }
    },

    /**
     * Alterna el modo lápiz
     */
    togglePencilMode() {
      if (!this.gameState) return

      this.gameState.pencilMode = !this.gameState.pencilMode
      console.log(this.gameState.pencilMode ? '✏️ Modo lápiz activado' : '🖊️ Modo normal activado')
    },

    /**
     * Deshace el último movimiento
     */
    undo() {
      if (!this.canUndo || !this.gameState) return

      const move = this.history.pop()
      if (!move) return

      // Guardar en stack de rehacer
      this.redoStack.push(move)

      // Restaurar valor anterior
      const cell = this.gameState.board.cells[move.row][move.col]
      cell.value = move.previousValue

      // Re-validar
      const board = this.currentBoard
      if (board && move.previousValue !== 0) {
        cell.isValid = sudokuService.isValidMove(board, move.row, move.col, move.previousValue)
      } else {
        cell.isValid = true
      }

      console.log('↩️ Movimiento deshecho')
    },

    /**
     * Rehace un movimiento
     */
    redo() {
      if (!this.canRedo || !this.gameState) return

      const move = this.redoStack.pop()
      if (!move) return

      // Guardar en historial
      this.history.push(move)

      // Aplicar movimiento
      const cell = this.gameState.board.cells[move.row][move.col]
      cell.value = move.newValue

      // Re-validar
      const board = this.currentBoard
      if (board && move.newValue !== 0) {
        cell.isValid = sudokuService.isValidMove(board, move.row, move.col, move.newValue)
      } else {
        cell.isValid = true
      }

      console.log('↪️ Movimiento rehecho')
    },

    /**
     * Obtiene una pista (costo: puntos acumulados del usuario)
     */
    async getHint() {
      if (!this.gameState || !this.canPlay) return false

      const perfilStore = usePerfilStore()

      // Verificar si tiene puntos suficientes
      if (perfilStore.puntosActuales < 5) {
        this.error = 'Necesitas al menos 5 puntos para usar una pista'
        setTimeout(() => (this.error = null), 3000)
        return false
      }

      const board = this.currentBoard
      const solution = this.gameState.board.solution

      if (!board) return false

      const hint = sudokuService.getHint(board, solution)

      if (!hint) {
        this.error = 'No hay pistas disponibles'
        setTimeout(() => (this.error = null), 2000)
        return false
      }

      // Descontar puntos
      await perfilStore.actualizarPuntos(-5)

      // Colocar pista
      const cell = this.gameState.board.cells[hint.row][hint.col]
      cell.value = hint.value
      cell.isValid = true
      cell.isOriginal = true // Marcar como original para que no se pueda borrar

      this.gameState.hintsUsed++

      console.log(`💡 Pista usada (Total: ${this.gameState.hintsUsed}) - Puntos restados: 5`)

      // Verificar si el juego está completo
      this.checkCompletion()

      return true
    },

    /**
     * Verifica si el juego está completo
     */
    checkCompletion() {
      if (!this.gameState) return

      const board = this.currentBoard
      const solution = this.gameState.board.solution

      if (!board) return

      // Verificar si todas las celdas están llenas
      let isFullyFilled = true
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            isFullyFilled = false
            break
          }
        }
        if (!isFullyFilled) break
      }

      // Si está lleno, verificar si es correcto
      if (isFullyFilled) {
        const isSolved = sudokuService.isSolved(board, solution)

        this.gameState.isComplete = true
        this.gameState.endTime = new Date()
        this.stopTimer()

        if (isSolved) {
          console.log('🎉 ¡Sudoku completado correctamente!')
        } else {
          console.log('❌ Sudoku completado con errores')
        }

        // Guardar resultado y actualizar puntos
        this.saveGameResult()
      }
    },

    /**
     * Guarda el resultado del juego y actualiza puntos del usuario
     */
    async saveGameResult() {
      if (!this.gameState) return

      const perfilStore = usePerfilStore()
      const difficulty = this.gameState.difficulty

      // Calcular puntos base según dificultad
      const basePoints = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50

      // Penalizaciones
      const errorPenalty = this.gameState.errors * 2
      const hintPenalty = this.gameState.hintsUsed * 5

      // Bonus por tiempo: puntosIniciales - 1 por cada minuto
      const minutosTranscurridos = Math.floor(this.gameState.elapsedTime / 60)
      const bonusInicial = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20
      const timeBonus = Math.max(0, bonusInicial - minutosTranscurridos)

      // Calcular puntaje final
      const finalScore = Math.max(0, basePoints - errorPenalty - hintPenalty + timeBonus)

      // Crear resultado
      const result: SudokuGameResult = {
        gameId: this.gameState.gameId || `sudoku-${Date.now()}`,
        userId: perfilStore.userProfile?.id || 'guest',
        difficulty,
        completed: true,
        timeSeconds: this.gameState.elapsedTime,
        errors: this.gameState.errors,
        hintsUsed: this.gameState.hintsUsed,
        basePoints,
        errorPenalty,
        hintPenalty,
        timebonus: timeBonus,
        finalScore,
        fechaJuego: new Date(),
      }

      // Actualizar puntos del usuario
      await perfilStore.actualizarPuntos(finalScore)

      console.log(`📊 Resultado guardado:`, {
        puntos: finalScore,
        tiempo: this.formattedTime,
        errores: this.gameState.errors,
        pistas: this.gameState.hintsUsed,
      })

      // TODO: Guardar en base de datos cuando esté implementado
      // await supabase.insert('sudoku_games', result)
    },

    /**
     * Reinicia el juego actual
     */
    resetGame() {
      if (!this.gameState) return

      const ticketStore = useTicketStore()

      // Devolver ticket si no lo completó
      if (!this.gameState.isComplete && !this.hasPlayedFreeGameToday) {
        ticketStore.devolverTicket()
      }

      this.stopTimer()
      this.gameState = null
      this.history = []
      this.redoStack = []
      this.error = null

      console.log('🔄 Juego reiniciado')
    },

    /**
     * Carga las estadísticas del usuario
     */
    async loadStats(userId: string) {
      // TODO: Implementar carga desde base de datos
      this.stats = {
        partidasJugadas: 0,
        partidasCompletadas: 0,
        mejorTiempo: {
          easy: Infinity,
          medium: Infinity,
          hard: Infinity,
        },
        promedioTiempo: {
          easy: 0,
          medium: 0,
          hard: 0,
        },
        totalPuntos: 0,
        promedioErrores: 0,
        tasaCompletado: 0,
      }
    },

    clearError() {
      this.error = null
    },
  },
})

import type { ISudokuService } from './interfaces/ISudokuService'
import type { SudokuBoard, SudokuDifficulty, SudokuCell } from '@/types'

/**
 * Servicio para la generación y validación de puzzles Sudoku
 * Implementa el principio de Responsabilidad Única (SRP)
 */
export class SudokuService implements ISudokuService {
  private readonly GRID_SIZE = 9
  private readonly BOX_SIZE = 3

  /**
   * Número de celdas a remover según la dificultad
   */
  private readonly DIFFICULTY_CELLS_TO_REMOVE: Record<SudokuDifficulty, number> = {
    easy: 40, // 40 celdas vacías (49% del tablero)
    medium: 50, // 50 celdas vacías (62% del tablero)
    hard: 60 // 60 celdas vacías (74% del tablero)
  }

  /**
   * Genera un nuevo tablero de Sudoku completo y válido
   */
  private generateCompleteBoard(): number[][] {
    const board: number[][] = Array(this.GRID_SIZE)
      .fill(0)
      .map(() => Array(this.GRID_SIZE).fill(0))

    this.fillBoard(board)
    return board
  }

  /**
   * Rellena el tablero usando backtracking con números aleatorios
   */
  private fillBoard(board: number[][]): boolean {
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        if (board[row][col] === 0) {
          // Generar números del 1-9 en orden aleatorio
          const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9])

          for (const num of numbers) {
            if (this.isValidMove(board, row, col, num)) {
              board[row][col] = num

              if (this.fillBoard(board)) {
                return true
              }

              board[row][col] = 0
            }
          }

          return false
        }
      }
    }

    return true
  }

  /**
   * Mezcla un array usando el algoritmo Fisher-Yates
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
   * Remueve celdas del tablero completo para crear el puzzle
   */
  private removeCells(board: number[][], cellsToRemove: number): number[][] {
    const puzzle = board.map((row) => [...row])
    let removed = 0

    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * this.GRID_SIZE)
      const col = Math.floor(Math.random() * this.GRID_SIZE)

      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0
        removed++
      }
    }

    return puzzle
  }

  /**
   * Convierte un tablero numérico a la estructura SudokuBoard con celdas
   */
  private createSudokuBoard(puzzle: number[][], solution: number[][]): SudokuBoard {
    const cells: SudokuCell[][] = Array(this.GRID_SIZE)
      .fill(0)
      .map(() => Array(this.GRID_SIZE))

    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        cells[row][col] = {
          value: puzzle[row][col],
          isOriginal: puzzle[row][col] !== 0,
          isValid: true,
          notes: []
        }
      }
    }

    return {
      cells,
      solution
    }
  }

  /**
   * Genera un nuevo tablero de Sudoku con la dificultad especificada
   */
  generatePuzzle(difficulty: SudokuDifficulty): SudokuBoard {
    const solution = this.generateCompleteBoard()
    const cellsToRemove = this.DIFFICULTY_CELLS_TO_REMOVE[difficulty]
    const puzzle = this.removeCells(solution, cellsToRemove)

    return this.createSudokuBoard(puzzle, solution)
  }

  /**
   * Valida si un número puede colocarse en una posición específica
   */
  isValidMove(board: number[][], row: number, col: number, num: number): boolean {
    // Verificar fila (excluyendo la posición actual)
    for (let x = 0; x < this.GRID_SIZE; x++) {
      if (x !== col && board[row][x] === num) {
        return false
      }
    }

    // Verificar columna (excluyendo la posición actual)
    for (let x = 0; x < this.GRID_SIZE; x++) {
      if (x !== row && board[x][col] === num) {
        return false
      }
    }

    // Verificar caja 3x3 (excluyendo la posición actual)
    const boxStartRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE
    const boxStartCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE

    for (let i = 0; i < this.BOX_SIZE; i++) {
      for (let j = 0; j < this.BOX_SIZE; j++) {
        const currentRow = boxStartRow + i
        const currentCol = boxStartCol + j
        if (!(currentRow === row && currentCol === col) && board[currentRow][currentCol] === num) {
          return false
        }
      }
    }

    return true
  }

  /**
   * Valida si el tablero completo es una solución válida
   */
  isValidBoard(board: number[][]): boolean {
    // Verificar que todas las celdas estén llenas
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        if (board[row][col] === 0) {
          return false
        }
      }
    }

    // Verificar filas
    for (let row = 0; row < this.GRID_SIZE; row++) {
      const seen = new Set<number>()
      for (let col = 0; col < this.GRID_SIZE; col++) {
        const num = board[row][col]
        if (seen.has(num)) {
          return false
        }
        seen.add(num)
      }
    }

    // Verificar columnas
    for (let col = 0; col < this.GRID_SIZE; col++) {
      const seen = new Set<number>()
      for (let row = 0; row < this.GRID_SIZE; row++) {
        const num = board[row][col]
        if (seen.has(num)) {
          return false
        }
        seen.add(num)
      }
    }

    // Verificar cajas 3x3
    for (let boxRow = 0; boxRow < this.GRID_SIZE; boxRow += this.BOX_SIZE) {
      for (let boxCol = 0; boxCol < this.GRID_SIZE; boxCol += this.BOX_SIZE) {
        const seen = new Set<number>()
        for (let i = 0; i < this.BOX_SIZE; i++) {
          for (let j = 0; j < this.BOX_SIZE; j++) {
            const num = board[boxRow + i][boxCol + j]
            if (seen.has(num)) {
              return false
            }
            seen.add(num)
          }
        }
      }
    }

    return true
  }

  /**
   * Verifica si el tablero está completamente resuelto
   */
  isSolved(board: number[][], solution: number[][]): boolean {
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        if (board[row][col] !== solution[row][col]) {
          return false
        }
      }
    }
    return true
  }

  /**
   * Proporciona una pista revelando una celda vacía aleatoria
   */
  getHint(board: number[][], solution: number[][]): { row: number; col: number; value: number } | null {
    const emptyCells: { row: number; col: number }[] = []

    // Encontrar todas las celdas vacías
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        if (board[row][col] === 0) {
          emptyCells.push({ row, col })
        }
      }
    }

    if (emptyCells.length === 0) {
      return null
    }

    // Seleccionar una celda vacía aleatoria
    const randomIndex = Math.floor(Math.random() * emptyCells.length)
    const { row, col } = emptyCells[randomIndex]

    return {
      row,
      col,
      value: solution[row][col]
    }
  }

  /**
   * Resuelve el tablero usando backtracking
   */
  solvePuzzle(board: number[][]): number[][] | null {
    const solution = board.map((row) => [...row])

    if (this.solveBacktracking(solution)) {
      return solution
    }

    return null
  }

  /**
   * Algoritmo de backtracking para resolver el Sudoku
   */
  private solveBacktracking(board: number[][]): boolean {
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= this.GRID_SIZE; num++) {
            if (this.isValidMove(board, row, col, num)) {
              board[row][col] = num

              if (this.solveBacktracking(board)) {
                return true
              }

              board[row][col] = 0
            }
          }

          return false
        }
      }
    }

    return true
  }
}

// Exportar una instancia singleton del servicio
export const sudokuService = new SudokuService()

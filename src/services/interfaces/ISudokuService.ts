import type { SudokuBoard, SudokuDifficulty } from '@/types'

// Interface para el servicio de Sudoku (Principio de Inversión de Dependencias)
export interface ISudokuService {
  /**
   * Genera un nuevo tablero de Sudoku con la dificultad especificada
   * @param difficulty - Nivel de dificultad (easy, medium, hard)
   * @returns Tablero de Sudoku con celdas iniciales y solución
   */
  generatePuzzle(difficulty: SudokuDifficulty): SudokuBoard

  /**
   * Valida si un número puede colocarse en una posición específica
   * @param board - Tablero actual
   * @param row - Fila (0-8)
   * @param col - Columna (0-8)
   * @param num - Número a validar (1-9)
   * @returns true si el movimiento es válido según las reglas de Sudoku
   */
  isValidMove(board: number[][], row: number, col: number, num: number): boolean

  /**
   * Valida si el tablero completo es una solución válida
   * @param board - Tablero a validar
   * @returns true si el tablero es una solución válida de Sudoku
   */
  isValidBoard(board: number[][]): boolean

  /**
   * Verifica si el tablero está completamente resuelto
   * @param board - Tablero actual
   * @param solution - Solución correcta
   * @returns true si el tablero coincide con la solución
   */
  isSolved(board: number[][], solution: number[][]): boolean

  /**
   * Proporciona una pista revelando una celda vacía
   * @param board - Tablero actual
   * @param solution - Solución correcta
   * @returns Coordenadas de la celda revelada {row, col, value} o null si no hay celdas vacías
   */
  getHint(board: number[][], solution: number[][]): { row: number; col: number; value: number } | null

  /**
   * Resuelve el tablero usando backtracking
   * @param board - Tablero a resolver
   * @returns Tablero resuelto o null si no tiene solución
   */
  solvePuzzle(board: number[][]): number[][] | null
}

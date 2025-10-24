<template>
  <div class="sudoku-board-container">
    <div class="sudoku-board">
      <!-- Grid 9x9 -->
      <div
        v-for="(row, rowIndex) in board.cells"
        :key="`row-${rowIndex}`"
        class="sudoku-row"
      >
        <SudokuCell
          v-for="(cell, colIndex) in row"
          :key="`cell-${rowIndex}-${colIndex}`"
          :cell="cell"
          :row="rowIndex"
          :col="colIndex"
          :is-selected="selectedRow === rowIndex && selectedCol === colIndex"
          :is-highlighted="isCellHighlighted(rowIndex, colIndex)"
          @click="selectCell"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SudokuCell from './SudokuCell.vue'
import type { SudokuBoard as Board } from '@/types'

interface Props {
  board: Board
}

const props = defineProps<Props>()

const emit = defineEmits<{
  cellSelected: [row: number, col: number]
}>()

const selectedRow = ref<number | null>(null)
const selectedCol = ref<number | null>(null)

const selectCell = (row: number, col: number) => {
  selectedRow.value = row
  selectedCol.value = col
  emit('cellSelected', row, col)
}

/**
 * Determina si una celda debe estar resaltada
 * (misma fila, columna o caja 3x3 que la celda seleccionada)
 */
const isCellHighlighted = (row: number, col: number): boolean => {
  if (selectedRow.value === null || selectedCol.value === null) {
    return false
  }

  // Misma fila o columna
  if (row === selectedRow.value || col === selectedCol.value) {
    return true
  }

  // Misma caja 3x3
  const boxRow = Math.floor(row / 3)
  const boxCol = Math.floor(col / 3)
  const selectedBoxRow = Math.floor(selectedRow.value / 3)
  const selectedBoxCol = Math.floor(selectedCol.value / 3)

  return boxRow === selectedBoxRow && boxCol === selectedBoxCol
}

// Exponer método para deseleccionar (útil para controles externos)
const deselectCell = () => {
  selectedRow.value = null
  selectedCol.value = null
}

// Exponer getters para el componente padre
const getSelectedCell = computed(() => {
  if (selectedRow.value === null || selectedCol.value === null) {
    return null
  }
  return {
    row: selectedRow.value,
    col: selectedCol.value,
    cell: props.board.cells[selectedRow.value][selectedCol.value]
  }
})

defineExpose({
  deselectCell,
  getSelectedCell,
  selectedRow,
  selectedCol
})
</script>

<style scoped>
.sudoku-board-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.sudoku-board {
  display: inline-grid;
  grid-template-rows: repeat(9, 1fr);
  gap: 0;
  border: 3px solid var(--color-texto-principal, #1f2937);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  background-color: white;
  max-width: min(90vw, 500px);
  aspect-ratio: 1;
}

.sudoku-row {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .sudoku-board-container {
    padding: 0.5rem;
  }

  .sudoku-board {
    max-width: min(95vw, 450px);
  }
}

@media (max-width: 480px) {
  .sudoku-board {
    max-width: min(98vw, 380px);
    border-width: 2px;
  }
}
</style>

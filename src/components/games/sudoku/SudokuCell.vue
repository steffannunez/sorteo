<template>
  <div
    :class="cellClasses"
    @click="handleClick"
    role="button"
    tabindex="0"
  >
    <!-- Número de la celda -->
    <span v-if="cell.value !== 0" class="cell-number">
      {{ cell.value }}
    </span>

    <!-- Notas en modo lápiz -->
    <div v-else-if="cell.notes.length > 0" class="cell-notes">
      <span
        v-for="note in cell.notes"
        :key="note"
        class="note"
      >
        {{ note }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SudokuCell as Cell } from '@/types'

interface Props {
  cell: Cell
  row: number
  col: number
  isSelected: boolean
  isHighlighted: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [row: number, col: number]
}>()

const handleClick = () => {
  emit('click', props.row, props.col)
}

const cellClasses = computed(() => {
  const classes = ['sudoku-cell']

  // Celda original (parte del puzzle inicial)
  if (props.cell.isOriginal) {
    classes.push('cell-original')
  } else {
    classes.push('cell-editable')
  }

  // Celda seleccionada
  if (props.isSelected) {
    classes.push('cell-selected')
  }

  // Celdas relacionadas (misma fila, columna o caja)
  if (props.isHighlighted && !props.isSelected) {
    classes.push('cell-highlighted')
  }

  // Validación
  if (!props.cell.isValid && props.cell.value !== 0) {
    classes.push('cell-invalid')
  }

  // Bordes especiales para delimitar las cajas 3x3
  if (props.row % 3 === 2 && props.row !== 8) {
    classes.push('border-bottom-thick')
  }
  if (props.col % 3 === 2 && props.col !== 8) {
    classes.push('border-right-thick')
  }

  return classes
})
</script>

<style scoped>
.sudoku-cell {
  aspect-ratio: 1;
  border: 1px solid var(--color-bordes, #e5e7eb);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  position: relative;
  font-family: 'Arial', sans-serif;
}

.sudoku-cell:hover {
  background-color: #f3f4f6;
}

/* Número de la celda */
.cell-number {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 600;
  color: var(--color-texto-principal, #1f2937);
}

/* Celda original (parte del puzzle) */
.cell-original .cell-number {
  font-weight: 700;
  color: #1f2937;
}

/* Celda editable (ingresada por el usuario) */
.cell-editable .cell-number {
  color: #3b82f6;
  font-weight: 600;
}

/* Celda seleccionada */
.cell-selected {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px #3b82f6;
  z-index: 10;
}

/* Celdas relacionadas (misma fila, columna o caja) */
.cell-highlighted {
  background-color: #f0f9ff;
}

/* Celda inválida (error) */
.cell-invalid {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-color: #ef4444;
}

.cell-invalid .cell-number {
  color: #dc2626;
}

/* Bordes gruesos para delimitar cajas 3x3 */
.border-bottom-thick {
  border-bottom: 2px solid var(--color-texto-secundario, #6b7280);
}

.border-right-thick {
  border-right: 2px solid var(--color-texto-secundario, #6b7280);
}

/* Notas en modo lápiz */
.cell-notes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 100%;
  height: 100%;
  padding: 2px;
  gap: 1px;
}

.note {
  font-size: clamp(0.5rem, 1vw, 0.65rem);
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

/* Animación de pulsación */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.cell-editable:active {
  animation: pulse 0.2s ease;
}

/* Responsive */
@media (max-width: 640px) {
  .cell-number {
    font-size: clamp(1rem, 4vw, 1.5rem);
  }

  .note {
    font-size: clamp(0.4rem, 1.2vw, 0.6rem);
  }
}
</style>

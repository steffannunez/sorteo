<template>
  <div class="wordle-board">
    <!-- Filas del tablero (6 intentos) -->
    <div
      v-for="(row, rowIndex) in filas"
      :key="rowIndex"
      class="wordle-row"
    >
      <!-- Celdas de cada fila (5 letras) -->
      <div
        v-for="(letter, letterIndex) in row.letters"
        :key="letterIndex"
        :class="[
          'wordle-cell',
          getCellClass(letter.status, row.isSubmitted),
          {
            'cell-filled': letter.letter,
            'cell-empty': !letter.letter,
            'cell-shake': isShaking && rowIndex === intentoActual,
            'cell-flip': row.isSubmitted && shouldFlip,
          }
        ]"
        :style="row.isSubmitted ? getFlipDelay(letterIndex) : {}"
      >
        <span class="cell-letter">{{ letter.letter }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { WordleRow } from '@/types'

interface Props {
  filas: WordleRow[]
  intentoActual: number
  error?: string | null
}

const props = defineProps<Props>()

const isShaking = ref(false)
const shouldFlip = ref(false)

// Clases CSS según el estado de la letra
const getCellClass = (status: string, isSubmitted: boolean) => {
  if (!isSubmitted) return ''

  switch (status) {
    case 'correct':
      return 'cell-correct'
    case 'present':
      return 'cell-present'
    case 'absent':
      return 'cell-absent'
    default:
      return ''
  }
}

// Delay para la animación de volteo de cada letra
const getFlipDelay = (index: number) => {
  return {
    animationDelay: `${index * 0.15}s`,
  }
}

// Efecto de shake cuando hay error
watch(
  () => props.error,
  (newError) => {
    if (newError) {
      isShaking.value = true
      setTimeout(() => {
        isShaking.value = false
      }, 500)
    }
  }
)

// Activar animación de flip cuando se envía
watch(
  () => props.filas[props.intentoActual]?.isSubmitted,
  (isSubmitted) => {
    if (isSubmitted) {
      shouldFlip.value = true
      setTimeout(() => {
        shouldFlip.value = false
      }, 1500)
    }
  }
)
</script>

<style scoped>
.wordle-board {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.wordle-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
}

.wordle-cell {
  aspect-ratio: 1;
  border: 2px solid var(--color-bordes, #e5e7eb);
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  text-transform: uppercase;
  background-color: white;
  transition: all 0.2s ease;
  user-select: none;
}

.cell-letter {
  display: block;
  color: var(--color-texto-principal, #1f2937);
}

/* Estados de la celda */
.cell-filled {
  border-color: var(--color-texto-secundario, #6b7280);
  transform: scale(1.05);
}

.cell-empty {
  border-color: var(--color-bordes, #e5e7eb);
}

/* Colores según resultado */
.cell-correct {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: #059669;
  color: white;
}

.cell-correct .cell-letter {
  color: white;
}

.cell-present {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-color: #d97706;
  color: white;
}

.cell-present .cell-letter {
  color: white;
}

.cell-absent {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  border-color: #4b5563;
  color: white;
}

.cell-absent .cell-letter {
  color: white;
}

/* Animación de shake (error) */
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

.cell-shake {
  animation: shake 0.5s ease-in-out;
}

/* Animación de flip (revelar resultado) */
@keyframes flip {
  0% {
    transform: rotateX(0deg);
  }
  50% {
    transform: rotateX(90deg);
  }
  100% {
    transform: rotateX(0deg);
  }
}

.cell-flip {
  animation: flip 0.6s ease-in-out;
}

/* Responsive */
@media (max-width: 640px) {
  .wordle-board {
    padding: 0.5rem;
    max-width: 350px;
  }

  .wordle-cell {
    font-size: 1.5rem;
  }

  .wordle-row {
    gap: 0.375rem;
  }
}

@media (max-width: 380px) {
  .wordle-board {
    max-width: 300px;
  }

  .wordle-cell {
    font-size: 1.25rem;
  }
}
</style>

<template>
  <div class="sudoku-view">
    <BaseCard class="sudoku-container" variant="elevated">
      <!-- Header -->
      <template #header>
        <div class="header-content">
          <h1 class="game-title">Sudoku</h1>
          <p class="game-subtitle">Completa el puzzle y gana puntos</p>
        </div>
      </template>

      <!-- Contenido principal -->
      <div class="game-content">
        <!-- Selector de dificultad (antes de iniciar) -->
        <div v-if="!gameInProgress" class="game-setup">
          <SudokuDifficulty v-model="selectedDifficulty" />

          <div class="start-section">
            <!-- Advertencia si no tiene tickets -->
            <div v-if="hasPlayedFreeGameToday && !hasTickets" class="warning-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>Ya jugaste tu partida gratuita hoy. Compra tickets para seguir jugando.</span>
            </div>

            <!-- Info de partida gratuita -->
            <div v-else-if="!hasPlayedFreeGameToday" class="info-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>Partida gratuita disponible - ¡Juega sin gastar tickets!</span>
            </div>

            <BaseButton
              class="start-button"
              variant="primary"
              size="lg"
              :disabled="hasPlayedFreeGameToday && !hasTickets"
              @click="startGame"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              {{ hasPlayedFreeGameToday ? 'Jugar con ticket' : 'Comenzar partida gratis' }}
            </BaseButton>
          </div>
        </div>

        <!-- Juego en progreso -->
        <div v-else class="game-active">
          <!-- Mensaje de error -->
          <div v-if="error" class="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ error }}
          </div>

          <!-- Estadísticas -->
          <SudokuStats
            v-if="gameState"
            :formatted-time="formattedTime"
            :errors="gameState.errors"
            :hints-used="gameState.hintsUsed"
            :current-score="currentScore"
            :completion-percentage="completionPercentage"
            :difficulty="gameState.difficulty"
          />

          <!-- Tablero -->
          <SudokuBoard
            v-if="gameState"
            ref="boardRef"
            :board="gameState.board"
            @cell-selected="onCellSelected"
          />

          <!-- Controles -->
          <SudokuControls
            v-if="gameState"
            :has-selected-cell="hasSelectedCell"
            :can-undo="canUndo"
            :can-redo="canRedo"
            :pencil-mode="gameState.pencilMode"
            @place-number="placeNumber"
            @clear-cell="clearCell"
            @undo="undo"
            @redo="redo"
            @get-hint="getHint"
            @toggle-pencil="togglePencilMode"
          />

          <!-- Botones de acción del juego -->
          <div class="game-actions">
            <BaseButton
              variant="secondary"
              @click="togglePause"
            >
              {{ isPaused ? 'Reanudar' : 'Pausar' }}
            </BaseButton>

            <BaseButton
              variant="outline"
              @click="resetGame"
            >
              Nuevo juego
            </BaseButton>
          </div>

          <!-- Tutorial -->
          <GameTutorial
            :rules="[
              { text: 'Rellena la cuadrícula 9×9 con números del 1 al 9', icon: '🔢' },
              { text: 'Cada fila debe contener los números del 1 al 9 sin repetir', icon: '➡️' },
              { text: 'Cada columna debe contener los números del 1 al 9 sin repetir', icon: '⬇️' },
              { text: 'Cada subcuadrícula 3×3 debe contener los números del 1 al 9 sin repetir', icon: '⬛' },
              { text: 'Los números iniciales no se pueden modificar', icon: '🔒' },
              { text: 'Usa el modo lápiz para marcar números posibles', icon: '✏️' }
            ]"
            :tips="[
              'Usa Ctrl+Z/Y para deshacer/rehacer movimientos',
              'Presiona números del 1-9 en el teclado para colocarlos',
              'Presiona P para activar/desactivar el modo lápiz',
              'Presiona Delete o Backspace para borrar una celda',
              'Las pistas reducen tu puntuación (-5 puntos cada una)',
              'Completa el sudoku rápido para ganar bonos de tiempo',
              'Cada error te quita 2 puntos de tu puntuación final'
            ]"
            :start-collapsed="true"
          />

          <!-- Modal de juego completado -->
          <div v-if="gameState?.isComplete && scoreBreakdown" class="completion-modal">
            <div class="modal-content">
              <div class="completion-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2 class="completion-title">¡Sudoku completado!</h2>

              <!-- Estadísticas generales -->
              <div class="completion-stats">
                <div class="stat-item">
                  <span class="stat-label">Tiempo:</span>
                  <span class="stat-value">{{ formattedTime }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Errores:</span>
                  <span class="stat-value">{{ gameState.errors }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Pistas usadas:</span>
                  <span class="stat-value">{{ gameState.hintsUsed }}</span>
                </div>
              </div>

              <!-- Desglose de puntuación -->
              <div class="score-breakdown">
                <h3 class="breakdown-title">Cálculo de puntos</h3>
                <div class="breakdown-items">
                  <div class="breakdown-item positive">
                    <span class="breakdown-label">Puntos base ({{ gameState.difficulty }})</span>
                    <span class="breakdown-value">+{{ scoreBreakdown.basePoints }}</span>
                  </div>
                  <div class="breakdown-item negative" v-if="scoreBreakdown.errorPenalty > 0">
                    <span class="breakdown-label">Errores ({{ gameState.errors }} × 2)</span>
                    <span class="breakdown-value">-{{ scoreBreakdown.errorPenalty }}</span>
                  </div>
                  <div class="breakdown-item negative" v-if="scoreBreakdown.hintPenalty > 0">
                    <span class="breakdown-label">Pistas ({{ gameState.hintsUsed }} × 5)</span>
                    <span class="breakdown-value">-{{ scoreBreakdown.hintPenalty }}</span>
                  </div>
                  <div class="breakdown-item positive" v-if="scoreBreakdown.timeBonus > 0">
                    <span class="breakdown-label">Bonus por tiempo</span>
                    <span class="breakdown-value">+{{ scoreBreakdown.timeBonus }}</span>
                  </div>
                </div>
                <div class="breakdown-total">
                  <span class="total-label">Total:</span>
                  <span class="total-value">{{ scoreBreakdown.finalScore }} puntos</span>
                </div>
              </div>

              <BaseButton
                variant="primary"
                size="lg"
                @click="resetGame"
              >
                Jugar de nuevo
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSudokuStore } from '@/stores/sudokuStore'
import { useTicketStore } from '@/stores/ticketStore'
import { useAuthStore } from '@/stores/authStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SudokuBoard from '@/components/games/sudoku/SudokuBoard.vue'
import SudokuControls from '@/components/games/sudoku/SudokuControls.vue'
import SudokuStats from '@/components/games/sudoku/SudokuStats.vue'
import SudokuDifficulty from '@/components/games/sudoku/SudokuDifficulty.vue'
import GameTutorial from '@/components/ui/GameTutorial.vue'
import type { SudokuDifficulty as Difficulty } from '@/types'

const sudokuStore = useSudokuStore()
const ticketStore = useTicketStore()
const authStore = useAuthStore()

const boardRef = ref<InstanceType<typeof SudokuBoard> | null>(null)
const selectedDifficulty = ref<Difficulty>('medium')

// Computed properties del store
const gameState = computed(() => sudokuStore.gameState)
const gameInProgress = computed(() => sudokuStore.gameInProgress)
const canUndo = computed(() => sudokuStore.canUndo)
const canRedo = computed(() => sudokuStore.canRedo)
const formattedTime = computed(() => sudokuStore.formattedTime)
const currentScore = computed(() => sudokuStore.currentScore)
const completionPercentage = computed(() => sudokuStore.completionPercentage)
const error = computed(() => sudokuStore.error)
const hasPlayedFreeGameToday = computed(() => sudokuStore.hasPlayedFreeGameToday)
const isPaused = computed(() => gameState.value?.isPaused ?? false)

const hasTickets = computed(() => ticketStore.tieneTicketsDisponibles)

const hasSelectedCell = computed(() => {
  return boardRef.value?.selectedRow !== null && boardRef.value?.selectedCol !== null
})

// Cálculo detallado de puntos para el modal de victoria
const scoreBreakdown = computed(() => {
  if (!gameState.value) return null

  const difficulty = gameState.value.difficulty
  const basePoints = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50
  const errorPenalty = gameState.value.errors * 2
  const hintPenalty = gameState.value.hintsUsed * 5

  // Bonus por tiempo
  const minutosTranscurridos = Math.floor(gameState.value.elapsedTime / 60)
  const bonusInicial = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20
  const timeBonus = Math.max(0, bonusInicial - minutosTranscurridos)

  return {
    basePoints,
    errorPenalty,
    hintPenalty,
    timeBonus,
    finalScore: Math.max(0, basePoints - errorPenalty - hintPenalty + timeBonus)
  }
})

// Métodos
const startGame = async () => {
  const userId = authStore.user?.id
  const success = await sudokuStore.startNewGame(selectedDifficulty.value, userId)

  if (!success && sudokuStore.error) {
    setTimeout(() => {
      sudokuStore.clearError()
    }, 3000)
  }
}

const onCellSelected = (row: number, col: number) => {
  console.log(`Celda seleccionada: [${row}, ${col}]`)
}

const placeNumber = (num: number) => {
  if (!boardRef.value) return

  const selectedRow = boardRef.value.selectedRow
  const selectedCol = boardRef.value.selectedCol

  if (selectedRow !== null && selectedCol !== null) {
    sudokuStore.placeNumber(selectedRow, selectedCol, num)
  }
}

const clearCell = () => {
  if (!boardRef.value) return

  const selectedRow = boardRef.value.selectedRow
  const selectedCol = boardRef.value.selectedCol

  if (selectedRow !== null && selectedCol !== null) {
    sudokuStore.clearCell(selectedRow, selectedCol)
  }
}

const undo = () => {
  sudokuStore.undo()
}

const redo = () => {
  sudokuStore.redo()
}

const getHint = async () => {
  const success = await sudokuStore.getHint()

  if (!success && sudokuStore.error) {
    setTimeout(() => {
      sudokuStore.clearError()
    }, 3000)
  }
}

const togglePencilMode = () => {
  sudokuStore.togglePencilMode()
}

const togglePause = () => {
  sudokuStore.togglePause()
}

const resetGame = () => {
  sudokuStore.resetGame()
}

// Manejo de teclado
const handleKeyboard = (event: KeyboardEvent) => {
  if (!gameState.value || isPaused.value || gameState.value.isComplete) return

  // Números 1-9
  if (/^[1-9]$/.test(event.key)) {
    placeNumber(parseInt(event.key))
  }
  // Delete o Backspace para borrar
  else if (event.key === 'Delete' || event.key === 'Backspace') {
    clearCell()
  }
  // Ctrl+Z para deshacer
  else if (event.ctrlKey && event.key === 'z') {
    event.preventDefault()
    undo()
  }
  // Ctrl+Y o Ctrl+Shift+Z para rehacer
  else if (event.ctrlKey && (event.key === 'y' || (event.shiftKey && event.key === 'z'))) {
    event.preventDefault()
    redo()
  }
  // P para alternar modo lápiz
  else if (event.key === 'p' || event.key === 'P') {
    togglePencilMode()
  }
  // Espacio para pausar
  else if (event.key === ' ') {
    event.preventDefault()
    togglePause()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyboard)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard)
  sudokuStore.stopTimer()
})
</script>

<style scoped>
.sudoku-view {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.sudoku-container {
  max-width: 800px;
  margin: 0 auto;
}

.header-content {
  text-align: center;
}

.game-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.game-subtitle {
  font-size: 1rem;
  color: var(--color-texto-secundario, #6b7280);
  margin-top: 0.25rem;
}

.game-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Setup del juego */
.game-setup {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.start-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.start-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 250px;
  justify-content: center;
}

/* Mensajes */
.warning-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 2px solid #ef4444;
  border-radius: 0.75rem;
  color: #dc2626;
  font-weight: 600;
  max-width: 500px;
}

.info-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border: 2px solid #10b981;
  border-radius: 0.75rem;
  color: #059669;
  font-weight: 600;
  max-width: 500px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border: 2px solid #ef4444;
  border-radius: 0.75rem;
  color: #dc2626;
  font-weight: 600;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

/* Juego activo */
.game-active {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.game-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 0 1rem;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
}

/* Modal de completado */
.completion-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.completion-icon {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
}

.completion-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-texto-principal, #1f2937);
  text-align: center;
}

.completion-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.stat-item.highlight {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border: 2px solid #10b981;
}

.stat-label {
  font-weight: 600;
  color: var(--color-texto-secundario, #6b7280);
}

.stat-value {
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--color-texto-principal, #1f2937);
}

.stat-item.highlight .stat-value {
  color: #059669;
  font-size: 1.5rem;
}

/* Desglose de puntuación */
.score-breakdown {
  width: 100%;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 0.75rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
}

.breakdown-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-texto-secundario, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
  text-align: center;
}

.breakdown-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.breakdown-item.positive {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 1px solid #10b981;
}

.breakdown-item.negative {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #ef4444;
}

.breakdown-label {
  font-weight: 600;
  color: var(--color-texto-principal, #1f2937);
}

.breakdown-value {
  font-weight: 700;
  font-size: 1rem;
}

.breakdown-item.positive .breakdown-value {
  color: #059669;
}

.breakdown-item.negative .breakdown-value {
  color: #dc2626;
}

.breakdown-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 0.5rem;
  margin-top: 0.5rem;
}

.total-label {
  font-weight: 700;
  font-size: 1rem;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.total-value {
  font-weight: 700;
  font-size: 1.25rem;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .sudoku-view {
    padding: 1rem;
  }

  .game-title {
    font-size: 1.5rem;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .completion-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 640px) {
  .sudoku-view {
    padding: 0.5rem;
  }

  .game-actions {
    padding: 0 0.5rem;
  }
}
</style>

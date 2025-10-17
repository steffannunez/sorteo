<template>
  <div class="sudoku-stats">
    <!-- Timer -->
    <div class="stat-card timer-card">
      <div class="stat-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>
      <div class="stat-content">
        <div class="stat-label">Tiempo</div>
        <div class="stat-value timer-value">{{ formattedTime }}</div>
      </div>
    </div>

    <!-- Errores -->
    <div class="stat-card errors-card">
      <div class="stat-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <div class="stat-content">
        <div class="stat-label">Errores</div>
        <div class="stat-value">{{ errors }}</div>
      </div>
    </div>

    <!-- Pistas usadas -->
    <div class="stat-card hints-card">
      <div class="stat-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/>
          <path d="M9 21h6"/>
        </svg>
      </div>
      <div class="stat-content">
        <div class="stat-label">Pistas</div>
        <div class="stat-value">{{ hintsUsed }}</div>
      </div>
    </div>

    <!-- Puntos actuales -->
    <div class="stat-card score-card">
      <div class="stat-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>
      <div class="stat-content">
        <div class="stat-label">Puntos</div>
        <div class="stat-value score-value">{{ currentScore }}</div>
      </div>
    </div>

    <!-- Progreso -->
    <div class="stat-card progress-card full-width">
      <div class="stat-content">
        <div class="stat-label">Progreso</div>
        <div class="progress-container">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${completionPercentage}%` }"
            ></div>
          </div>
          <div class="progress-text">{{ completionPercentage }}%</div>
        </div>
      </div>
    </div>

    <!-- Dificultad -->
    <div class="stat-card difficulty-card">
      <div class="stat-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      </div>
      <div class="stat-content">
        <div class="stat-label">Dificultad</div>
        <div :class="['stat-value', 'difficulty-badge', `difficulty-${difficulty}`]">
          {{ difficultyLabel }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SudokuDifficulty } from '@/types'

interface Props {
  formattedTime: string
  errors: number
  hintsUsed: number
  currentScore: number
  completionPercentage: number
  difficulty: SudokuDifficulty
}

const props = defineProps<Props>()

const difficultyLabel = computed(() => {
  const labels: Record<SudokuDifficulty, string> = {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil'
  }
  return labels[props.difficulty]
})
</script>

<style scoped>
.sudoku-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  padding: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  border: 2px solid var(--color-bordes, #e5e7eb);
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.full-width {
  grid-column: 1 / -1;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.timer-card .stat-icon {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #3b82f6;
}

.errors-card .stat-icon {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #ef4444;
}

.hints-card .stat-icon {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #f59e0b;
}

.score-card .stat-icon {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #10b981;
}

.difficulty-card .stat-icon {
  background: linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%);
  color: #a855f7;
}

.stat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-texto-secundario, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-texto-principal, #1f2937);
}

.timer-value {
  color: #3b82f6;
  font-family: 'Courier New', monospace;
}

.score-value {
  color: #10b981;
}

/* Barra de progreso */
.progress-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar {
  flex: 1;
  height: 12px;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #10b981 100%);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-texto-principal, #1f2937);
  min-width: 50px;
  text-align: right;
}

/* Badge de dificultad */
.difficulty-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.difficulty-easy {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #059669;
}

.difficulty-medium {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
}

.difficulty-hard {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
}

/* Responsive */
@media (max-width: 640px) {
  .sudoku-stats {
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .stat-card {
    padding: 0.75rem;
    gap: 0.5rem;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
  }

  .stat-icon svg {
    width: 20px;
    height: 20px;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .sudoku-stats {
    grid-template-columns: 1fr;
  }

  .stat-card {
    flex-direction: row;
  }
}
</style>

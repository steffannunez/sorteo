<template>
  <div class="difficulty-selector">
    <h3 class="selector-title">Selecciona la dificultad</h3>

    <div class="difficulty-options">
      <!-- Fácil -->
      <button
        :class="['difficulty-option', 'easy-option', { 'selected': modelValue === 'easy' }]"
        @click="selectDifficulty('easy')"
      >
        <div class="option-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </div>
        <div class="option-content">
          <div class="option-title">Fácil</div>
          <div class="option-description">40 celdas vacías</div>
          <div class="option-points">+10 puntos base</div>
        </div>
        <div class="option-checkmark" v-if="modelValue === 'easy'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </button>

      <!-- Medio -->
      <button
        :class="['difficulty-option', 'medium-option', { 'selected': modelValue === 'medium' }]"
        @click="selectDifficulty('medium')"
      >
        <div class="option-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 15h8"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </div>
        <div class="option-content">
          <div class="option-title">Medio</div>
          <div class="option-description">50 celdas vacías</div>
          <div class="option-points">+25 puntos base</div>
        </div>
        <div class="option-checkmark" v-if="modelValue === 'medium'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </button>

      <!-- Difícil -->
      <button
        :class="['difficulty-option', 'hard-option', { 'selected': modelValue === 'hard' }]"
        @click="selectDifficulty('hard')"
      >
        <div class="option-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </div>
        <div class="option-content">
          <div class="option-title">Difícil</div>
          <div class="option-description">60 celdas vacías</div>
          <div class="option-points">+50 puntos base</div>
        </div>
        <div class="option-checkmark" v-if="modelValue === 'hard'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </button>
    </div>

    <!-- Información adicional -->
    <div class="info-box">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
      <span>-2 puntos por error | -5 puntos por pista | Bonus por velocidad</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SudokuDifficulty } from '@/types'

interface Props {
  modelValue: SudokuDifficulty
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [difficulty: SudokuDifficulty]
}>()

const selectDifficulty = (difficulty: SudokuDifficulty) => {
  emit('update:modelValue', difficulty)
}
</script>

<style scoped>
.difficulty-selector {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
}

.selector-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-texto-principal, #1f2937);
  text-align: center;
}

.difficulty-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.difficulty-option {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  border: 3px solid transparent;
  border-radius: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.difficulty-option:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.option-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

/* Estilos por dificultad */
.easy-option .option-icon {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #059669;
}

.easy-option.selected {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
}

.medium-option .option-icon {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
}

.medium-option.selected {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.hard-option .option-icon {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
}

.hard-option.selected {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
}

.option-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.option-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-texto-principal, #1f2937);
}

.option-description {
  font-size: 0.875rem;
  color: var(--color-texto-secundario, #6b7280);
}

.option-points {
  font-size: 0.875rem;
  font-weight: 600;
  color: #10b981;
  margin-top: 0.25rem;
}

.option-checkmark {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

/* Info box */
.info-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 2px solid #3b82f6;
  border-radius: 0.75rem;
  color: #1e40af;
  font-size: 0.875rem;
  font-weight: 600;
}

.info-box svg {
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .difficulty-options {
    grid-template-columns: 1fr;
  }

  .difficulty-option {
    flex-direction: row;
    text-align: left;
    padding: 1rem;
  }

  .option-icon {
    width: 56px;
    height: 56px;
  }

  .option-icon svg {
    width: 28px;
    height: 28px;
  }

  .option-content {
    align-items: flex-start;
    flex: 1;
  }
}

@media (max-width: 640px) {
  .difficulty-selector {
    padding: 1rem;
    gap: 1rem;
  }

  .selector-title {
    font-size: 1.25rem;
  }

  .info-box {
    font-size: 0.75rem;
    padding: 0.75rem;
  }

  .info-box svg {
    width: 14px;
    height: 14px;
  }
}
</style>

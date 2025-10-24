<template>
  <div class="sudoku-controls">
    <!-- Botones numéricos (1-9) -->
    <div class="number-pad">
      <button
        v-for="num in 9"
        :key="num"
        :class="['number-button', { 'number-button-disabled': !hasSelectedCell }]"
        :disabled="!hasSelectedCell"
        @click="emit('placeNumber', num)"
      >
        {{ num }}
      </button>
    </div>

    <!-- Controles de acción -->
    <div class="action-controls">
      <!-- Modo lápiz -->
      <button
        :class="['action-button', 'pencil-button', { 'active': pencilMode }]"
        @click="emit('togglePencil')"
        :title="pencilMode ? 'Modo normal' : 'Modo lápiz'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
          <path d="m15 5 4 4"/>
        </svg>
        <span class="button-label">Lápiz</span>
      </button>

      <!-- Borrar celda -->
      <button
        class="action-button delete-button"
        :disabled="!hasSelectedCell"
        @click="emit('clearCell')"
        title="Borrar celda (Delete)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"/>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        </svg>
        <span class="button-label">Borrar</span>
      </button>

      <!-- Deshacer -->
      <button
        class="action-button undo-button"
        :disabled="!canUndo"
        @click="emit('undo')"
        title="Deshacer (Ctrl+Z)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 7v6h6"/>
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
        </svg>
        <span class="button-label">Deshacer</span>
      </button>

      <!-- Rehacer -->
      <button
        class="action-button redo-button"
        :disabled="!canRedo"
        @click="emit('redo')"
        title="Rehacer (Ctrl+Y)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 7v6h-6"/>
          <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>
        </svg>
        <span class="button-label">Rehacer</span>
      </button>

      <!-- Pista -->
      <button
        class="action-button hint-button"
        @click="emit('getHint')"
        title="Obtener pista (-5 puntos)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/>
          <path d="M9 21h6"/>
        </svg>
        <span class="button-label">Pista</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  hasSelectedCell: boolean
  canUndo: boolean
  canRedo: boolean
  pencilMode: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  placeNumber: [num: number]
  clearCell: []
  undo: []
  redo: []
  getHint: []
  togglePencil: []
}>()
</script>

<style scoped>
.sudoku-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

/* Teclado numérico */
.number-pad {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 0.5rem;
}

.number-button {
  aspect-ratio: 1;
  border: 2px solid var(--color-bordes, #e5e7eb);
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  color: var(--color-texto-principal, #1f2937);
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.number-button:hover:not(:disabled) {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.2);
}

.number-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.number-button-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Controles de acción */
.action-controls {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.75rem 0.5rem;
  border: 2px solid var(--color-bordes, #e5e7eb);
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  color: var(--color-texto-secundario, #6b7280);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.action-button:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.2);
}

.action-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.action-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.button-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Botón de lápiz activo */
.pencil-button.active {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #f59e0b;
  color: #d97706;
}

.pencil-button.active:hover {
  background: linear-gradient(135deg, #fde68a 0%, #fcd34d 100%);
  border-color: #d97706;
}

/* Botón de borrar */
.delete-button:hover:not(:disabled) {
  border-color: #ef4444;
  color: #ef4444;
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.2);
}

/* Botón de pista */
.hint-button:hover:not(:disabled) {
  border-color: #10b981;
  color: #10b981;
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.2);
}

/* Responsive */
@media (max-width: 640px) {
  .sudoku-controls {
    padding: 0.5rem;
  }

  .number-pad {
    gap: 0.375rem;
  }

  .number-button {
    font-size: 1rem;
  }

  .action-controls {
    gap: 0.375rem;
  }

  .action-button {
    padding: 0.5rem 0.25rem;
  }

  .button-label {
    font-size: 0.6rem;
  }

  .action-button svg {
    width: 16px;
    height: 16px;
  }
}

@media (max-width: 480px) {
  .number-pad {
    grid-template-columns: repeat(5, 1fr);
  }

  .action-controls {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

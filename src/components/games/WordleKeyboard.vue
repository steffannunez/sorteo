<template>
  <div class="wordle-keyboard">
    <!-- Fila 1: Q-P -->
    <div class="keyboard-row">
      <button
        v-for="key in fila1"
        :key="key"
        :class="['key', getKeyClass(key)]"
        @click="$emit('key-press', key)"
      >
        {{ key }}
      </button>
    </div>

    <!-- Fila 2: A-Ñ -->
    <div class="keyboard-row">
      <div class="spacer"></div>
      <button
        v-for="key in fila2"
        :key="key"
        :class="['key', getKeyClass(key)]"
        @click="$emit('key-press', key)"
      >
        {{ key }}
      </button>
      <div class="spacer"></div>
    </div>

    <!-- Fila 3: ENTER, Z-M, BACKSPACE -->
    <div class="keyboard-row">
      <button
        class="key key-action key-enter"
        @click="$emit('enter')"
      >
        <span class="hidden sm:inline">ENTER</span>
        <span class="sm:hidden">↵</span>
      </button>

      <button
        v-for="key in fila3"
        :key="key"
        :class="['key', getKeyClass(key)]"
        @click="$emit('key-press', key)"
      >
        {{ key }}
      </button>

      <button
        class="key key-action key-backspace"
        @click="$emit('backspace')"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  keyboardStatus: Map<string, 'correct' | 'present' | 'absent' | 'unused'>
}

const props = defineProps<Props>()

defineEmits<{
  'key-press': [key: string]
  'enter': []
  'backspace': []
}>()

// Layout del teclado español
const fila1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
const fila2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ']
const fila3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M']

// Obtiene la clase CSS según el estado de la tecla
const getKeyClass = (key: string) => {
  const status = props.keyboardStatus.get(key) || 'unused'

  switch (status) {
    case 'correct':
      return 'key-correct'
    case 'present':
      return 'key-present'
    case 'absent':
      return 'key-absent'
    default:
      return 'key-unused'
  }
}
</script>

<style scoped>
.wordle-keyboard {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 0.375rem;
  width: 100%;
}

.spacer {
  flex: 0.5;
}

.key {
  flex: 1;
  min-width: 0;
  height: 3.5rem;
  border-radius: 0.375rem;
  border: none;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  text-transform: uppercase;
}

.key:active {
  transform: scale(0.95);
}

/* Teclas especiales (ENTER y BACKSPACE) */
.key-action {
  flex: 1.5;
  font-size: 0.75rem;
}

/* Estados de las teclas */
.key-unused {
  background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%);
  color: white;
}

.key-unused:hover {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
}

.key-correct {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.key-correct:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.key-present {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.key-present:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
}

.key-absent {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
  opacity: 0.6;
}

.key-absent:hover {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
}

/* Teclas de acción (ENTER y BACKSPACE) */
.key-enter,
.key-backspace {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.key-enter:hover,
.key-backspace:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
}

/* Responsive */
@media (max-width: 640px) {
  .wordle-keyboard {
    padding: 0.5rem;
  }

  .key {
    height: 3rem;
    font-size: 0.75rem;
  }

  .key-action {
    font-size: 0.625rem;
  }

  .keyboard-row {
    gap: 0.25rem;
  }
}

@media (max-width: 380px) {
  .key {
    height: 2.5rem;
    font-size: 0.625rem;
  }

  .keyboard-row {
    gap: 0.2rem;
  }
}
</style>

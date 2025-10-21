<template>
  <div class="wordle-game">
    <!-- Header del juego -->
    <div class="game-header">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
          Palabra del Día
        </h2>
        <div class="text-sm text-texto-secundario">
          Intentos: {{ intentoActual }} / {{ intentosMaximos }}
        </div>
      </div>

      <!-- Información del juego -->
      <div v-if="dailyWord" class="text-xs text-texto-secundario mt-2">
        <span class="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-700">
          {{ dailyWord.categoria || 'General' }}
        </span>
        <span class="ml-2 inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700">
          {{ dificultadTexto }}
        </span>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="loading-state">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      <p class="mt-4 text-texto-secundario">Cargando juego...</p>
    </div>

    <!-- Ya jugó hoy -->
    <div v-else-if="yaJugoHoy && !gameState" class="already-played-state">
      <BaseCard variant="elevated" class="text-center">
        <div class="space-y-4">
          <div class="text-5xl">🎯</div>
          <h3 class="text-xl font-bold text-texto-principal">
            ¡Ya jugaste hoy!
          </h3>
          <p class="text-texto-secundario">
            Ya completaste tu partida gratuita del día
          </p>

          <div v-if="partidaDelDia" class="bg-gradient-to-r from-purple-50 to-transparent rounded-lg p-4 mt-4">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-2xl font-bold text-purple-600">{{ partidaDelDia.intentosUsados }}</div>
                <div class="text-xs text-texto-secundario">Intentos</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-purple-600">{{ partidaDelDia.puntaje }}</div>
                <div class="text-xs text-texto-secundario">Puntos</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-purple-600">
                  {{ partidaDelDia.ganado ? '✓' : '✗' }}
                </div>
                <div class="text-xs text-texto-secundario">{{ partidaDelDia.ganado ? 'Ganado' : 'Perdido' }}</div>
              </div>
            </div>
          </div>

          <p class="text-sm text-texto-secundario mt-4">
            Vuelve mañana para tu próximo intento gratuito
            <br />o compra tickets para jugar más
          </p>

          <BaseButton @click="$emit('volver')" variant="ghost" class="mt-4">
            Volver al inicio
          </BaseButton>
        </div>
      </BaseCard>
    </div>

    <!-- Juego activo -->
    <div v-else-if="gameState" class="game-active">
      <!-- Mensaje de error -->
      <div
        v-if="error"
        class="error-message"
        :class="{ 'error-visible': error }"
      >
        {{ error }}
      </div>

      <!-- Tablero -->
      <WordleBoard
        :filas="gameState.filas"
        :intento-actual="gameState.intentoActual"
        :error="error"
      />

      <!-- Modal de victoria/derrota -->
      <div v-if="juegoTerminado" class="game-result-modal">
        <BaseCard variant="elevated" class="text-center">
          <div class="space-y-4">
            <!-- Victoria -->
            <div v-if="gano">
              <div class="text-6xl mb-4">🎉</div>
              <h3 class="text-2xl font-bold text-green-600">
                ¡Felicitaciones!
              </h3>
              <p class="text-texto-secundario mt-2">
                Adivinaste la palabra en {{ gameState.intentoActual }} intento{{ gameState.intentoActual > 1 ? 's' : '' }}
              </p>

              <div class="bg-gradient-to-r from-green-50 to-transparent rounded-lg p-6 mt-4">
                <div class="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  +{{ gameState.puntaje }} puntos
                </div>
              </div>
            </div>

            <!-- Derrota -->
            <div v-else>
              <div class="text-6xl mb-4">😔</div>
              <h3 class="text-2xl font-bold text-red-600">
                ¡Casi!
              </h3>
              <p class="text-texto-secundario mt-2">
                La palabra era:
              </p>
              <div class="text-3xl font-bold text-texto-principal mt-2">
                {{ palabraSecreta }}
              </div>
            </div>

            <!-- Estadísticas -->
            <div class="grid grid-cols-2 gap-4 mt-6">
              <div class="bg-purple-50 rounded-lg p-4">
                <div class="text-2xl font-bold text-purple-600">{{ gameState.intentoActual }}</div>
                <div class="text-xs text-texto-secundario">Intentos usados</div>
              </div>
              <div class="bg-purple-50 rounded-lg p-4">
                <div class="text-2xl font-bold text-purple-600">{{ tiempoJugado }}</div>
                <div class="text-xs text-texto-secundario">Tiempo</div>
              </div>
            </div>

            <!-- Botones -->
            <div class="flex gap-3 mt-6">
              <BaseButton @click="$emit('volver')" variant="ghost" class="flex-1">
                Volver al inicio
              </BaseButton>
              <BaseButton @click="compartirResultado" variant="outline" class="flex-1">
                Compartir
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Teclado (solo si el juego no terminó) -->
      <WordleKeyboard
        v-if="!juegoTerminado"
        :keyboard-status="keyboardStatusMap"
        @key-press="handleKeyPress"
        @enter="handleEnter"
        @backspace="handleBackspace"
      />

      <!-- Tutorial -->
      <GameTutorial
        :rules="[
          { text: 'Adivina la palabra del día en 6 intentos o menos', icon: '🎯' },
          { text: 'Cada intento debe ser una palabra válida de 5 letras', icon: '📝' },
          { text: 'Verde: la letra está en la palabra y en la posición correcta', icon: '🟩' },
          { text: 'Amarillo: la letra está en la palabra pero en otra posición', icon: '🟨' },
          { text: 'Gris: la letra no está en la palabra', icon: '⬜' },
          { text: 'Una nueva palabra cada día - ¡compite con tus amigos!', icon: '📅' }
        ]"
        :tips="[
          'Empieza con palabras que tengan vocales comunes (A, E, I, O, U)',
          'Usa las primeras palabras para descubrir las letras de la palabra',
          'Presta atención a las letras amarillas - están en la palabra pero mal ubicadas',
          'Las letras grises ya puedes descartarlas completamente',
          'Usa el teclado físico para jugar más rápido',
          'Menos intentos usados = más puntos ganados'
        ]"
        :start-collapsed="true"
      />
    </div>

    <!-- Estado inicial (sin juego cargado) -->
    <div v-else class="initial-state">
      <BaseCard variant="elevated" class="text-center">
        <div class="space-y-4">
          <div class="text-6xl">🎮</div>
          <h3 class="text-xl font-bold text-texto-principal">
            ¿Listo para jugar?
          </h3>
          <p class="text-texto-secundario">
            Adivina la palabra del día en 6 intentos
          </p>
          <BaseButton @click="$emit('iniciar')" size="lg" class="w-full">
            Iniciar Juego
          </BaseButton>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useWordleStore } from '@/stores/wordleStore'
import { useAuthStore } from '@/stores/authStore'
import WordleBoard from './WordleBoard.vue'
import WordleKeyboard from './WordleKeyboard.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import GameTutorial from '@/components/ui/GameTutorial.vue'

defineEmits<{
  'volver': []
  'iniciar': []
}>()

const wordleStore = useWordleStore()
const authStore = useAuthStore()

const gameState = computed(() => wordleStore.gameState)
const dailyWord = computed(() => wordleStore.dailyWord)
const loading = computed(() => wordleStore.loading)
const error = computed(() => wordleStore.error)
const partidaDelDia = computed(() => wordleStore.partidaDelDia)
const yaJugoHoy = computed(() => wordleStore.yaJugoHoy)
const juegoTerminado = computed(() => wordleStore.juegoTerminado)
const gano = computed(() => wordleStore.gano)
const palabraSecreta = computed(() => wordleStore.palabraSecreta)

const intentoActual = computed(() => gameState.value?.intentoActual || 0)
const intentosMaximos = computed(() => gameState.value?.intentosMaximos || 6)

const keyboardStatusMap = computed(() => wordleStore.keyboardStatus)

const dificultadTexto = computed(() => {
  const dificultades = {
    facil: 'Fácil',
    media: 'Media',
    dificil: 'Difícil',
  }
  return dificultades[dailyWord.value?.dificultad || 'media']
})

const tiempoJugado = computed(() => {
  if (!gameState.value?.tiempoInicio || !gameState.value?.tiempoFin) return '0s'

  const segundos = Math.floor(
    (gameState.value.tiempoFin.getTime() - gameState.value.tiempoInicio.getTime()) / 1000
  )

  if (segundos < 60) return `${segundos}s`

  const minutos = Math.floor(segundos / 60)
  const segsRestantes = segundos % 60
  return `${minutos}m ${segsRestantes}s`
})

const handleKeyPress = (key: string) => {
  wordleStore.agregarLetra(key)
}

const handleBackspace = () => {
  wordleStore.borrarLetra()
}

const handleEnter = async () => {
  const userId = authStore.user?.id
  await wordleStore.enviarPalabra(userId)
}

const handleKeyboard = (event: KeyboardEvent) => {
  const userId = authStore.user?.id
  wordleStore.manejarTecladoFisico(event, userId)
}

const compartirResultado = () => {
  if (!gameState.value) return

  const emoji = gano.value ? '🎉' : '😔'
  const texto = `${emoji} Palabra del Día\nIntentos: ${gameState.value.intentoActual}/${gameState.value.intentosMaximos}\nPuntos: ${gameState.value.puntaje}\n\n¡Juega tú también en MyRank.cl!`

  if (navigator.share) {
    navigator.share({
      title: 'Mi resultado en Palabra del Día',
      text: texto,
    })
  } else {
    navigator.clipboard.writeText(texto)
    alert('Resultado copiado al portapapeles')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyboard)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard)
})
</script>

<style scoped>
.wordle-game {
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

.game-header {
  padding: 1rem;
  border-bottom: 2px solid var(--color-bordes, #e5e7eb);
  background: white;
}

.loading-state,
.initial-state,
.already-played-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.game-active {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.error-message {
  position: fixed;
  top: 6rem;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 50;
}

.error-visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.game-result-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 100;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .game-header {
    padding: 0.75rem;
  }

  .game-result-modal {
    padding: 0.5rem;
  }
}
</style>

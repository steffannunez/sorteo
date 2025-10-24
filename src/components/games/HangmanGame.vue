<template>
  <div class="hangman-game">
    <!-- Header del juego -->
    <div class="game-header">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
          Ahorcado
        </h2>
        <div class="text-sm text-texto-secundario">
          Intentos: {{ intentosUsados }} / {{ gameState?.intentosMaximos || 6 }}
        </div>
      </div>

      <!-- Información del juego -->
      <div v-if="dailyWord" class="text-xs text-texto-secundario mt-2">
        <span class="inline-flex items-center px-2 py-1 rounded-full bg-amber-100 text-amber-700">
          {{ dailyWord.categoria || 'General' }}
        </span>
        <span class="ml-2 inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700">
          {{ dificultadTexto }}
        </span>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="loading-state">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
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

          <div v-if="partidaDelDia" class="bg-gradient-to-r from-amber-50 to-transparent rounded-lg p-4 mt-4">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-2xl font-bold text-amber-600">{{ partidaDelDia.intentosUsados }}</div>
                <div class="text-xs text-texto-secundario">Intentos</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-amber-600">{{ partidaDelDia.puntaje }}</div>
                <div class="text-xs text-texto-secundario">Puntos</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-amber-600">
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

      <!-- Área de juego -->
      <div class="game-area">
        <!-- Dibujo del ahorcado -->
        <div class="hangman-drawing">
          <svg viewBox="0 0 200 250" class="w-full h-full">
            <!-- Base -->
            <line x1="10" y1="230" x2="150" y2="230" stroke="currentColor" stroke-width="4" class="text-gray-700" />
            <!-- Poste vertical -->
            <line x1="50" y1="230" x2="50" y2="20" stroke="currentColor" stroke-width="4" class="text-gray-700" />
            <!-- Poste horizontal -->
            <line x1="50" y1="20" x2="130" y2="20" stroke="currentColor" stroke-width="4" class="text-gray-700" />
            <!-- Cuerda -->
            <line x1="130" y1="20" x2="130" y2="50" stroke="currentColor" stroke-width="3" class="text-gray-700" />

            <!-- Cabeza (6 intentos restantes -> 0 errores) -->
            <circle
              v-if="intentosUsados >= 1"
              cx="130"
              cy="70"
              r="20"
              stroke="currentColor"
              stroke-width="3"
              fill="none"
              class="text-amber-600 animate-draw"
            />

            <!-- Cuerpo (5 intentos restantes -> 1 error) -->
            <line
              v-if="intentosUsados >= 2"
              x1="130"
              y1="90"
              x2="130"
              y2="150"
              stroke="currentColor"
              stroke-width="3"
              class="text-amber-600 animate-draw"
            />

            <!-- Brazo izquierdo (4 intentos restantes -> 2 errores) -->
            <line
              v-if="intentosUsados >= 3"
              x1="130"
              y1="110"
              x2="100"
              y2="130"
              stroke="currentColor"
              stroke-width="3"
              class="text-amber-600 animate-draw"
            />

            <!-- Brazo derecho (3 intentos restantes -> 3 errores) -->
            <line
              v-if="intentosUsados >= 4"
              x1="130"
              y1="110"
              x2="160"
              y2="130"
              stroke="currentColor"
              stroke-width="3"
              class="text-amber-600 animate-draw"
            />

            <!-- Pierna izquierda (2 intentos restantes -> 4 errores) -->
            <line
              v-if="intentosUsados >= 5"
              x1="130"
              y1="150"
              x2="110"
              y2="190"
              stroke="currentColor"
              stroke-width="3"
              class="text-amber-600 animate-draw"
            />

            <!-- Pierna derecha (1 intento restante -> 5 errores) -->
            <line
              v-if="intentosUsados >= 6"
              x1="130"
              y1="150"
              x2="150"
              y2="190"
              stroke="currentColor"
              stroke-width="3"
              class="text-amber-600 animate-draw"
            />
          </svg>
        </div>

        <!-- Palabra oculta -->
        <div class="palabra-container">
          <div class="palabra-display">
            <span
              v-for="(letra, index) in gameState.palabraOculta"
              :key="index"
              class="letra-box"
              :class="{ 'letra-adivinada': letra !== '_' }"
            >
              {{ letra }}
            </span>
          </div>

          <!-- Botón de pista -->
          <div v-if="!mostrarPista && !juegoTerminado" class="mt-6">
            <BaseButton
              variant="outline"
              size="sm"
              @click="revelarPista"
              class="text-amber-600 border-amber-600 hover:bg-amber-50"
            >
              💡 Ver Pista (-30% puntos)
            </BaseButton>
          </div>

          <!-- Pista revelada -->
          <div v-if="mostrarPista" class="pista-container">
            <div class="flex items-center gap-2 text-amber-700">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
              </svg>
              <span class="text-sm font-medium">{{ dailyWord?.pista }}</span>
            </div>
          </div>
        </div>

        <!-- Letras incorrectas -->
        <div v-if="gameState.letrasIncorrectas.length > 0" class="letras-incorrectas">
          <p class="text-xs text-texto-secundario mb-2">Letras incorrectas:</p>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="letra in gameState.letrasIncorrectas"
              :key="letra"
              class="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-medium"
            >
              {{ letra }}
            </span>
          </div>
        </div>
      </div>

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
                ¡Adivinaste la palabra!
              </p>
              <div class="text-3xl font-bold text-texto-principal mt-2">
                {{ palabraSecreta }}
              </div>

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
              <div class="bg-amber-50 rounded-lg p-4">
                <div class="text-2xl font-bold text-amber-600">{{ intentosUsados }}</div>
                <div class="text-xs text-texto-secundario">Errores</div>
              </div>
              <div class="bg-amber-50 rounded-lg p-4">
                <div class="text-2xl font-bold text-amber-600">{{ tiempoJugado }}</div>
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
      <div v-if="!juegoTerminado" class="keyboard">
        <button
          v-for="tecla in teclado"
          :key="tecla.letra"
          @click="handleKeyPress(tecla.letra)"
          :disabled="tecla.deshabilitado"
          class="key"
          :class="{
            'key-correct': tecla.estado === 'correcto',
            'key-incorrect': tecla.estado === 'incorrecto',
            'key-unused': tecla.estado === 'sin_usar',
          }"
        >
          {{ tecla.letra }}
        </button>
      </div>

      <!-- Tutorial -->
      <GameTutorial
        :rules="[
          { text: 'Adivina la palabra letra por letra antes de completar el ahorcado', icon: '🎯' },
          { text: 'Tienes un máximo de 6 intentos fallidos', icon: '❤️' },
          { text: 'Cada letra incorrecta dibuja una parte del ahorcado', icon: '✏️' },
          { text: 'Puedes ver una pista, pero reducirá tu puntuación en 30%', icon: '💡' },
          { text: 'Usa el teclado físico o virtual para seleccionar letras', icon: '⌨️' },
          { text: 'Completa la palabra antes de agotar tus intentos para ganar', icon: '🏆' }
        ]"
        :tips="[
          'Comienza con las vocales más comunes (A, E, I, O, U)',
          'Luego prueba consonantes frecuentes como R, S, N, L, T',
          'Observa la longitud de la palabra y la categoría para tener pistas',
          'Usa el teclado físico para mayor velocidad',
          'Solo usa la pista si realmente la necesitas - penaliza mucho'
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
            Adivina la palabra letra por letra antes de que se complete el ahorcado
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
import { useHangmanStore } from '@/stores/hangmanStore'
import { useAuthStore } from '@/stores/authStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import GameTutorial from '@/components/ui/GameTutorial.vue'

defineEmits<{
  'volver': []
  'iniciar': []
}>()

const hangmanStore = useHangmanStore()
const authStore = useAuthStore()

const gameState = computed(() => hangmanStore.gameState)
const dailyWord = computed(() => hangmanStore.dailyWord)
const loading = computed(() => hangmanStore.loading)
const error = computed(() => hangmanStore.error)
const partidaDelDia = computed(() => hangmanStore.partidaDelDia)
const yaJugoHoy = computed(() => hangmanStore.yaJugoHoy)
const juegoTerminado = computed(() => hangmanStore.juegoTerminado)
const gano = computed(() => hangmanStore.gano)
const palabraSecreta = computed(() => hangmanStore.palabraSecreta)
const teclado = computed(() => hangmanStore.teclado)
const mostrarPista = computed(() => hangmanStore.mostrarPista)
const intentosUsados = computed(() => hangmanStore.intentosUsados)

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

const handleKeyPress = async (letra: string) => {
  const userId = authStore.user?.id
  await hangmanStore.intentarLetra(letra, userId)
}

const revelarPista = () => {
  hangmanStore.revelarPista()
}

const handleKeyboard = (event: KeyboardEvent) => {
  const userId = authStore.user?.id
  hangmanStore.manejarTecladoFisico(event, userId)
}

const compartirResultado = () => {
  if (!gameState.value) return

  const emoji = gano.value ? '🎉' : '😔'
  const texto = `${emoji} Ahorcado\nErrores: ${intentosUsados.value}/${gameState.value.intentosMaximos}\nPuntos: ${gameState.value.puntaje}\n\n¡Juega tú también en MyRank.cl!`

  if (navigator.share) {
    navigator.share({
      title: 'Mi resultado en Ahorcado',
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
.hangman-game {
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
  padding: 1rem;
}

.game-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 1rem;
}

.hangman-drawing {
  width: 200px;
  height: 250px;
}

@keyframes draw {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-draw {
  animation: draw 0.3s ease-out;
}

.palabra-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
}

.palabra-display {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.letra-box {
  width: 3rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  border-bottom: 3px solid #d1d5db;
  color: #6b7280;
  transition: all 0.3s ease;
}

.letra-adivinada {
  color: #059669;
  border-bottom-color: #059669;
  transform: scale(1.1);
}

.pista-container {
  padding: 1rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 0.5rem;
  border: 2px solid #f59e0b;
}

.letras-incorrectas {
  width: 100%;
  max-width: 600px;
  margin-top: 1rem;
}

.keyboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(2.5rem, 1fr));
  gap: 0.5rem;
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.key {
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
  border: 2px solid transparent;
  cursor: pointer;
}

.key-unused {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #374151;
}

.key-unused:hover:not(:disabled) {
  background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%);
  transform: translateY(-2px);
}

.key-correct {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  cursor: not-allowed;
}

.key-incorrect {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  cursor: not-allowed;
}

.key:disabled {
  opacity: 0.6;
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

  .hangman-drawing {
    width: 150px;
    height: 200px;
  }

  .letra-box {
    width: 2.5rem;
    height: 3rem;
    font-size: 1.5rem;
  }

  .keyboard {
    grid-template-columns: repeat(7, 1fr);
    gap: 0.25rem;
  }

  .key {
    padding: 0.5rem 0.25rem;
    font-size: 0.75rem;
  }
}
</style>

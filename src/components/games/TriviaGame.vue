<template>
  <div class="trivia-game">
    <!-- Header del juego -->
    <div class="game-header mb-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Trivia Challenge
        </h2>
        <div class="text-sm text-texto-secundario">
          Puntaje: <span class="font-bold text-indigo-600">{{ gameState.totalScore }}</span>
        </div>
      </div>

      <!-- Información de progreso -->
      <div v-if="isPlaying" class="flex items-center justify-between mt-3 text-xs text-texto-secundario">
        <span class="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
          Pregunta #{{ gameState.questionNumber }}
        </span>
        <span class="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700">
          Respondidas: {{ gameState.questionsAnswered }}
        </span>
        <span class="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700">
          Dificultad: {{ difficultyLabel }}
        </span>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p class="mt-4 text-texto-secundario">Cargando pregunta...</p>
    </div>

    <!-- Ya jugó hoy -->
    <div v-else-if="yaJugoHoy && !isPlaying && gameState.gameStatus === 'not_started'" class="already-played-state">
      <BaseCard variant="elevated" class="text-center">
        <div class="space-y-4">
          <div class="text-5xl">🧠</div>
          <h3 class="text-xl font-bold text-texto-principal">
            ¡Ya jugaste hoy!
          </h3>
          <p class="text-texto-secundario">
            Ya completaste tu partida gratuita del día
          </p>

          <div v-if="partidaDelDia" class="bg-gradient-to-r from-indigo-50 to-transparent rounded-lg p-4 mt-4">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-2xl font-bold text-indigo-600">{{ partidaDelDia.questionsAnswered }}</div>
                <div class="text-xs text-texto-secundario">Preguntas</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-indigo-600">{{ partidaDelDia.totalScore }}</div>
                <div class="text-xs text-texto-secundario">Puntos</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-indigo-600">{{ partidaDelDia.skipsUsed }}</div>
                <div class="text-xs text-texto-secundario">Saltos</div>
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

    <!-- Pantalla de inicio -->
    <div v-else-if="gameState.gameStatus === 'not_started'" class="start-screen">
      <BaseCard variant="elevated" class="text-center">
        <div class="space-y-6">
          <div class="text-6xl">🎯</div>
          <h3 class="text-2xl font-bold text-texto-principal">
            ¿Listo para el desafío?
          </h3>

          <div class="text-left bg-indigo-50 rounded-lg p-4 space-y-2">
            <h4 class="font-bold text-indigo-900 mb-3">📖 Reglas del juego:</h4>
            <ul class="text-sm text-texto-secundario space-y-2">
              <li class="flex items-start">
                <span class="text-indigo-600 mr-2">•</span>
                <span>Responde preguntas de trivia de dificultad progresiva</span>
              </li>
              <li class="flex items-start">
                <span class="text-indigo-600 mr-2">•</span>
                <span>Preguntas 1-3: +10 pts | 4-7: +20 pts | 8-10: +30 pts | 11+: +50 pts</span>
              </li>
              <li class="flex items-start">
                <span class="text-indigo-600 mr-2">•</span>
                <span>Puedes saltar preguntas, pero cada salto cuesta más (-5, -15, -45, -135...)</span>
              </li>
              <li class="flex items-start">
                <span class="text-indigo-600 mr-2">•</span>
                <span>Una respuesta incorrecta termina el juego</span>
              </li>
              <li class="flex items-start">
                <span class="text-indigo-600 mr-2">•</span>
                <span>¡Acumula la mayor cantidad de puntos posible!</span>
              </li>
            </ul>
          </div>

          <BaseButton @click="$emit('iniciar')" size="lg" class="w-full">
            🚀 Comenzar Juego
          </BaseButton>
        </div>
      </BaseCard>
    </div>

    <!-- Juego activo -->
    <div v-else-if="isPlaying && gameState.currentQuestion" class="game-active">
      <!-- Mensaje de error -->
      <div
        v-if="error"
        class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
      >
        {{ error }}
      </div>

      <!-- Pregunta -->
      <BaseCard variant="elevated" class="mb-6">
        <!-- Categoría -->
        <div class="mb-4">
          <span class="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
            {{ gameState.currentQuestion.category }}
          </span>
        </div>

        <!-- Texto de la pregunta -->
        <h3 class="text-xl font-bold text-texto-principal mb-6" v-html="gameState.currentQuestion.question"></h3>

        <!-- Opciones -->
        <div class="space-y-3">
          <button
            v-for="(option, index) in gameState.currentQuestion.options"
            :key="index"
            @click="handleAnswer(option)"
            :disabled="showingResult"
            class="option-button w-full text-left p-4 rounded-lg border-2 transition-all duration-200"
            :class="getOptionClass(option)"
          >
            <div class="flex items-center">
              <span class="option-letter flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3"
                    :class="getOptionLetterClass(option)">
                {{ String.fromCharCode(65 + index) }}
              </span>
              <span v-html="option"></span>
            </div>
          </button>
        </div>

        <!-- Botón de saltar -->
        <div v-if="!showingResult" class="mt-6 pt-6 border-t border-bordes">
          <div class="flex items-center justify-between">
            <div class="text-sm text-texto-secundario">
              <span class="font-medium">Saltos usados:</span> {{ gameState.skipsUsed }}
              <br />
              <span class="text-xs">Próximo salto: <span class="font-bold text-red-600">{{ nextSkipCost }} puntos</span></span>
            </div>
            <BaseButton
              @click="handleSkip"
              :disabled="!canSkip"
              variant="outline"
              size="sm"
              class="border-orange-400 text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⏭️ Saltar pregunta
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <!-- Indicador de puntos ganados -->
      <div v-if="!showingResult" class="text-center text-sm text-texto-secundario">
        Respuesta correcta: <span class="font-bold text-green-600">+{{ pointsForCorrectAnswer }} puntos</span>
      </div>

      <!-- Tutorial -->
      <GameTutorial
        :rules="[
          { text: 'Responde preguntas de trivia de dificultad progresiva', icon: '🎯' },
          { text: 'Preguntas 1-3: +10 pts | 4-7: +20 pts | 8-10: +30 pts | 11+: +50 pts', icon: '⭐' },
          { text: 'Puedes saltar preguntas, pero cada salto cuesta más (-5, -15, -45, -135...)', icon: '⏭️' },
          { text: 'Una respuesta incorrecta termina el juego', icon: '❌' },
          { text: '¡Acumula la mayor cantidad de puntos posible!', icon: '🏆' }
        ]"
        :tips="[
          'Lee las preguntas con cuidado antes de responder',
          'Usa los saltos estratégicamente - el costo aumenta exponencialmente',
          'Las preguntas más difíciles otorgan más puntos',
          'No hay límite de tiempo, así que piensa bien tu respuesta'
        ]"
        :start-collapsed="true"
      />
    </div>

    <!-- Game Over -->
    <div v-else-if="isGameOver" class="game-over">
      <BaseCard variant="elevated" class="text-center">
        <div class="space-y-6">
          <div class="text-6xl">{{ lastAnswerCorrect ? '🎉' : '😢' }}</div>
          <h3 class="text-2xl font-bold text-texto-principal">
            ¡Juego Terminado!
          </h3>

          <!-- Estadísticas finales -->
          <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div class="text-3xl font-bold text-indigo-600">{{ gameState.totalScore }}</div>
                <div class="text-xs text-texto-secundario mt-1">Puntos Totales</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-purple-600">{{ gameState.questionsAnswered }}</div>
                <div class="text-xs text-texto-secundario mt-1">Respondidas</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-orange-600">{{ gameState.skipsUsed }}</div>
                <div class="text-xs text-texto-secundario mt-1">Saltos</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-green-600">{{ difficultyLabel }}</div>
                <div class="text-xs text-texto-secundario mt-1">Máx. Dificultad</div>
              </div>
            </div>
          </div>

          <p class="text-texto-secundario">
            {{ lastAnswerCorrect
              ? '¡Felicidades! Has completado el desafío.'
              : 'La respuesta correcta era: ' + gameState.currentQuestion?.correctAnswer }}
          </p>

          <div class="flex gap-3">
            <BaseButton @click="$emit('volver')" variant="ghost" class="flex-1">
              Volver al inicio
            </BaseButton>
            <BaseButton @click="$emit('iniciar')" class="flex-1" v-if="!yaJugoHoy">
              Jugar de nuevo
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTriviaStore } from '@/stores/triviaStore'
import { useAuthStore } from '@/stores/authStore'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import GameTutorial from '@/components/ui/GameTutorial.vue'

const triviaStore = useTriviaStore()
const authStore = useAuthStore()

const { gameState, loading, error, partidaDelDia, selectedAnswer, showingResult, lastAnswerCorrect } = storeToRefs(triviaStore)
const { user } = storeToRefs(authStore)

const isPlaying = computed(() => triviaStore.isPlaying)
const isGameOver = computed(() => triviaStore.isGameOver)
const yaJugoHoy = computed(() => triviaStore.yaJugoHoy)
const nextSkipCost = computed(() => triviaStore.nextSkipCost)
const canSkip = computed(() => triviaStore.canSkip)
const pointsForCorrectAnswer = computed(() => triviaStore.pointsForCorrectAnswer)

const difficultyLabel = computed(() => {
  const diff = triviaStore.currentDifficulty
  const labels = { easy: 'Fácil', medium: 'Media', hard: 'Difícil' }
  return labels[diff]
})

const handleAnswer = async (answer: string) => {
  if (showingResult.value) return
  await triviaStore.responderPregunta(answer, user.value?.id)
}

const handleSkip = async () => {
  await triviaStore.saltarPregunta()
}

const getOptionClass = (option: string) => {
  if (!showingResult.value) {
    return 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer'
  }

  const isSelected = selectedAnswer.value === option
  const isCorrect = option === gameState.value.currentQuestion?.correctAnswer

  if (isCorrect) {
    return 'border-green-500 bg-green-50'
  }

  if (isSelected && !isCorrect) {
    return 'border-red-500 bg-red-50'
  }

  return 'border-gray-300 opacity-50'
}

const getOptionLetterClass = (option: string) => {
  if (!showingResult.value) {
    return 'bg-indigo-100 text-indigo-700'
  }

  const isCorrect = option === gameState.value.currentQuestion?.correctAnswer
  const isSelected = selectedAnswer.value === option

  if (isCorrect) {
    return 'bg-green-500 text-white'
  }

  if (isSelected && !isCorrect) {
    return 'bg-red-500 text-white'
  }

  return 'bg-gray-200 text-gray-600'
}
</script>

<style scoped>
.option-button {
  transition: all 0.2s ease;
}

.option-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
}

.option-button:disabled {
  cursor: default;
}

.option-letter {
  transition: all 0.2s ease;
}
</style>

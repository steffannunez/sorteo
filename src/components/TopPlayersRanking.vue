<template>
  <BaseCard variant="elevated" class="h-full">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-bold text-texto-principal">
          Top 10 Jugadores
        </h3>
        <div class="text-xs text-texto-secundario">
          {{ periodoTexto }}
        </div>
      </div>
    </template>

    <div class="space-y-2">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-dorado"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-500 text-sm">{{ error }}</p>
        <BaseButton variant="ghost" size="sm" @click="recargar" class="mt-2">
          Reintentar
        </BaseButton>
      </div>

      <!-- Players List -->
      <div v-else-if="topPlayers.length > 0" class="space-y-2">
        <div
          v-for="player in topPlayers"
          :key="player.userId"
          :class="[
            'flex items-center justify-between p-3 rounded-lg border transition-all duration-200',
            positionClass(player.posicion),
            'hover:shadow-md hover:scale-[1.02]'
          ]"
        >
          <!-- Posición y Avatar -->
          <div class="flex items-center space-x-3 flex-1 min-w-0">
            <div
              :class="[
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                medalClass(player.posicion)
              ]"
            >
              {{ positionEmoji(player.posicion) }}
            </div>

            <!-- Avatar -->
            <div
              v-if="player.avatarUrl"
              class="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0"
              :style="{ backgroundImage: `url(${player.avatarUrl})` }"
            ></div>
            <div
              v-else
              class="w-10 h-10 bg-gradient-to-br from-dorado to-dorado-oscuro rounded-full flex items-center justify-center text-blanco-puro text-xs font-bold flex-shrink-0"
            >
              {{ getInitials(player.userName) }}
            </div>

            <!-- Nombre y Stats -->
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-texto-principal truncate text-sm">
                {{ player.userName }}
              </div>
              <div class="text-xs text-texto-secundario">
                {{ player.partidasJugadas }} partidas
              </div>
            </div>
          </div>

          <!-- Puntaje -->
          <div class="text-right flex-shrink-0 ml-2">
            <div
              :class="[
                'font-bold text-sm',
                player.posicion <= 3 ? 'bg-gradient-to-r from-dorado-oscuro to-dorado bg-clip-text text-transparent' : 'text-texto-principal'
              ]"
            >
              {{ player.puntajeTotal.toLocaleString() }}
            </div>
            <div class="text-xs text-texto-secundario">
              puntos
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <img src="../assets/logo.png" alt="">
        <p class="text-texto-secundario font-medium">
          No hay jugadores en el ranking
        </p>
        <p class="text-xs text-texto-secundario mt-1">
          ¡Sé el primero en jugar!
        </p>
      </div>

      <!-- Última actualización -->
      <div v-if="lastUpdate && !loading" class="pt-3 border-t border-bordes">
        <p class="text-xs text-texto-secundario text-center">
          Actualizado: {{ formatDate(lastUpdate) }}
        </p>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRankingStore } from '@/stores/rankingStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const rankingStore = useRankingStore()

const loading = computed(() => rankingStore.loading)
const error = computed(() => rankingStore.error)
const topPlayers = computed(() => rankingStore.top10Players)
const lastUpdate = computed(() => rankingStore.lastUpdate)

const periodoTexto = computed(() => {
  const periodos = {
    diario: 'Hoy',
    semanal: 'Esta Semana',
    mensual: 'Este Mes',
    historico: 'Histórico'
  }
  return periodos[rankingStore.periodo]
})

const positionClass = (position: number) => {
  if (position === 1) return 'bg-gradient-to-r from-yellow-50 to-transparent border-yellow-300'
  if (position === 2) return 'bg-gradient-to-r from-gray-50 to-transparent border-gray-300'
  if (position === 3) return 'bg-gradient-to-r from-orange-50 to-transparent border-orange-300'
  return 'bg-white border-bordes'
}

const medalClass = (position: number) => {
  if (position === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg'
  if (position === 2) return 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-md'
  if (position === 3) return 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md'
  return 'bg-gray-100 text-texto-secundario'
}

const positionEmoji = (position: number) => {
  if (position === 1) return '🥇'
  if (position === 2) return '🥈'
  if (position === 3) return '🥉'
  return position.toString()
}

const getInitials = (name: string) => {
  const names = name.split(' ')
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

const recargar = async () => {
  await rankingStore.fetchTopPlayers(rankingStore.periodo)
}

onMounted(async () => {
  // Cargar datos de prueba (remover cuando haya API real)
  rankingStore.cargarDatosDePrueba()
})
</script>

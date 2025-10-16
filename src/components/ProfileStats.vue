<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Puntos Actuales (Sorteo en Curso) -->
    <BaseCard variant="elevated" class="hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="text-sm text-texto-secundario mb-1 font-medium">Puntos Actuales</div>
          <div class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            {{ stats.puntosActuales.toLocaleString() }}
          </div>
          <div class="text-xs text-texto-secundario mt-1">Sorteo en curso</div>
        </div>
        <div class="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
    </BaseCard>

    <!-- Récord Mensual -->
    <BaseCard variant="elevated" class="hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="text-sm text-texto-secundario mb-1 font-medium">Récord Mensual</div>
          <div class="text-3xl font-bold text-texto-principal">
            {{ stats.recordPuntosMensuales.toLocaleString() }}
          </div>
          <div class="text-xs text-texto-secundario mt-1">Mejor mes</div>
        </div>
        <div class="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white shadow-lg">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
      </div>
    </BaseCard>

    <!-- Puntos Históricos -->
    <BaseCard variant="elevated" class="hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="text-sm text-texto-secundario mb-1 font-medium">Puntos Históricos</div>
          <div class="text-2xl font-bold text-texto-principal">
            {{ stats.puntosHistoricos.toLocaleString() }}
          </div>
          <div class="text-xs text-texto-secundario mt-1">Total desde siempre</div>
        </div>
        <div class="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>
    </BaseCard>

    <!-- Total Ganado (Dinero) -->
    <BaseCard variant="elevated" class="hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="text-sm text-texto-secundario mb-1 font-medium">Total Ganado</div>
          <div class="text-2xl font-bold bg-gradient-to-r from-dorado-oscuro to-dorado bg-clip-text text-transparent">
            {{ formatCurrency(stats.totalGanado) }}
          </div>
          <div class="text-xs text-texto-secundario mt-1">En premios</div>
        </div>
        <div class="w-14 h-14 bg-gradient-to-br from-dorado to-dorado-oscuro rounded-full flex items-center justify-center text-blanco-puro shadow-lg">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </BaseCard>
  </div>

  <!-- Estadísticas Detalladas -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
    <!-- Sorteos -->
    <BaseCard variant="elevated">
      <div class="space-y-4">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <h4 class="font-bold text-texto-principal">Sorteos</h4>
            <p class="text-xs text-texto-secundario">Tu participación</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="text-center p-3 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ stats.sorteosParticipados }}</div>
            <div class="text-xs text-texto-secundario">Participados</div>
          </div>
          <div class="text-center p-3 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ stats.sorteosGanados }}</div>
            <div class="text-xs text-texto-secundario">Ganados</div>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Juegos -->
    <BaseCard variant="elevated">
      <div class="space-y-4">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 class="font-bold text-texto-principal">Juegos</h4>
            <p class="text-xs text-texto-secundario">Tu desempeño</p>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-texto-secundario">Partidas jugadas</span>
            <span class="font-bold text-purple-600">{{ stats.partidasJugadas }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-texto-secundario">Partidas ganadas</span>
            <span class="font-bold text-purple-600">{{ stats.partidasGanadas }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-texto-secundario">Promedio intentos</span>
            <span class="font-bold text-purple-600">{{ stats.promedioIntentos.toFixed(1) }}</span>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Tickets -->
    <BaseCard variant="elevated">
      <div class="space-y-4">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <div>
            <h4 class="font-bold text-texto-principal">Tickets</h4>
            <p class="text-xs text-texto-secundario">Tu inversión</p>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-texto-secundario">Tickets comprados</span>
            <span class="font-bold text-pink-600">{{ stats.ticketsComprados }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-texto-secundario">Tickets usados</span>
            <span class="font-bold text-pink-600">{{ stats.ticketsUsados }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-texto-secundario">Total gastado</span>
            <span class="font-bold text-pink-600">{{ formatCurrency(stats.totalGastado) }}</span>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePerfilStore } from '@/stores/perfilStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import { config } from '@/config/env'

const perfilStore = usePerfilStore()

const stats = computed(() => perfilStore.userStats)

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: config.sorteo.moneda,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>

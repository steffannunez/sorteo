<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    

    <!-- Sorteos Participados -->
    <BaseCard variant="elevated" class="hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="text-sm text-texto-secundario mb-1 font-medium">Sorteos</div>
          <div class="text-2xl font-bold text-texto-principal">
            {{ stats.sorteosParticipados }}
          </div>
          <div class="text-xs text-texto-secundario mt-1">Participados</div>
        </div>
        <div class="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      </div>
    </BaseCard>

    <!-- Números Comprados -->
    <BaseCard variant="elevated" class="hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="text-sm text-texto-secundario mb-1 font-medium">Números</div>
          <div class="text-2xl font-bold text-texto-principal">
            {{ stats.numerosComprados }}
          </div>
          <div class="text-xs text-texto-secundario mt-1">Comprados</div>
        </div>
        <div class="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
      </div>
    </BaseCard>

    <!-- Premios Ganados -->
    <BaseCard variant="elevated" class="hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="text-sm text-texto-secundario mb-1 font-medium">Premios</div>
          <div class="text-2xl font-bold text-texto-principal">
            {{ stats.premiosGanados }}
          </div>
          <div class="text-xs text-texto-secundario mt-1">Ganados</div>
        </div>
        <div class="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white shadow-lg">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
      </div>
    </BaseCard>

    <!-- Total Ganado -->
    <BaseCard variant="elevated" class="hover:shadow-xl transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="text-sm text-texto-secundario mb-1 font-medium">Total Ganado</div>
          <div class="text-2xl font-bold bg-gradient-to-r from-dorado-oscuro to-dorado bg-clip-text text-transparent">
            {{ formatCurrency(stats.totalGanado) }}
          </div>
        </div>
        <div class="w-14 h-14 bg-gradient-to-br from-dorado to-dorado-oscuro rounded-full flex items-center justify-center text-blanco-puro shadow-lg">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
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

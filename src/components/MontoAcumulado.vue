<template>
  <BaseCard class="text-center">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">Monto Acumulado</h3>
    </template>
    
    <div class="space-y-4">
      <div class="text-4xl font-bold text-primary-600">
        {{ montoFormateado }}
      </div>
      
      <div class="text-sm text-gray-600">
        {{ numerosVendidosCount }} números vendidos de {{ totalNumeros }}
      </div>
      
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-primary-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${porcentajeVendido}%` }"
        ></div>
      </div>
      
      <div class="text-sm text-gray-500">
        {{ porcentajeVendido.toFixed(1) }}% vendido
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSorteoStore } from '@/stores/sorteoStore'
import BaseCard from '@/components/ui/BaseCard.vue'

const sorteoStore = useSorteoStore()

const montoAcumulado = computed(() => sorteoStore.montoAcumulado)
const numerosVendidosCount = computed(() => sorteoStore.numerosVendidosCount)
const totalNumeros = computed(() => sorteoStore.totalNumeros)
const porcentajeVendido = computed(() => sorteoStore.porcentajeVendido)

const montoFormateado = computed(() => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(montoAcumulado.value)
})
</script>

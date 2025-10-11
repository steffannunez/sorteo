<template>
  <BaseCard class="text-center" variant="elevated">
    <template #header>
      <h3 class="text-xl font-bold text-texto-principal">Pozo Acumulado</h3>
    </template>

    <div class="space-y-6">
      <div class="relative">
        <div class="text-5xl font-bold bg-gradient-to-r from-dorado-oscuro via-dorado to-dorado-oscuro bg-clip-text text-transparent">
          {{ montoFormateado }}
        </div>
        <div class="absolute -top-2 -right-2 w-16 h-16 bg-dorado/10 rounded-full blur-xl"></div>
      </div>

      <div class="text-sm font-medium text-texto-secundario">
        {{ numerosVendidosCount }} números vendidos de {{ totalNumeros }}
      </div>

      <div class="w-full bg-bordes rounded-full h-3 overflow-hidden shadow-inner">
        <div
          class="bg-gradient-to-r from-dorado-oscuro via-dorado to-dorado-claro h-3 rounded-full transition-all duration-500 shadow-lg"
          :style="{ width: `${porcentajeVendido}%` }"
        ></div>
      </div>

      <div class="inline-block px-4 py-2 bg-dorado-claro/30 rounded-full border border-dorado-claro">
        <span class="text-sm font-semibold text-dorado-oscuro">
          {{ porcentajeVendido.toFixed(1) }}% vendido
        </span>
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

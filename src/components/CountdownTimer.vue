<template>
  <div class="text-center">
    <h2 class="text-3xl font-bold text-texto-principal mb-6">
      Tiempo restante para el sorteo
    </h2>

    <div v-if="countdown" class="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
      <div class="bg-gradient-to-br from-dorado via-dorado-claro to-dorado text-blanco-puro rounded-xl p-6 shadow-xl shadow-dorado/30 border border-dorado-oscuro/20 transform hover:scale-105 transition-all duration-300">
        <div class="text-4xl font-bold mb-1">{{ countdown.dias }}</div>
        <div class="text-sm font-medium opacity-90">Días</div>
      </div>
      <div class="bg-gradient-to-br from-dorado via-dorado-claro to-dorado text-blanco-puro rounded-xl p-6 shadow-xl shadow-dorado/30 border border-dorado-oscuro/20 transform hover:scale-105 transition-all duration-300">
        <div class="text-4xl font-bold mb-1">{{ countdown.horas }}</div>
        <div class="text-sm font-medium opacity-90">Horas</div>
      </div>
      <div class="bg-gradient-to-br from-dorado via-dorado-claro to-dorado text-blanco-puro rounded-xl p-6 shadow-xl shadow-dorado/30 border border-dorado-oscuro/20 transform hover:scale-105 transition-all duration-300">
        <div class="text-4xl font-bold mb-1">{{ countdown.minutos }}</div>
        <div class="text-sm font-medium opacity-90">Minutos</div>
      </div>
      <div class="bg-gradient-to-br from-dorado via-dorado-claro to-dorado text-blanco-puro rounded-xl p-6 shadow-xl shadow-dorado/30 border border-dorado-oscuro/20 transform hover:scale-105 transition-all duration-300">
        <div class="text-4xl font-bold mb-1">{{ countdown.segundos }}</div>
        <div class="text-sm font-medium opacity-90">Segundos</div>
      </div>
    </div>

    <div v-else class="text-texto-secundario">
      <p class="text-lg font-medium">El sorteo ha finalizado</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSorteoStore } from '@/stores/sorteoStore'

const sorteoStore = useSorteoStore()

const countdown = computed(() => sorteoStore.tiempoRestante)
</script>

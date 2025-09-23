<template>
  <div class="text-center">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">
      Tiempo restante para el sorteo
    </h2>
    
    <div v-if="countdown" class="grid grid-cols-4 gap-4 max-w-md mx-auto">
      <div class="bg-primary-600 text-white rounded-lg p-4">
        <div class="text-2xl font-bold">{{ countdown.dias }}</div>
        <div class="text-sm opacity-90">Días</div>
      </div>
      <div class="bg-primary-600 text-white rounded-lg p-4">
        <div class="text-2xl font-bold">{{ countdown.horas }}</div>
        <div class="text-sm opacity-90">Horas</div>
      </div>
      <div class="bg-primary-600 text-white rounded-lg p-4">
        <div class="text-2xl font-bold">{{ countdown.minutos }}</div>
        <div class="text-sm opacity-90">Minutos</div>
      </div>
      <div class="bg-primary-600 text-white rounded-lg p-4">
        <div class="text-2xl font-bold">{{ countdown.segundos }}</div>
        <div class="text-sm opacity-90">Segundos</div>
      </div>
    </div>
    
    <div v-else class="text-gray-500">
      <p class="text-lg">El sorteo ha finalizado</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSorteoStore } from '@/stores/sorteoStore'

const sorteoStore = useSorteoStore()

const countdown = computed(() => sorteoStore.tiempoRestante)
</script>

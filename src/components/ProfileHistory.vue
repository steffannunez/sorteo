<template>
  <BaseCard variant="elevated">
    <template #header>
      <h3 class="text-xl font-bold text-texto-principal">Historial de Participaciones en Sorteos</h3>
    </template>

    <div class="space-y-6">
      <!-- Filtros -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="filtro in filtros"
          :key="filtro.value"
          @click="filtroActivo = filtro.value"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            filtroActivo === filtro.value
              ? 'bg-gradient-to-r from-dorado to-dorado-oscuro text-blanco-puro shadow-md'
              : 'bg-crema/30 text-texto-secundario hover:bg-crema/50'
          ]"
        >
          {{ filtro.label }}
          <span v-if="filtro.count !== undefined" class="ml-1.5 text-xs opacity-80">({{ filtro.count }})</span>
        </button>
      </div>

      <!-- Lista de participaciones -->
      <div v-if="participacionesFiltradas.length > 0" class="space-y-4">
        <div
          v-for="participacion in participacionesFiltradas"
          :key="participacion.id"
          class="p-6 bg-gradient-to-r from-crema/30 to-transparent rounded-xl border-2 border-bordes hover:border-dorado-claro transition-all duration-300 hover:shadow-lg"
        >
          <!-- Header: Nombre del sorteo y estado -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h4 class="text-lg font-bold text-texto-principal mb-1">
                {{ participacion.sorteoNombre }}
              </h4>
              <div class="text-xs text-texto-secundario">
                {{ formatDateRange(participacion.fechaInicio, participacion.fechaFin) }}
              </div>
            </div>

            <!-- Badge de estado -->
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-bold shadow-sm flex-shrink-0 ml-2',
                getEstadoClass(participacion.estado)
              ]"
            >
              {{ getEstadoLabel(participacion.estado) }}
            </span>
          </div>

          <!-- Estadísticas principales -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <!-- Puntos Acumulados -->
            <div class="p-4 bg-gradient-to-br from-purple-50 to-transparent rounded-lg border border-purple-200">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white shadow">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs text-texto-secundario font-medium">Puntos</div>
                  <div class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                    {{ participacion.puntosAcumulados.toLocaleString() }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Posición en Ranking -->
            <div class="p-4 bg-gradient-to-br from-blue-50 to-transparent rounded-lg border border-blue-200">
              <div class="flex items-center space-x-3">
                <div
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center text-white shadow font-bold',
                    getRankingBadgeClass(participacion.posicionRanking)
                  ]"
                >
                  {{ getRankingEmoji(participacion.posicionRanking) }}
                </div>
                <div>
                  <div class="text-xs text-texto-secundario font-medium">Posición</div>
                  <div class="text-2xl font-bold text-texto-principal">
                    {{ participacion.posicionRanking }}°
                  </div>
                  <div class="text-xs text-texto-secundario">
                    de {{ participacion.participantes }} jugadores
                  </div>
                </div>
              </div>
            </div>

            <!-- Premio (si ganó) -->
            <div
              v-if="participacion.esGanador"
              class="p-4 bg-gradient-to-br from-amber-50 to-transparent rounded-lg border-2 border-amber-300 relative overflow-hidden"
            >
              <div class="absolute top-0 right-0 text-6xl opacity-10">🏆</div>
              <div class="relative z-10">
                <div class="flex items-center space-x-2 mb-1">
                  <div class="text-xs font-bold text-amber-600 uppercase tracking-wider">Ganador</div>
                  <div class="px-2 py-0.5 bg-amber-400 text-white text-xs font-bold rounded-full animate-pulse">
                    ✨
                  </div>
                </div>
                <div class="text-2xl font-bold bg-gradient-to-r from-dorado-oscuro to-dorado bg-clip-text text-transparent">
                  {{ formatCurrency(participacion.montoGanado || 0) }}
                </div>
                <div class="text-xs text-amber-700 font-medium mt-1">Premio ganado</div>
              </div>
            </div>

            <!-- Placeholder si no ganó -->
            <div
              v-else
              class="p-4 bg-gradient-to-br from-gray-50 to-transparent rounded-lg border border-gray-200"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs text-texto-secundario font-medium">Resultado</div>
                  <div class="text-sm font-semibold text-gray-500">Sin premio</div>
                  <div class="text-xs text-texto-secundario">¡Sigue intentando!</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Barra de progreso visual (comparación con ganador) -->
          <div v-if="participacion.estado === 'finalizado'" class="mt-4">
            <div class="flex justify-between text-xs text-texto-secundario mb-1">
              <span>Tu rendimiento</span>
              <span>{{ getRendimientoPercentage(participacion.posicionRanking, participacion.participantes) }}% del top</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                class="h-2 rounded-full transition-all duration-500"
                :class="getRendimientoBarClass(participacion.posicionRanking)"
                :style="{ width: `${getRendimientoPercentage(participacion.posicionRanking, participacion.participantes)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje vacío -->
      <div v-else class="text-center py-16">
        <div class="text-6xl mb-4">🎯</div>
        <div class="text-texto-secundario">
          <p class="font-medium text-lg mb-2">{{ getTituloVacio() }}</p>
          <p class="text-sm">{{ getMensajeVacio() }}</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block w-8 h-8 border-4 border-dorado border-t-transparent rounded-full animate-spin"></div>
        <p class="text-texto-secundario text-sm mt-3">Cargando historial de participaciones...</p>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePerfilStore } from '@/stores/perfilStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import { config } from '@/config/env'
import type { ParticipacionSorteo } from '@/types'

const perfilStore = usePerfilStore()

const loading = computed(() => perfilStore.loading)
const participaciones = computed(() => perfilStore.participacionesSorteos)

const filtroActivo = ref<'todas' | 'en_curso' | 'finalizados' | 'ganados'>('todas')

// Computed filters
const participacionesEnCurso = computed(() =>
  participaciones.value.filter(p => p.estado === 'en_curso')
)

const participacionesFinalizadas = computed(() =>
  participaciones.value.filter(p => p.estado === 'finalizado')
)

const participacionesGanadas = computed(() =>
  participaciones.value.filter(p => p.esGanador)
)

const filtros = computed(() => [
  { label: 'Todas', value: 'todas' as const, count: participaciones.value.length },
  { label: 'En Curso', value: 'en_curso' as const, count: participacionesEnCurso.value.length },
  { label: 'Finalizados', value: 'finalizados' as const, count: participacionesFinalizadas.value.length },
  { label: 'Ganados', value: 'ganados' as const, count: participacionesGanadas.value.length },
])

const participacionesFiltradas = computed(() => {
  switch (filtroActivo.value) {
    case 'en_curso':
      return participacionesEnCurso.value
    case 'finalizados':
      return participacionesFinalizadas.value
    case 'ganados':
      return participacionesGanadas.value
    default:
      return participaciones.value
  }
})

onMounted(() => {
  // Cargar datos de prueba si no hay participaciones
  if (participaciones.value.length === 0) {
    perfilStore.cargarDatosDePrueba()
  }
})

const formatDateRange = (inicio: Date, fin: Date) => {
  const formatOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }

  const inicioStr = new Date(inicio).toLocaleDateString('es-CL', formatOptions)
  const finStr = new Date(fin).toLocaleDateString('es-CL', formatOptions)

  return `${inicioStr} - ${finStr}`
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: config.sorteo.moneda,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const getEstadoClass = (estado: string) => {
  const classes: Record<string, string> = {
    en_curso: 'bg-blue-100 text-blue-700 border border-blue-300',
    finalizado: 'bg-gray-100 text-gray-700 border border-gray-300'
  }
  return classes[estado] || 'bg-gray-100 text-gray-700'
}

const getEstadoLabel = (estado: string) => {
  const labels: Record<string, string> = {
    en_curso: 'En Curso',
    finalizado: 'Finalizado'
  }
  return labels[estado] || estado
}

const getRankingBadgeClass = (posicion: number) => {
  if (posicion === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600'
  if (posicion === 2) return 'bg-gradient-to-br from-gray-300 to-gray-500'
  if (posicion === 3) return 'bg-gradient-to-br from-orange-400 to-orange-600'
  return 'bg-gradient-to-br from-blue-400 to-blue-600'
}

const getRankingEmoji = (posicion: number) => {
  if (posicion === 1) return '🥇'
  if (posicion === 2) return '🥈'
  if (posicion === 3) return '🥉'
  return posicion.toString()
}

const getRendimientoPercentage = (posicion: number, totalParticipantes: number) => {
  // Calculate how close to top 1 (100% = first place, 0% = last place)
  return Math.round(((totalParticipantes - posicion + 1) / totalParticipantes) * 100)
}

const getRendimientoBarClass = (posicion: number) => {
  if (posicion === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
  if (posicion <= 3) return 'bg-gradient-to-r from-orange-400 to-orange-600'
  if (posicion <= 10) return 'bg-gradient-to-r from-blue-400 to-blue-600'
  return 'bg-gradient-to-r from-gray-400 to-gray-600'
}

const getTituloVacio = () => {
  switch (filtroActivo.value) {
    case 'en_curso':
      return 'No hay sorteos en curso'
    case 'finalizados':
      return 'No hay sorteos finalizados'
    case 'ganados':
      return 'Aún no has ganado ningún sorteo'
    default:
      return 'No has participado en sorteos'
  }
}

const getMensajeVacio = () => {
  switch (filtroActivo.value) {
    case 'en_curso':
      return 'Cuando participes en un sorteo activo, aparecerá aquí'
    case 'finalizados':
      return 'Tus sorteos finalizados aparecerán aquí'
    case 'ganados':
      return '¡Sigue jugando y acumulando puntos para ganar!'
    default:
      return '¡Comienza a jugar para acumular puntos y participar en sorteos!'
  }
}
</script>

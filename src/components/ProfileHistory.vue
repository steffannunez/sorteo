<template>
  <BaseCard variant="elevated">
    <template #header>
      <h3 class="text-xl font-bold text-texto-principal">Historial de Participaciones</h3>
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

      <!-- Lista de compras -->
      <div v-if="comprasFiltradas.length > 0" class="space-y-3">
        <div
          v-for="compra in comprasFiltradas"
          :key="compra.id"
          class="p-5 bg-gradient-to-r from-crema/30 to-transparent rounded-xl border border-bordes hover:border-dorado-claro transition-all duration-300 hover:shadow-md"
        >
          <div class="flex items-start justify-between">
            <!-- Info principal -->
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <div class="w-12 h-12 bg-gradient-to-br from-dorado to-dorado-oscuro rounded-lg flex items-center justify-center text-blanco-puro font-bold text-lg shadow-md">
                  {{ compra.numero }}
                </div>
                <div>
                  <div class="font-bold text-texto-principal">Número {{ compra.numero }}</div>
                  <div class="text-xs text-texto-secundario">{{ formatDate(compra.fechaCompra) }}</div>
                </div>
              </div>

              <!-- Detalles -->
              <div class="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <div class="text-xs text-texto-secundario">Monto Pagado</div>
                  <div class="text-sm font-semibold text-texto-principal">{{ formatCurrency(compra.montoPagado) }}</div>
                </div>
                <div>
                  <div class="text-xs text-texto-secundario">Método de Pago</div>
                  <div class="flex items-center space-x-1 mt-1">
                    <span class="text-sm font-medium text-texto-principal capitalize">
                      {{ getPaymentMethodLabel(compra.metodoPago) }}
                    </span>
                    <span :class="getPaymentMethodIcon(compra.metodoPago)"></span>
                  </div>
                </div>
              </div>

              <!-- ID Transacción (expandible) -->
              <div class="mt-3">
                <button
                  @click="toggleTransactionId(compra.id)"
                  class="text-xs text-dorado-oscuro hover:text-dorado transition-colors flex items-center space-x-1"
                >
                  <span>{{ expandedTransactions.has(compra.id) ? 'Ocultar' : 'Ver' }} ID de transacción</span>
                  <svg
                    class="w-3 h-3 transition-transform"
                    :class="{ 'rotate-180': expandedTransactions.has(compra.id) }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div v-if="expandedTransactions.has(compra.id)" class="mt-2 p-2 bg-crema/50 rounded text-xs font-mono text-texto-secundario break-all">
                  {{ compra.transaccionId }}
                </div>
              </div>
            </div>

            <!-- Badges de estado -->
            <div class="flex flex-col items-end space-y-2 ml-4">
              <!-- Badge estado pago -->
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-bold shadow-sm',
                  getEstadoPagoClass(compra.estadoPago)
                ]"
              >
                {{ getEstadoPagoLabel(compra.estadoPago) }}
              </span>

              <!-- Badge estado sorteo -->
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold shadow-sm',
                  getEstadoSorteoClass(compra.estadoSorteo)
                ]"
              >
                {{ getEstadoSorteoLabel(compra.estadoSorteo) }}
              </span>

              <!-- Badge ganador -->
              <div v-if="compra.esGanador" class="mt-2">
                <div class="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-full text-xs font-bold shadow-lg animate-pulse">
                  GANADOR
                </div>
                <div class="text-right mt-1 text-sm font-bold bg-gradient-to-r from-dorado-oscuro to-dorado bg-clip-text text-transparent">
                  {{ formatCurrency(compra.montoGanado || 0) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje vacío -->
      <div v-else class="text-center py-16">
        <div class="text-6xl mb-4">🎫</div>
        <div class="text-texto-secundario">
          <p class="font-medium text-lg mb-2">No hay compras en esta categoría</p>
          <p class="text-sm">{{ getMensajeVacio() }}</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block w-8 h-8 border-4 border-dorado border-t-transparent rounded-full animate-spin"></div>
        <p class="text-texto-secundario text-sm mt-3">Cargando historial...</p>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePerfilStore } from '@/stores/perfilStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import { config } from '@/config/env'
import type { HistorialCompra } from '@/types'

const perfilStore = usePerfilStore()

const loading = computed(() => perfilStore.loading)
const historial = computed(() => perfilStore.historialOrdenado)

const filtroActivo = ref<'todas' | 'pagadas' | 'pendientes' | 'ganadoras'>('todas')
const expandedTransactions = ref(new Set<string>())

const filtros = computed(() => [
  { label: 'Todas', value: 'todas' as const, count: historial.value.length },
  { label: 'Pagadas', value: 'pagadas' as const, count: perfilStore.comprasPagadas.length },
  { label: 'Pendientes', value: 'pendientes' as const, count: perfilStore.comprasPendientes.length },
  { label: 'Ganadoras', value: 'ganadoras' as const, count: perfilStore.comprasGanadoras.length },
])

const comprasFiltradas = computed(() => {
  switch (filtroActivo.value) {
    case 'pagadas':
      return perfilStore.comprasPagadas
    case 'pendientes':
      return perfilStore.comprasPendientes
    case 'ganadoras':
      return perfilStore.comprasGanadoras
    default:
      return historial.value
  }
})

onMounted(async () => {
  await perfilStore.fetchHistorialCompras()
})

const toggleTransactionId = (id: string) => {
  if (expandedTransactions.value.has(id)) {
    expandedTransactions.value.delete(id)
  } else {
    expandedTransactions.value.add(id)
  }
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: config.sorteo.moneda,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const getPaymentMethodLabel = (method: string) => {
  const labels: Record<string, string> = {
    paypal: 'PayPal',
    mercadopago: 'Mercado Pago',
    stripe: 'Stripe'
  }
  return labels[method] || method
}

const getPaymentMethodIcon = (method: string) => {
  // Placeholder para íconos de métodos de pago
  return ''
}

const getEstadoPagoClass = (estado: string) => {
  const classes: Record<string, string> = {
    pagado: 'bg-green-100 text-green-700 border border-green-300',
    pendiente: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    rechazado: 'bg-red-100 text-red-700 border border-red-300'
  }
  return classes[estado] || 'bg-gray-100 text-gray-700'
}

const getEstadoPagoLabel = (estado: string) => {
  const labels: Record<string, string> = {
    pagado: 'Pagado',
    pendiente: 'Pendiente',
    rechazado: 'Rechazado'
  }
  return labels[estado] || estado
}

const getEstadoSorteoClass = (estado: string) => {
  const classes: Record<string, string> = {
    en_curso: 'bg-blue-100 text-blue-700 border border-blue-300',
    finalizado: 'bg-gray-100 text-gray-700 border border-gray-300'
  }
  return classes[estado] || 'bg-gray-100 text-gray-700'
}

const getEstadoSorteoLabel = (estado: string) => {
  const labels: Record<string, string> = {
    en_curso: 'En Curso',
    finalizado: 'Finalizado'
  }
  return labels[estado] || estado
}

const getMensajeVacio = () => {
  switch (filtroActivo.value) {
    case 'pagadas':
      return 'Aún no tienes compras pagadas'
    case 'pendientes':
      return 'No tienes compras pendientes de pago'
    case 'ganadoras':
      return 'Aún no has ganado ningún sorteo. ¡Sigue participando!'
    default:
      return 'Comienza a participar en sorteos para ver tu historial aquí'
  }
}
</script>

<template>
  <BaseCard variant="elevated">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-bold text-texto-principal">Historial de Tickets</h3>
        <div class="text-xs text-texto-secundario">
          Compras de tickets para juegos
        </div>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Resumen de tickets -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 bg-gradient-to-br from-green-50 to-transparent rounded-lg border border-green-200">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white shadow">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <div class="text-xs text-texto-secundario font-medium">Total Comprados</div>
              <div class="text-2xl font-bold text-green-600">
                {{ ticketsComprados }}
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gradient-to-br from-blue-50 to-transparent rounded-lg border border-blue-200">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white shadow">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div class="text-xs text-texto-secundario font-medium">Usados</div>
              <div class="text-2xl font-bold text-blue-600">
                {{ ticketsUsados }}
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gradient-to-br from-purple-50 to-transparent rounded-lg border border-purple-200">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white shadow">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div class="text-xs text-texto-secundario font-medium">Total Gastado</div>
              <div class="text-lg font-bold text-purple-600">
                {{ formatCurrency(totalGastado) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de compras de tickets -->
      <div>
        <h4 class="font-bold text-texto-principal mb-3">Historial de Compras</h4>

        <div v-if="historialTickets.length > 0" class="space-y-3">
          <div
            v-for="ticket in historialTickets"
            :key="ticket.id"
            class="p-4 bg-gradient-to-r from-crema/30 to-transparent rounded-lg border border-bordes hover:border-dorado-claro transition-all duration-300 hover:shadow-md"
          >
            <div class="flex items-start justify-between">
              <!-- Info principal -->
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <div class="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center text-white shadow">
                    <span class="text-lg font-bold">{{ ticket.cantidad }}</span>
                  </div>
                  <div>
                    <div class="font-bold text-texto-principal">
                      {{ ticket.cantidad }} Ticket{{ ticket.cantidad > 1 ? 's' : '' }}
                    </div>
                    <div class="text-xs text-texto-secundario">
                      {{ formatDate(ticket.fechaCompra) }}
                    </div>
                  </div>
                </div>

                <!-- Detalles de la compra -->
                <div class="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <div class="text-xs text-texto-secundario">Monto Pagado</div>
                    <div class="text-sm font-semibold text-texto-principal">
                      {{ formatCurrency(ticket.montoPagado) }}
                    </div>
                  </div>
                  <div>
                    <div class="text-xs text-texto-secundario">Método de Pago</div>
                    <div class="text-sm font-medium text-texto-principal capitalize">
                      {{ getPaymentMethodLabel(ticket.metodoPago) }}
                    </div>
                  </div>
                </div>

                <!-- ID Transacción (expandible) -->
                <div class="mt-3">
                  <button
                    @click="toggleTransactionId(ticket.id)"
                    class="text-xs text-dorado-oscuro hover:text-dorado transition-colors flex items-center space-x-1"
                  >
                    <span>{{ expandedTransactions.has(ticket.id) ? 'Ocultar' : 'Ver' }} ID de transacción</span>
                    <svg
                      class="w-3 h-3 transition-transform"
                      :class="{ 'rotate-180': expandedTransactions.has(ticket.id) }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div v-if="expandedTransactions.has(ticket.id)" class="mt-2 p-2 bg-crema/50 rounded text-xs font-mono text-texto-secundario break-all">
                    {{ ticket.transaccionId }}
                  </div>
                </div>
              </div>

              <!-- Badge estado de pago -->
              <div class="ml-4">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-bold shadow-sm',
                    getEstadoPagoClass(ticket.estadoPago)
                  ]"
                >
                  {{ getEstadoPagoLabel(ticket.estadoPago) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje vacío -->
        <div v-else class="text-center py-12">
          <div class="text-5xl mb-3">🎫</div>
          <div class="text-texto-secundario">
            <p class="font-medium text-lg mb-1">No has comprado tickets aún</p>
            <p class="text-sm">Compra tickets para obtener intentos adicionales en los juegos</p>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block w-8 h-8 border-4 border-dorado border-t-transparent rounded-full animate-spin"></div>
        <p class="text-texto-secundario text-sm mt-3">Cargando historial de tickets...</p>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTicketStore } from '@/stores/ticketStore'
import { usePerfilStore } from '@/stores/perfilStore'
import { useAuthStore } from '@/stores/authStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import { config } from '@/config/env'

const ticketStore = useTicketStore()
const perfilStore = usePerfilStore()
const authStore = useAuthStore()

const loading = computed(() => ticketStore.loading)
const historialTickets = computed(() => ticketStore.historialCompras)
const ticketsComprados = computed(() => perfilStore.userStats.ticketsComprados)
const ticketsUsados = computed(() => perfilStore.userStats.ticketsUsados)
const totalGastado = computed(() => perfilStore.userStats.totalGastado)

const expandedTransactions = ref(new Set<string>())

onMounted(() => {
  // Cargar datos de prueba para tickets si el usuario está autenticado
  if (authStore.user && historialTickets.value.length === 0) {
    ticketStore.cargarDatosDePrueba(authStore.user.id)
  }
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
</script>

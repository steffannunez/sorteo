<template>
  <BaseCard variant="elevated">
    <template #header>
      <div class="space-y-2">
        <h3 class="text-xl font-bold text-texto-principal">
          Tus Tickets
        </h3>
        <p class="text-sm text-texto-secundario">
          1 ticket = 1 intento de juego
        </p>
      </div>
    </template>

    <div class="space-y-6">
      <!-- Tickets Disponibles -->
      <div class="bg-gradient-to-r from-dorado-claro/20 to-transparent rounded-xl p-5 border border-dorado-claro">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-texto-secundario font-medium">Tickets Disponibles</div>
            <div class="text-3xl font-bold bg-gradient-to-r from-dorado-oscuro to-dorado bg-clip-text text-transparent">
              {{ ticketsDisponibles }}
            </div>
          </div>
          <div class="text-5xl">🎫</div>
        </div>

        <div class="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-dorado-claro/30">
          <div>
            <div class="text-xs text-texto-secundario">Usados</div>
            <div class="text-sm font-semibold text-texto-principal">{{ ticketsUsados }}</div>
          </div>
          <div>
            <div class="text-xs text-texto-secundario">Comprados</div>
            <div class="text-sm font-semibold text-texto-principal">{{ ticketsComprados }}</div>
          </div>
        </div>
      </div>

      <!-- Comprar Tickets -->
      <div class="space-y-4">
        <h4 class="font-bold text-texto-principal">Comprar Tickets</h4>

        <!-- Selector de Cantidad -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-texto-secundario">Cantidad</label>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="outline"
              size="sm"
              @click="decrementarCantidad"
              :disabled="cantidadSeleccionada <= 1"
            >
              −
            </BaseButton>
            <input
              v-model.number="cantidadSeleccionada"
              type="number"
              min="1"
              max="100"
              class="w-20 text-center px-3 py-2 border border-bordes rounded-lg focus:outline-none focus:ring-2 focus:ring-dorado-claro focus:border-transparent"
            />
            <BaseButton
              variant="outline"
              size="sm"
              @click="incrementarCantidad"
              :disabled="cantidadSeleccionada >= 100"
            >
              +
            </BaseButton>
          </div>
        </div>

        <!-- Paquetes Rápidos -->
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="pack in paquetes"
            :key="pack.cantidad"
            @click="seleccionarPaquete(pack.cantidad)"
            :class="[
              'p-3 rounded-lg border-2 transition-all duration-200',
              cantidadSeleccionada === pack.cantidad
                ? 'border-dorado bg-gradient-to-r from-dorado-claro/20 to-transparent'
                : 'border-bordes hover:border-dorado-claro'
            ]"
          >
            <div class="text-lg font-bold text-texto-principal">{{ pack.cantidad }}</div>
            <div class="text-xs text-texto-secundario">tickets</div>
            <div v-if="pack.descuento" class="text-xs font-semibold text-green-600 mt-1">
              {{ pack.descuento }}
            </div>
          </button>
        </div>

        <!-- Total a Pagar -->
        <div class="bg-crema rounded-lg p-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-texto-secundario">Precio unitario:</span>
            <span class="font-semibold text-texto-principal">{{ formatPrecio(precioTicket) }}</span>
          </div>
          <div v-if="descuentoAplicado > 0" class="flex justify-between text-sm">
            <span class="text-texto-secundario">Descuento:</span>
            <span class="font-semibold text-green-600">-{{ formatPrecio(descuentoAplicado) }}</span>
          </div>
          <div class="flex justify-between pt-2 border-t border-bordes">
            <span class="font-bold text-texto-principal">Total:</span>
            <span class="font-bold text-lg bg-gradient-to-r from-dorado-oscuro to-dorado bg-clip-text text-transparent">
              {{ formatPrecio(totalAPagar) }}
            </span>
          </div>
        </div>

        <!-- Selector de Método de Pago -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-texto-secundario">Método de Pago</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              @click="metodoPago = 'paypal'"
              :class="[
                'p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center',
                metodoPago === 'paypal'
                  ? 'border-dorado bg-gradient-to-r from-dorado-claro/20 to-transparent'
                  : 'border-bordes hover:border-dorado-claro'
              ]"
            >
              <img src="../assets/paypalv2.png" alt="paypal logo"/>
              <!--<div class="text-xs font-medium text-texto-principal mt-1">PayPal</div>-->
            </button>
            <button
              @click="metodoPago = 'mercadopago'"
              :class="[
                'p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center',
                metodoPago === 'mercadopago'
                  ? 'border-dorado bg-gradient-to-r from-dorado-claro/20 to-transparent'
                  : 'border-bordes hover:border-dorado-claro'
              ]"
            >
              <img src="../assets/mercadopago.png" alt="mercadopago logo"/>
              <!--<div class="text-xs font-medium text-texto-principal mt-1">Mercado Pago</div>-->
            </button>
            <button
              @click="metodoPago = 'stripe'"
              :class="[
                'p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center',
                metodoPago === 'stripe'
                  ? 'border-dorado bg-gradient-to-r from-dorado-claro/20 to-transparent'
                  : 'border-bordes hover:border-dorado-claro'
              ]"
            >
              <img src="../assets/stripe.png" alt="stripe logo"/>
              <!--<div class="text-xs font-medium text-texto-principal mt-1">Stripe</div>-->
            </button>
          </div>
        </div>

        <!-- Botón de Compra -->
        <BaseButton
          @click="comprar"
          :disabled="loading || cantidadSeleccionada < 1"
          class="w-full"
          size="lg"
        >
          <span v-if="loading">Procesando...</span>
          <span v-else>Comprar {{ cantidadSeleccionada }} Ticket{{ cantidadSeleccionada > 1 ? 's' : '' }}</span>
        </BaseButton>

        <!-- Mensaje de Error -->
        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTicketStore } from '@/stores/ticketStore'
import { useAuthStore } from '@/stores/authStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const ticketStore = useTicketStore()
const authStore = useAuthStore()

const cantidadSeleccionada = ref(5)
const metodoPago = ref<'paypal' | 'mercadopago' | 'stripe'>('paypal')

const loading = computed(() => ticketStore.loading)
const error = computed(() => ticketStore.error)
const ticketsDisponibles = computed(() => ticketStore.ticketsDisponibles)
const ticketsUsados = computed(() => ticketStore.ticketsUsados)
const ticketsComprados = computed(() => ticketStore.ticketsComprados)
const precioTicket = computed(() => ticketStore.precioTicket)

const paquetes = [
  { cantidad: 5, descuento: null },
  { cantidad: 10, descuento: '5% OFF' },
  { cantidad: 20, descuento: '10% OFF' },
]

const descuentoAplicado = computed(() => {
  if (cantidadSeleccionada.value >= 20) return precioTicket.value * cantidadSeleccionada.value * 0.10
  if (cantidadSeleccionada.value >= 10) return precioTicket.value * cantidadSeleccionada.value * 0.05
  return 0
})

const totalAPagar = computed(() => {
  const subtotal = precioTicket.value * cantidadSeleccionada.value
  return subtotal - descuentoAplicado.value
})

const incrementarCantidad = () => {
  if (cantidadSeleccionada.value < 100) {
    cantidadSeleccionada.value++
  }
}

const decrementarCantidad = () => {
  if (cantidadSeleccionada.value > 1) {
    cantidadSeleccionada.value--
  }
}

const seleccionarPaquete = (cantidad: number) => {
  cantidadSeleccionada.value = cantidad
}

const formatPrecio = (precio: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(precio)
}

const comprar = async () => {
  if (!authStore.user) {
    alert('Debes iniciar sesión para comprar tickets')
    return
  }

  const resultado = await ticketStore.comprarTickets({
    userId: authStore.user.id,
    cantidad: cantidadSeleccionada.value,
    metodoPago: metodoPago.value,
  })

  if (resultado.success) {
    alert(`¡Compra exitosa! Has adquirido ${cantidadSeleccionada.value} ticket${cantidadSeleccionada.value > 1 ? 's' : ''}`)
    cantidadSeleccionada.value = 5
  }
}
</script>

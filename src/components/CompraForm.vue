<template>
  <BaseCard class="max-w-md mx-auto">
    <template #header>
      <h2 class="text-xl font-semibold text-gris-oscuro text-center">
        Comprar Número
      </h2>
    </template>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <BaseInput
        v-model.number="form.numero"
        type="number"
        label="Número a comprar"
        placeholder="1"
        :min="1"
        :max="10000"
        required
        :error="errors.numero"
        help="Selecciona un número entre 1 y 10,000"
      />
      
      <div>
        <label class="text-sm font-medium text-gris-oscuro mb-2 block">
          Método de Pago
        </label>
        <div class="space-y-2">
          <label 
            v-for="metodo in metodosPago" 
            :key="metodo.value"
            class="flex items-center space-x-3 p-3 border border-gris-medio rounded-lg cursor-pointer hover:bg-gris-claro"
            :class="{ 'border-dorado bg-dorado/10': form.metodoPago === metodo.value }"
          >
            <input
              v-model="form.metodoPago"
              type="radio"
              :value="metodo.value"
              class="text-dorado focus:ring-dorado"
            />
            <div class="flex items-center space-x-2">
              <i :class="metodo.icon" class="text-lg"></i>
              <span class="font-medium text-gris-oscuro">{{ metodo.label }}</span>
            </div>
          </label>
        </div>
        <p v-if="errors.metodoPago" class="text-sm text-red-600 mt-1">{{ errors.metodoPago }}</p>
      </div>
      
      <div class="bg-gris-claro p-4 rounded-lg">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gris-medio">Precio por número:</span>
          <span class="font-semibold text-gris-oscuro">${{ precioFormateado }}</span>
        </div>
        <div class="flex justify-between items-center mt-2">
          <span class="text-sm text-gris-medio">Total a pagar:</span>
          <span class="text-lg font-bold text-dorado">${{ precioFormateado }}</span>
        </div>
      </div>
      
      <BaseButton
        type="submit"
        class="w-full"
        :loading="loading"
        :disabled="!isFormValid"
      >
        {{ loading ? 'Procesando...' : 'Comprar Número' }}
      </BaseButton>
    </form>
    
    <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
      <p class="text-sm text-red-600">{{ error }}</p>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useSorteoStore } from '@/stores/sorteoStore'
import { PaymentServiceFactory } from '@/services/PaymentServiceFactory'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { CompraForm } from '@/types'

const sorteoStore = useSorteoStore()

const form = reactive<CompraForm>({
  numero: 1,
  metodoPago: 'paypal',
})

const errors = reactive({
  numero: '',
  metodoPago: '',
})

const loading = computed(() => sorteoStore.loading)
const error = computed(() => sorteoStore.error)

const metodosPago = PaymentServiceFactory.getAvailableMethods()

const precioFormateado = computed(() => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(1000) // Precio fijo por ahora
})

const isFormValid = computed(() => {
  return form.numero >= 1 && form.numero <= 10000 && form.metodoPago
})

const validateForm = () => {
  // Limpiar errores anteriores
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Validar número
  if (!form.numero || form.numero < 1 || form.numero > 10000) {
    errors.numero = 'El número debe estar entre 1 y 10,000'
    isValid = false
  }

  // Validar método de pago
  if (!form.metodoPago) {
    errors.metodoPago = 'Selecciona un método de pago'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  const compra = {
    numero: form.numero,
    userId: 'user-id-placeholder', // En una app real, esto vendría del store de auth
    metodoPago: form.metodoPago,
  }

  const resultado = await sorteoStore.comprarNumero(compra)
  
  if (resultado?.urlPago) {
    // Redirigir a la página de pago
    window.open(resultado.urlPago, '_blank')
  }
}
</script>

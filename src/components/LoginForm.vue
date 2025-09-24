<template>
  <BaseCard class="max-w-md mx-auto">
    <template #header>
      <h2 class="text-xl font-semibold text-gris-oscuro text-center">
        Iniciar Sesión
      </h2>
    </template>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <BaseInput
        v-model="form.email"
        type="email"
        label="Correo Electrónico"
        placeholder="tu@email.com"
        required
        :error="errors.email"
      />
      
      <BaseInput
        v-model="form.nombre"
        type="text"
        label="Nombre Completo"
        placeholder="Juan Pérez"
        required
        :error="errors.nombre"
      />
      
      <BaseInput
        v-model="form.rut"
        type="text"
        label="RUT"
        placeholder="12.345.678-9"
        required
        :error="errors.rut"
        help="Formato: 12.345.678-9"
      />
      
      <BaseInput
        v-model="form.telefono"
        type="tel"
        label="Teléfono"
        placeholder="+56 9 1234 5678"
        required
        :error="errors.telefono"
      />
      
      <BaseButton
        type="submit"
        class="w-full"
        :loading="loading"
        :disabled="!isFormValid"
      >
        {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
      </BaseButton>
    </form>
    
    <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
      <p class="text-sm text-red-600">{{ error }}</p>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { LoginForm } from '@/types'

const authStore = useAuthStore()

const form = reactive<LoginForm>({
  email: '',
  nombre: '',
  rut: '',
  telefono: '',
})

const errors = reactive({
  email: '',
  nombre: '',
  rut: '',
  telefono: '',
})

const loading = computed(() => authStore.loading)
const error = computed(() => authStore.error)

const isFormValid = computed(() => {
  return form.email && form.nombre && form.rut && form.telefono
})

const validateForm = () => {
  // Limpiar errores anteriores
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email || !emailRegex.test(form.email)) {
    errors.email = 'Ingresa un correo electrónico válido'
    isValid = false
  }

  // Validar nombre
  if (!form.nombre || form.nombre.trim().length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres'
    isValid = false
  }

  // Validar RUT
  const rutRegex = /^[0-9]+-[0-9kK]$/
  if (!form.rut || !rutRegex.test(form.rut)) {
    errors.rut = 'Ingresa un RUT válido (ej: 12.345.678-9)'
    isValid = false
  }

  // Validar teléfono
  const phoneRegex = /^[+]?[0-9\s-()]{8,}$/
  if (!form.telefono || !phoneRegex.test(form.telefono)) {
    errors.telefono = 'Ingresa un teléfono válido'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  await authStore.login(form)
}
</script>

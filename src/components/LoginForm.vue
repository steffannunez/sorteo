<template>
  <BaseCard class="max-w-md mx-auto">
    <template #header>
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-texto-principal text-center">
          {{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}
        </h2>

        <!-- Toggle entre Login y Registro -->
        <div class="flex bg-crema/30 rounded-lg p-1">
          <button
            type="button"
            @click="isLogin = true"
            :class="[
              'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200',
              isLogin
                ? 'bg-gradient-to-r from-dorado to-dorado-oscuro text-blanco-puro shadow-md'
                : 'text-texto-secundario hover:text-texto-principal'
            ]"
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            @click="isLogin = false"
            :class="[
              'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200',
              !isLogin
                ? 'bg-gradient-to-r from-dorado to-dorado-oscuro text-blanco-puro shadow-md'
                : 'text-texto-secundario hover:text-texto-principal'
            ]"
          >
            Registrarse
          </button>
        </div>
      </div>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Email (común para ambos) -->
      <div>
        <label class="block text-sm font-medium text-texto-principal mb-2">
          Correo Electrónico
        </label>
        <BaseInput
          v-model="form.email"
          type="email"
          placeholder="tu@email.com"
          required
        />
        <div v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</div>
      </div>

      <!-- Contraseña (común para ambos) -->
      <div>
        <label class="block text-sm font-medium text-texto-principal mb-2">
          Contraseña
        </label>
        <BaseInput
          v-model="form.password"
          type="password"
          :placeholder="isLogin ? 'Tu contraseña' : 'Mínimo 8 caracteres'"
          required
        />
        <div v-if="errors.password" class="text-xs text-red-600 mt-1">{{ errors.password }}</div>

        <!-- Indicador de fortaleza (solo en registro) -->
        <div v-if="!isLogin && form.password" class="mt-2">
          <div class="flex items-center space-x-2">
            <div class="flex-1 h-2 bg-bordes rounded-full overflow-hidden">
              <div
                class="h-full transition-all duration-300"
                :class="passwordStrengthClass"
                :style="{ width: passwordStrengthWidth }"
              ></div>
            </div>
            <span class="text-xs font-medium" :class="passwordStrengthTextColor">
              {{ passwordStrengthText }}
            </span>
          </div>
        </div>
      </div>

      <!-- Campos adicionales solo para registro -->
      <template v-if="!isLogin">
        <!-- Confirmar Contraseña -->
        <div>
          <label class="block text-sm font-medium text-texto-principal mb-2">
            Confirmar Contraseña
          </label>
          <BaseInput
            v-model="form.confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            required
          />
          <div v-if="form.confirmPassword && form.password !== form.confirmPassword" class="text-xs text-red-600 mt-1">
            Las contraseñas no coinciden
          </div>
          <div v-else-if="form.confirmPassword && form.password === form.confirmPassword" class="text-xs text-green-600 mt-1">
            Las contraseñas coinciden
          </div>
        </div>

        <!-- Nombre Completo -->
        <div>
          <label class="block text-sm font-medium text-texto-principal mb-2">
            Nombre Completo
          </label>
          <BaseInput
            v-model="form.nombre"
            type="text"
            placeholder="Juan Pérez"
            required
          />
          <div v-if="errors.nombre" class="text-xs text-red-600 mt-1">{{ errors.nombre }}</div>
        </div>

        <!-- RUT -->
        <div>
          <label class="block text-sm font-medium text-texto-principal mb-2">
            RUT
          </label>
          <BaseInput
            v-model="form.rut"
            type="text"
            placeholder="12345678-9"
            required
          />
          <div class="text-xs text-texto-secundario mt-1">Formato: 12345678-9 (sin puntos)</div>
          <div v-if="errors.rut" class="text-xs text-red-600 mt-1">{{ errors.rut }}</div>
        </div>

        <!-- Teléfono -->
        <div>
          <label class="block text-sm font-medium text-texto-principal mb-2">
            Teléfono
          </label>
          <BaseInput
            v-model="form.telefono"
            type="tel"
            placeholder="+56 9 1234 5678"
            required
          />
          <div v-if="errors.telefono" class="text-xs text-red-600 mt-1">{{ errors.telefono }}</div>
        </div>
      </template>

      <!-- Mensaje de error general -->
      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- Botón de submit -->
      <BaseButton
        type="submit"
        class="w-full"
        :disabled="loading || !isFormValid"
      >
        {{ submitButtonText }}
      </BaseButton>

      <!-- Link de recuperación de contraseña (solo en login) -->
      <div v-if="isLogin" class="text-center">
        <a href="#" class="text-sm text-dorado-oscuro hover:text-dorado transition-colors">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </form>
  </BaseCard>
</template>

<script setup lang="ts">
import { reactive, computed, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const authStore = useAuthStore()

const isLogin = ref(true)

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  nombre: '',
  rut: '',
  telefono: '',
})

const errors = reactive({
  email: '',
  password: '',
  nombre: '',
  rut: '',
  telefono: '',
})

const loading = computed(() => authStore.loading)
const error = computed(() => authStore.error)

// Limpiar errores cuando se cambia de modo
watch(isLogin, () => {
  authStore.clearError()
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
})

const isFormValid = computed(() => {
  if (isLogin.value) {
    return form.email && form.password
  } else {
    return (
      form.email &&
      form.password &&
      form.password.length >= 8 &&
      form.confirmPassword &&
      form.password === form.confirmPassword &&
      form.nombre &&
      form.rut &&
      form.telefono
    )
  }
})

const submitButtonText = computed(() => {
  if (loading.value) {
    return isLogin.value ? 'Iniciando sesión...' : 'Creando cuenta...'
  }
  return isLogin.value ? 'Iniciar Sesión' : 'Crear Cuenta'
})

// Cálculo de fortaleza de contraseña (para registro)
const passwordStrength = computed(() => {
  const password = form.password
  if (password.length === 0) return 0

  let strength = 0

  if (password.length >= 8) strength += 25
  if (password.length >= 12) strength += 25
  if (/\d/.test(password)) strength += 15
  if (/[a-z]/.test(password)) strength += 10
  if (/[A-Z]/.test(password)) strength += 15
  if (/[^A-Za-z0-9]/.test(password)) strength += 10

  return Math.min(strength, 100)
})

const passwordStrengthClass = computed(() => {
  if (passwordStrength.value < 30) return 'bg-red-500'
  if (passwordStrength.value < 60) return 'bg-yellow-500'
  if (passwordStrength.value < 80) return 'bg-blue-500'
  return 'bg-green-500'
})

const passwordStrengthTextColor = computed(() => {
  if (passwordStrength.value < 30) return 'text-red-600'
  if (passwordStrength.value < 60) return 'text-yellow-600'
  if (passwordStrength.value < 80) return 'text-blue-600'
  return 'text-green-600'
})

const passwordStrengthWidth = computed(() => `${passwordStrength.value}%`)

const passwordStrengthText = computed(() => {
  if (passwordStrength.value < 30) return 'Débil'
  if (passwordStrength.value < 60) return 'Media'
  if (passwordStrength.value < 80) return 'Buena'
  return 'Fuerte'
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

  // Validar contraseña
  if (!form.password || form.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres'
    isValid = false
  }

  // Validaciones adicionales para registro
  if (!isLogin.value) {
    // Validar nombre
    if (!form.nombre || form.nombre.trim().length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres'
      isValid = false
    }

    // Validar RUT
    const rutRegex = /^[0-9]+-[0-9kK]$/
    if (!form.rut || !rutRegex.test(form.rut)) {
      errors.rut = 'Ingresa un RUT válido (ej: 12345678-9)'
      isValid = false
    }

    // Validar teléfono
    const phoneRegex = /^[+]?[0-9\s-()]{8,}$/
    if (!form.telefono || !phoneRegex.test(form.telefono)) {
      errors.telefono = 'Ingresa un teléfono válido'
      isValid = false
    }

    // Validar que las contraseñas coincidan
    if (form.password !== form.confirmPassword) {
      isValid = false
    }
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  if (isLogin.value) {
    // Login
    await authStore.login({
      email: form.email,
      password: form.password,
    })
  } else {
    // Registro
    await authStore.register({
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      nombre: form.nombre,
      rut: form.rut,
      telefono: form.telefono,
    })
  }
}
</script>

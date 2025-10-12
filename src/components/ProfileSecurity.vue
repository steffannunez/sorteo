<template>
  <BaseCard variant="elevated">
    <template #header>
      <h3 class="text-xl font-bold text-texto-principal">Seguridad</h3>
    </template>

    <div class="space-y-6">
      <div class="p-4 bg-dorado-claro/10 border border-dorado-claro rounded-lg">
        <div class="flex items-start space-x-3">
          <svg class="w-5 h-5 text-dorado-oscuro mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <div class="text-sm font-semibold text-texto-principal">Cambia tu contraseña regularmente</div>
            <div class="text-xs text-texto-secundario mt-1">Una contraseña segura debe tener al menos 8 caracteres</div>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Contraseña Actual -->
        <div>
          <label class="block text-sm font-medium text-texto-principal mb-2">
            Contraseña Actual
          </label>
          <BaseInput
            v-model="formData.currentPassword"
            type="password"
            placeholder="Ingresa tu contraseña actual"
            required
          />
        </div>

        <!-- Nueva Contraseña -->
        <div>
          <label class="block text-sm font-medium text-texto-principal mb-2">
            Nueva Contraseña
          </label>
          <BaseInput
            v-model="formData.newPassword"
            type="password"
            placeholder="Mínimo 8 caracteres"
            required
          />
          <!-- Indicador de fortaleza -->
          <div v-if="formData.newPassword" class="mt-2">
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

        <!-- Confirmar Nueva Contraseña -->
        <div>
          <label class="block text-sm font-medium text-texto-principal mb-2">
            Confirmar Nueva Contraseña
          </label>
          <BaseInput
            v-model="formData.confirmPassword"
            type="password"
            placeholder="Repite la nueva contraseña"
            required
          />
          <!-- Mensaje de validación -->
          <div v-if="formData.confirmPassword && formData.newPassword !== formData.confirmPassword" class="mt-1 text-xs text-red-600">
            Las contraseñas no coinciden
          </div>
          <div v-else-if="formData.confirmPassword && formData.newPassword === formData.confirmPassword" class="mt-1 text-xs text-green-600">
            Las contraseñas coinciden
          </div>
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <!-- Mensaje de éxito -->
        <div v-if="successMessage" class="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-600">{{ successMessage }}</p>
        </div>

        <!-- Botón de acción -->
        <BaseButton
          type="submit"
          :disabled="loading || !isFormValid"
          class="w-full"
        >
          {{ loading ? 'Cambiando Contraseña...' : 'Cambiar Contraseña' }}
        </BaseButton>
      </form>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePerfilStore } from '@/stores/perfilStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const perfilStore = usePerfilStore()

const loading = computed(() => perfilStore.loading)
const error = computed(() => perfilStore.error)

const formData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const successMessage = ref('')

const isFormValid = computed(() => {
  return (
    formData.value.currentPassword.length > 0 &&
    formData.value.newPassword.length >= 8 &&
    formData.value.newPassword === formData.value.confirmPassword
  )
})

// Cálculo de fortaleza de contraseña
const passwordStrength = computed(() => {
  const password = formData.value.newPassword
  if (password.length === 0) return 0

  let strength = 0

  // Longitud
  if (password.length >= 8) strength += 25
  if (password.length >= 12) strength += 25

  // Tiene números
  if (/\d/.test(password)) strength += 15

  // Tiene minúsculas
  if (/[a-z]/.test(password)) strength += 10

  // Tiene mayúsculas
  if (/[A-Z]/.test(password)) strength += 15

  // Tiene caracteres especiales
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

const handleSubmit = async () => {
  successMessage.value = ''
  perfilStore.clearError()

  const success = await perfilStore.changePassword(formData.value)

  if (success) {
    successMessage.value = 'Contraseña cambiada exitosamente'
    formData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }

    // Limpiar mensaje de éxito después de 5 segundos
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  }
}
</script>

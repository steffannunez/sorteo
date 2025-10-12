<template>
  <BaseCard variant="elevated">
    <template #header>
      <h3 class="text-xl font-bold text-texto-principal">Preferencias de Notificaciones</h3>
    </template>

    <div class="space-y-6">
      <div class="text-sm text-texto-secundario">
        Configura qué tipos de notificaciones deseas recibir
      </div>

      <!-- Toggles de notificaciones -->
      <div class="space-y-4">
        <!-- Notificaciones por Email -->
        <div class="flex items-center justify-between p-4 bg-gradient-to-r from-crema/50 to-transparent rounded-xl border border-bordes hover:border-dorado-claro transition-all duration-300">
          <div class="flex items-start space-x-3 flex-1">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-texto-principal">Notificaciones por Email</div>
              <div class="text-xs text-texto-secundario mt-1">Recibe actualizaciones importantes en tu correo</div>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="preferences.emailNotifications"
              type="checkbox"
              class="sr-only peer"
              @change="handleChange"
            />
            <div class="w-11 h-6 bg-bordes rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-dorado peer-checked:to-dorado-oscuro"></div>
          </label>
        </div>

        <!-- Notificaciones de Sorteos -->
        <div class="flex items-center justify-between p-4 bg-gradient-to-r from-crema/50 to-transparent rounded-xl border border-bordes hover:border-dorado-claro transition-all duration-300">
          <div class="flex items-start space-x-3 flex-1">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white shadow-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-texto-principal">Recordatorios de Sorteos</div>
              <div class="text-xs text-texto-secundario mt-1">Alertas sobre sorteos próximos y en curso</div>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="preferences.sorteoNotifications"
              type="checkbox"
              class="sr-only peer"
              @change="handleChange"
            />
            <div class="w-11 h-6 bg-bordes rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-dorado peer-checked:to-dorado-oscuro"></div>
          </label>
        </div>

        <!-- Notificaciones de Ganadores -->
        <div class="flex items-center justify-between p-4 bg-gradient-to-r from-crema/50 to-transparent rounded-xl border border-bordes hover:border-dorado-claro transition-all duration-300">
          <div class="flex items-start space-x-3 flex-1">
            <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white shadow-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-texto-principal">Anuncios de Ganadores</div>
              <div class="text-xs text-texto-secundario mt-1">Notificaciones cuando se anuncian ganadores</div>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="preferences.ganadoresNotifications"
              type="checkbox"
              class="sr-only peer"
              @change="handleChange"
            />
            <div class="w-11 h-6 bg-bordes rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-dorado peer-checked:to-dorado-oscuro"></div>
          </label>
        </div>

        <!-- Promociones -->
        <div class="flex items-center justify-between p-4 bg-gradient-to-r from-crema/50 to-transparent rounded-xl border border-bordes hover:border-dorado-claro transition-all duration-300">
          <div class="flex items-start space-x-3 flex-1">
            <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white shadow-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-texto-principal">Promociones y Ofertas</div>
              <div class="text-xs text-texto-secundario mt-1">Descuentos especiales y promociones exclusivas</div>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="preferences.promocionesNotifications"
              type="checkbox"
              class="sr-only peer"
              @change="handleChange"
            />
            <div class="w-11 h-6 bg-bordes rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-dorado peer-checked:to-dorado-oscuro"></div>
          </label>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- Mensaje de guardado automático -->
      <div v-if="saveMessage" class="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <p class="text-sm text-green-600">{{ saveMessage }}</p>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePerfilStore } from '@/stores/perfilStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import type { NotificationPreferences } from '@/types'

const perfilStore = usePerfilStore()

const error = computed(() => perfilStore.error)
const saveMessage = ref('')

const preferences = ref<NotificationPreferences>({
  emailNotifications: true,
  sorteoNotifications: true,
  ganadoresNotifications: true,
  promocionesNotifications: false,
})

onMounted(async () => {
  await perfilStore.fetchNotificationPreferences()
  preferences.value = { ...perfilStore.notificationPreferences }
})

let saveTimeout: NodeJS.Timeout | null = null

const handleChange = async () => {
  // Limpiar timeout anterior
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }

  // Esperar 500ms después del último cambio para guardar
  saveTimeout = setTimeout(async () => {
    perfilStore.clearError()
    saveMessage.value = ''

    const success = await perfilStore.updateNotificationPreferences(preferences.value)

    if (success) {
      saveMessage.value = 'Preferencias guardadas automáticamente'
      setTimeout(() => {
        saveMessage.value = ''
      }, 3000)
    }
  }, 500)
}
</script>

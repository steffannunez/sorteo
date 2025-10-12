<template>
  <BaseCard variant="elevated">
    <template #header>
      <h3 class="text-xl font-bold text-texto-principal">Información Personal</h3>
    </template>

    <div class="space-y-6">
      <!-- Avatar -->
      <div class="flex flex-col items-center space-y-4">
        <div class="relative group">
          <div v-if="!avatarUrl" class="w-24 h-24 bg-gradient-to-br from-dorado to-dorado-oscuro rounded-full flex items-center justify-center text-blanco-puro text-3xl font-bold shadow-lg">
            {{ userInitials }}
          </div>
          <img v-else :src="avatarUrl" alt="Avatar" class="w-24 h-24 rounded-full object-cover shadow-lg" />

          <!-- Overlay para cambiar foto -->
          <label for="avatar-upload" class="absolute inset-0 bg-texto-principal/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <svg class="w-8 h-8 text-blanco-puro" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </label>
          <input id="avatar-upload" type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
        </div>
        <div class="text-xs text-texto-secundario text-center">
          Haz clic en la foto para cambiarla
        </div>
      </div>

      <!-- Formulario de información -->
      <div class="space-y-4">
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-texto-principal mb-2">Nombre Completo</label>
          <BaseInput
            v-model="formData.nombre"
            type="text"
            placeholder="Tu nombre completo"
            :disabled="!isEditing"
          />
        </div>

        <!-- Email (Solo lectura) -->
        <div>
          <label class="block text-sm font-medium text-texto-principal mb-2">Email</label>
          <BaseInput
            :model-value="user?.email"
            type="email"
            disabled
            class="bg-crema/30"
          />
          <div class="text-xs text-texto-secundario mt-1">El email no puede ser modificado</div>
        </div>

        <!-- RUT (Solo lectura) -->
        <div>
          <label class="block text-sm font-medium text-texto-principal mb-2">RUT</label>
          <BaseInput
            :model-value="user?.rut"
            type="text"
            disabled
            class="bg-crema/30"
          />
          <div class="text-xs text-texto-secundario mt-1">El RUT no puede ser modificado</div>
        </div>

        <!-- Teléfono -->
        <div>
          <label class="block text-sm font-medium text-texto-principal mb-2">Teléfono</label>
          <BaseInput
            v-model="formData.telefono"
            type="tel"
            placeholder="+56 9 XXXX XXXX"
            :disabled="!isEditing"
          />
        </div>

        <!-- Fecha de registro (Solo lectura) -->
        <div>
          <label class="block text-sm font-medium text-texto-principal mb-2">Miembro desde</label>
          <BaseInput
            :model-value="formatDate(user?.createdAt)"
            type="text"
            disabled
            class="bg-crema/30"
          />
        </div>
      </div>

      <!-- Mensaje de error -->
      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- Botones de acción -->
      <div class="flex gap-3">
        <BaseButton
          v-if="!isEditing"
          @click="startEditing"
          class="flex-1"
          variant="outline"
        >
          Editar Información
        </BaseButton>

        <template v-else>
          <BaseButton
            @click="cancelEditing"
            variant="ghost"
            class="flex-1"
          >
            Cancelar
          </BaseButton>
          <BaseButton
            @click="saveChanges"
            :disabled="loading"
            class="flex-1"
          >
            {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
          </BaseButton>
        </template>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { usePerfilStore } from '@/stores/perfilStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const authStore = useAuthStore()
const perfilStore = usePerfilStore()

const user = computed(() => authStore.user)
const userInitials = computed(() => authStore.userInitials)
const loading = computed(() => perfilStore.loading)
const error = computed(() => perfilStore.error)

const isEditing = ref(false)
const avatarUrl = ref<string | null>(null)

const formData = ref({
  nombre: user.value?.nombre || '',
  telefono: user.value?.telefono || '',
})

// Actualizar formData cuando cambie el usuario
watch(user, (newUser) => {
  if (newUser && !isEditing.value) {
    formData.value = {
      nombre: newUser.nombre,
      telefono: newUser.telefono,
    }
  }
}, { immediate: true })

const startEditing = () => {
  isEditing.value = true
  perfilStore.clearError()
}

const cancelEditing = () => {
  isEditing.value = false
  formData.value = {
    nombre: user.value?.nombre || '',
    telefono: user.value?.telefono || '',
  }
  perfilStore.clearError()
}

const saveChanges = async () => {
  if (!formData.value.nombre.trim()) {
    return
  }

  const success = await perfilStore.updateProfile({
    nombre: formData.value.nombre,
    telefono: formData.value.telefono,
    avatarUrl: avatarUrl.value || undefined,
  })

  if (success) {
    isEditing.value = false
  }
}

const handleAvatarChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validar tamaño (máximo 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('La imagen debe pesar menos de 2MB')
    return
  }

  // Validar tipo
  if (!file.type.startsWith('image/')) {
    alert('Solo se permiten archivos de imagen')
    return
  }

  // Preview local
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  // Subir al servidor
  const uploadedUrl = await perfilStore.uploadAvatar(file)
  if (uploadedUrl) {
    avatarUrl.value = uploadedUrl
  }
}

const formatDate = (date: Date | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

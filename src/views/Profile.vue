<template>
  <div class="min-h-screen bg-gradient-to-b from-crema to-white">
    <!-- Header -->
    <header class="bg-blanco-puro/80 backdrop-blur-md shadow-md border-b border-bordes sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="flex items-center">
              <img
                src="/src/assets/logo.png"
                alt="Quórum Luxe"
                class="h-24 w-auto"
              />
            <h1 class="text-2xl font-bold bg-gradient-to-r from-dorado to-dorado-oscuro bg-clip-text text-transparent">
              Quórum Luxe
            </h1>
            </router-link>
          </div>

          <div class="flex items-center space-x-4">
            <div v-if="isAuthenticated" class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-dorado to-dorado-oscuro rounded-full flex items-center justify-center text-blanco-puro text-sm font-bold shadow-lg">
                {{ userInitials }}
              </div>
              <span class="text-sm font-medium text-texto-principal hidden sm:block">{{ user?.nombre }}</span>
              <BaseButton variant="ghost" size="sm" @click="handleLogout">
                Cerrar Sesión
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Título de la página -->
      <div class="mb-8">
        <div class="flex items-center space-x-3 mb-2">
          <router-link
            to="/"
            class="text-texto-secundario hover:text-dorado transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </router-link>
          <h1 class="text-3xl font-bold text-texto-principal">Mi Perfil</h1>
        </div>
        <p class="text-texto-secundario ml-8">Gestiona tu información personal y preferencias</p>
      </div>

      <!-- Botón de prueba (solo desarrollo) -->
      <div class="flex justify-center mb-6">
        <BaseButton
          variant="ghost"
          size="sm"
          @click="cargarDatosPrueba"
          class="text-xs opacity-50 hover:opacity-100 transition-opacity"
        >
          Cargar Datos de Prueba
        </BaseButton>
      </div>

      <div class="space-y-8">
        <!-- Estadísticas -->
        <ProfileStats />

        <!-- Layout de dos columnas -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Columna izquierda: Información personal, seguridad y notificaciones -->
          <div class="lg:col-span-1 space-y-6">
            <ProfileInfo />
            <ProfileSecurity />
            <ProfileNotifications />
          </div>

          <!-- Columna derecha: Historial -->
          <div class="lg:col-span-2">
            <ProfileHistory />
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-blanco-puro border-t border-bordes mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Información de la Empresa -->
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <img
                src="/src/assets/logo.png"
                alt="Quórum Luxe"
                class="h-10 w-auto"
              />
              <h3 class="text-lg font-bold bg-gradient-to-r from-dorado-oscuro to-dorado bg-clip-text text-transparent">Quórum Luxe ltda.</h3>
            </div>
            <p class="text-texto-secundario text-sm leading-relaxed">
              Plataforma de sorteos transparentes y seguros.
              Participa en sorteos con total confianza y transparencia.
            </p>
            <div class="text-xs text-texto-secundario">
              © 2025 Quórum Luxe. Todos los derechos reservados.
            </div>
          </div>

          <!-- Información de Contacto -->
          <div class="space-y-4">
            <h4 class="text-lg font-bold text-texto-principal">Contacto</h4>
            <div class="space-y-3">
              <!-- WhatsApp -->
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                  <img
                    src="/src/assets/whatsapp-icon.svg"
                    alt="WhatsApp"
                    class="w-5 h-5"
                  />
                </div>
                <div>
                  <a
                    href="https://wa.me/56990909063"
                    target="_blank"
                    class="text-texto-secundario hover:text-dorado transition-colors duration-200 text-sm font-medium"
                  >
                    +56 9 9090 9063
                  </a>
                  <div class="text-xs text-texto-secundario">WhatsApp</div>
                </div>
              </div>

              <!-- Email -->
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-dorado to-dorado-oscuro rounded-full flex items-center justify-center shadow-md">
                  <img
                    src="/src/assets/gmail-icon.svg"
                    alt="Email"
                    class="w-5 h-5"
                  />
                </div>
                <div>
                  <a
                    href="mailto:contacto@quorumluxe.cl"
                    class="text-texto-secundario hover:text-dorado transition-colors duration-200 text-sm font-medium"
                  >
                    contacto@quorumluxe.cl
                  </a>
                  <div class="text-xs text-texto-secundario">Email</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ubicación y Horarios -->
          <div class="space-y-4">
            <h4 class="text-lg font-bold text-texto-principal">Ubicación</h4>
            <div class="space-y-3">
              <!-- Dirección -->
              <div class="flex items-start space-x-3">
                  <img
                    src="/src/assets/map-icon.svg"
                    alt="Ubicación"
                    class="w-10 h-10"
                  />
                <div>
                  <div class="text-texto-secundario text-sm font-medium">
                    Pedro Mira 1028<br>
                    Santiago, Chile
                  </div>
                  <div class="text-xs text-texto-secundario mt-1">Oficina Principal</div>
                </div>
              </div>

              <!-- Horarios -->
              <div class="flex items-start space-x-3">
                <div class="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                  <img
                    src="/src/assets/clock-icon.svg"
                    alt="Horario"
                    class="w-6 h-6"
                  />
                </div>
                <div>
                  <div class="text-texto-secundario text-sm font-medium">
                    Lunes - Viernes: 9:00 - 18:00<br>
                    Sábados: 10:00 - 14:00
                  </div>
                  <div class="text-xs text-texto-secundario mt-1">Horarios de Atención</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Línea divisoria y información adicional -->
        <div class="border-t border-bordes mt-8 pt-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
            <div class="text-xs text-texto-secundario">
              <p class="font-medium">Licencia de Juegos N° 12345 - SERNAC</p>
              <p>Auditoría externa disponible bajo solicitud</p>
            </div>
            <div class="text-xs text-texto-secundario md:text-right">
              <p>Desarrollado con base en Chile</p>
              <p class="font-medium">Versión 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { usePerfilStore } from '@/stores/perfilStore'
import ProfileStats from '@/components/ProfileStats.vue'
import ProfileInfo from '@/components/ProfileInfo.vue'
import ProfileSecurity from '@/components/ProfileSecurity.vue'
import ProfileNotifications from '@/components/ProfileNotifications.vue'
import ProfileHistory from '@/components/ProfileHistory.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const perfilStore = usePerfilStore()

const isAuthenticated = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)
const userInitials = computed(() => authStore.userInitials)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const cargarDatosPrueba = () => {
  perfilStore.cargarDatosDePrueba()
}

onMounted(async () => {
  // Redirigir a home si no está autenticado
  if (!isAuthenticated.value) {
    router.push('/')
    return
  }

  // Cargar datos del perfil
  await Promise.all([
    perfilStore.fetchUserStats(),
    perfilStore.fetchHistorialCompras(),
    perfilStore.fetchNotificationPreferences(),
  ])
})
</script>

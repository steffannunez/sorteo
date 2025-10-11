<template>
  <div class="min-h-screen bg-gradient-to-b from-crema to-white">
    <!-- Header -->
    <header class="bg-blanco-puro/80 backdrop-blur-md shadow-md border-b border-bordes sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center">
            <img
              src="/src/assets/logo1.png"
              alt="Quórum Luxe"
              class="h-24 w-auto"
            />
          </div>

          <div class="flex items-center space-x-4">
            <div v-if="isAuthenticated" class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-dorado to-dorado-oscuro rounded-full flex items-center justify-center text-blanco-puro text-sm font-bold shadow-lg">
                {{ userInitials }}
              </div>
              <span class="text-sm font-medium text-texto-principal">{{ user?.nombre }}</span>
              <BaseButton variant="ghost" size="sm" @click="logout">
                Cerrar Sesión
              </BaseButton>
            </div>
            <div v-else>
              <BaseButton @click="showLogin = true">
                Iniciar Sesión
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-8">
        <!-- Countdown Timer -->
        <div class="flex justify-center">
          <CountdownTimer />
        </div>

        <!-- Monto Acumulado -->
        <div class="max-w-md mx-auto">
          <MontoAcumulado />
        </div>

        <!-- Compra de Números -->
        <div v-if="isAuthenticated" class="max-w-md mx-auto">
          <CompraForm />
        </div>

        <!-- Mensaje para usuarios no autenticados -->
        <div v-else class="max-w-md mx-auto">
          <BaseCard class="text-center" variant="elevated">
            <div class="space-y-6">
              <div class="w-16 h-16 mx-auto bg-gradient-to-br from-dorado to-dorado-oscuro rounded-full flex items-center justify-center shadow-lg">
                <svg class="w-8 h-8 text-blanco-puro" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-texto-principal">
                Inicia sesión para comprar números
              </h3>
              <p class="text-texto-secundario">
                Necesitas estar registrado para participar en el sorteo
              </p>
              <BaseButton @click="showLogin = true" class="w-full" size="lg">
                Iniciar Sesión
              </BaseButton>
            </div>
          </BaseCard>
        </div>

        <!-- Secciones laterales -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <!-- Últimos Ganadores (Izquierda) -->
          <div class="space-y-4">
            <BaseCard variant="elevated">
              <template #header>
                <h3 class="text-xl font-bold text-texto-principal text-center">
                  Últimos Ganadores
                </h3>
              </template>

              <div class="space-y-3">
                <div v-for="ganador in ultimosGanadores" :key="ganador.id"
                     class="flex justify-between items-center p-4 bg-gradient-to-r from-dorado-claro/10 to-transparent rounded-xl border border-bordes hover:border-dorado-claro transition-all duration-300 hover:shadow-md">
                  <div class="flex-1">
                    <div class="font-semibold text-texto-principal">{{ ganador.nombre }}</div>
                    <div class="text-sm text-texto-secundario">{{ ganador.fecha }}</div>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-lg bg-gradient-to-r from-dorado-oscuro to-dorado bg-clip-text text-transparent">{{ ganador.monto }}</div>
                    <div class="text-xs text-texto-secundario font-medium">Ganado</div>
                  </div>
                </div>

                <div v-if="ultimosGanadores.length === 0" class="text-center py-12">
                  <div class="text-texto-secundario">
                    <div class="text-5xl mb-3">🎲</div>
                    <p class="font-medium text-lg">No hay ganadores anteriores aún</p>
                    <p class="text-sm mt-1">¡Sé el primero en ganar!</p>
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- Información de Distribución (Derecha) -->
          <div class="space-y-4">
            <BaseCard variant="elevated">
              <template #header>
                <h3 class="text-xl font-bold text-texto-principal text-center">
                  Distribución de Fondos
                </h3>
              </template>

              <div class="space-y-4">
                <div class="text-center mb-6">
                  <p class="text-texto-secundario">Así distribuimos los fondos recaudados con transparencia</p>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center justify-between p-5 bg-gradient-to-r from-dorado/10 to-transparent rounded-xl border border-dorado-claro/50 hover:border-dorado transition-all duration-300 hover:shadow-md">
                    <div class="flex items-center space-x-4">
                      <div class="w-14 h-14 bg-gradient-to-br from-dorado to-dorado-oscuro rounded-full flex items-center justify-center text-blanco-puro font-bold text-lg shadow-lg">80%</div>
                      <div>
                        <div class="font-bold text-texto-principal">Para el Pozo</div>
                        <div class="text-sm text-texto-secundario">80% de lo recaudado va directamente al pozo del sorteo.</div>
                      </div>
                    </div>
                    <div class="text-2xl">🎯</div>
                  </div>

                  <div class="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-transparent rounded-xl border border-green-200/50 hover:border-green-300 transition-all duration-300 hover:shadow-md">
                    <div class="flex items-center space-x-4">
                      <div class="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">10%</div>
                      <div>
                        <div class="font-bold text-texto-principal">Beneficencia y Caridad</div>
                        <div class="text-sm text-texto-secundario">Ayudamos a causas sociales como Bomberos y Teletón</div>
                      </div>
                    </div>
                    <div class="text-2xl">❤️</div>
                  </div>

                  <div class="flex items-center justify-between p-5 bg-gradient-to-r from-bordes to-transparent rounded-xl border border-bordes hover:border-texto-secundario/30 transition-all duration-300 hover:shadow-md">
                    <div class="flex items-center space-x-4">
                      <div class="w-14 h-14 bg-gradient-to-br from-texto-secundario to-texto-principal rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">10%</div>
                      <div>
                        <div class="font-bold text-texto-principal">Plataforma</div>
                        <div class="text-sm text-texto-secundario">Mantenimiento y operación de la plataforma.</div>
                      </div>
                    </div>
                    <div class="text-2xl">⚙️</div>
                  </div>
                </div>

                <div class="mt-6 p-5 bg-gradient-to-r from-dorado-claro/20 to-transparent rounded-xl border border-dorado-claro">
                  <div class="text-center">
                    <div class="text-sm text-texto-secundario mb-1 font-medium">Tu confianza es importante</div>
                    <div class="font-bold text-texto-principal">Auditoría externa disponible</div>
                  </div>
                </div>
              </div>
            </BaseCard>
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
                src="/src/assets/logo1.png"
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
              <p>Desarrollado con base en Chile ❤️</p>
              <p class="font-medium">Versión 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- Login Modal -->
    <div v-if="showLogin" class="fixed inset-0 bg-texto-principal/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-blanco-puro rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-bordes">
        <LoginForm />
        <div class="p-6 border-t border-bordes">
          <BaseButton variant="ghost" class="w-full" @click="showLogin = false">
            Cerrar
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useSorteoStore } from '@/stores/sorteoStore'
import CountdownTimer from '@/components/CountdownTimer.vue'
import MontoAcumulado from '@/components/MontoAcumulado.vue'
import CompraForm from '@/components/CompraForm.vue'
import LoginForm from '@/components/LoginForm.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'

const authStore = useAuthStore()
const sorteoStore = useSorteoStore()

const showLogin = ref(false)

const isAuthenticated = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)
const userInitials = computed(() => authStore.userInitials)

// Datos de los últimos ganadores
const ultimosGanadores = ref([
  {
    id: 1,
    nombre: 'María González',
    monto: '$22.500.000',
    fecha: '15 de Diciembre, 2024'
  },
  {
    id: 2,
    nombre: 'Carlos Rodríguez',
    monto: '$17.800.000',
    fecha: '1 de Diciembre, 2024'
  },
  {
    id: 3,
    nombre: 'Ana Martínez',
    monto: '$35.200.000',
    fecha: '15 de Noviembre, 2024'
  }
])

const logout = async () => {
  await authStore.logout()
}

onMounted(async () => {
  // Verificar autenticación al cargar
  await authStore.checkAuth()
  
  // Cargar datos del sorteo
  await sorteoStore.fetchSorteoActual()
  await sorteoStore.fetchMontoAcumulado()
  await sorteoStore.fetchNumerosDisponibles()
  await sorteoStore.fetchNumerosVendidos()
})
</script>

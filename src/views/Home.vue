<template>
  <div class="min-h-screen bg-gris-oscuro">
    <!-- Header -->
    <header class="bg-gris-oscuro shadow-lg border-b border-gris-medio">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <img 
              src="/src/assets/logo1.png" 
              alt="Quórum Luxe" 
              class="h-20 w-auto"
            />
          </div>
          
          <div class="flex items-center space-x-4">
            <div v-if="isAuthenticated" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-dorado rounded-full flex items-center justify-center text-gris-oscuro text-sm font-semibold">
                {{ userInitials }}
              </div>
              <span class="text-sm text-blanco-calido">{{ user?.nombre }}</span>
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
          <BaseCard class="text-center">
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gris-medio">
                Inicia sesión para comprar números
              </h3>
              <p class="text-gris-medio">
                Necesitas estar registrado para participar en el sorteo
              </p>
              <BaseButton @click="showLogin = true" class="w-full">
                Iniciar Sesión
              </BaseButton>
            </div>
          </BaseCard>
        </div>

        <!-- Secciones laterales -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <!-- Últimos Ganadores (Izquierda) -->
          <div class="space-y-4">
            <BaseCard>
              <template #header>
                <h3 class="text-lg font-semibold text-gris-oscuro text-center">
                  Últimos Ganadores
                </h3>
              </template>
              
              <div class="space-y-3">
                <div v-for="ganador in ultimosGanadores" :key="ganador.id" 
                     class="flex justify-between items-center p-3 bg-gris-claro rounded-lg border border-gris-medio">
                  <div class="flex-1">
                    <div class="font-medium text-gris-oscuro">{{ ganador.nombre }}</div>
                    <div class="text-sm text-gris-medio">{{ ganador.fecha }}</div>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-dorado">{{ ganador.monto }}</div>
                    <div class="text-xs text-gris-medio">Ganado</div>
                  </div>
                </div>
                
                <div v-if="ultimosGanadores.length === 0" class="text-center py-8">
                  <div class="text-gris-medio">
                    <div class="text-4xl mb-2">🎲</div>
                    <p>No hay ganadores anteriores aún</p>
                    <p class="text-sm">¡Sé el primero en ganar!</p>
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- Información de Distribución (Derecha) -->
          <div class="space-y-4">
            <BaseCard>
              <template #header>
                <h3 class="text-lg font-semibold text-gris-oscuro text-center">
                  Distribución de Fondos
                </h3>
              </template>
              
              <div class="space-y-4">
                <div class="text-center mb-6">
                  <div class="text-3xl font-bold text-dorado mb-2">Distribución de Fondos</div>
                  <p class="text-gris-medio">Así distribuimos los fondos recaudados</p>
                </div>
                
                <div class="space-y-3">
                  <div class="flex items-center justify-between p-4 bg-dorado/10 rounded-lg border border-dorado/20">
                    <div class="flex items-center space-x-3">
                      <div class="w-11 h-11 bg-dorado rounded-full flex items-center justify-center text-gris-oscuro font-bold">80%</div>
                      <div>
                        <div class="font-semibold text-gris-oscuro">Para el Pozo</div>
                        <div class="text-sm text-gris-medio">80% de lo recaudado va directamente al pozo, para el siguiente sorteo.</div>
                      </div>
                    </div>
                    <div class="text-dorado font-bold">🎯</div>
                  </div>
                  
                  <div class="flex items-center justify-between p-4 bg-green-100 rounded-lg border border-green-200">
                    <div class="flex items-center space-x-3">
                      <div class="w-12 h-11 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">10%</div>
                      <div>
                        <div class="font-semibold text-gris-oscuro">Beneficencia y Caridad</div>
                        <div class="text-sm text-gris-medio">Ayudamos a causas sociales y caritativas, como Bomberos de chile y Teletón</div>
                      </div>
                    </div>
                    <div class="text-green-500 font-bold">❤️</div>
                  </div>
                  
                  <div class="flex items-center justify-between p-4 bg-gris-claro rounded-lg border border-gris-medio">
                    <div class="flex items-center space-x-3">
                      <div class="w-11 h-11 bg-gris-medio rounded-full flex items-center justify-center text-white font-bold">10%</div>
                      <div>
                        <div class="font-semibold text-gris-oscuro">Plataforma</div>
                        <div class="text-sm text-gris-medio">Mantenimiento y operación de la plataforma.</div>
                      </div>
                    </div>
                    <div class="text-gris-medio font-bold">⚙️</div>
                  </div>
                </div>
                
                <div class="mt-6 p-4 bg-dorado/5 rounded-lg border border-dorado/20">
                  <div class="text-center">
                    <div class="text-sm text-gris-medio mb-1">Tu confianza es importante</div>
                    <div class="font-semibold text-gris-oscuro">Auditoría externa disponible</div>
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gris-oscuro border-t border-gris-medio mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Información de la Empresa -->
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <img 
                src="/src/assets/logo1.png" 
                alt="Quórum Luxe" 
                class="h-8 w-auto"
              />
              <h3 class="text-l font-bold text-dorado">Quórum Luxe ltda.</h3>
            </div>
            <p class="text-gris-medio text-sm leading-relaxed">
              Plataforma de sorteos transparentes y seguros. 
              Participa en sorteos con total confianza y transparencia.
            </p>
            <div class="text-xs text-gris-medio">
              © 2025 Quórum Luxe. Todos los derechos reservados.
            </div>
          </div>

          <!-- Información de Contacto -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-blanco-calido">Contacto</h4>
            <div class="space-y-3">
              <!-- WhatsApp -->
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <img 
                    src="/src/assets/whatsapp-icon.svg" 
                    alt="WhatsApp" 
                    class="w-4 h-4"
                  />
                </div>
                <div>
                  <a 
                    href="https://wa.me/56990909063" 
                    target="_blank"
                    class="text-gris-medio hover:text-dorado transition-colors duration-200 text-sm"
                  >
                    +56 9 9090 9063
                  </a>
                  <div class="text-xs text-gris-medio">WhatsApp</div>
                </div>
              </div>

              <!-- Email -->
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-dorado rounded-full flex items-center justify-center">
                  <img 
                    src="/src/assets/gmail-icon.svg" 
                    alt="Email" 
                    class="w-4 h-4"
                  />
                </div>
                <div>
                  <a 
                    href="mailto:contacto@quorumluxe.cl" 
                    class="text-gris-medio hover:text-dorado transition-colors duration-200 text-sm"
                  >
                    contacto@quorumluxe.cl
                  </a>
                  <div class="text-xs text-gris-medio">Email</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ubicación y Horarios -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-blanco-calido">Ubicación</h4>
            <div class="space-y-3">
              <!-- Dirección -->
              <div class="flex items-start space-x-3">
                  <img 
                    src="/src/assets/map-icon.svg" 
                    alt="WhatsApp" 
                    class="w-8 h-8"
                  />
                <div>
                  
                  <div class="text-gris-medio text-sm">
                    Pedro Mira 1028<br>
                    Santiago, Chile
                  </div>
                  <div class="text-xs text-gris-medio mt-1">Oficina Principal</div>
                </div>
              </div>

              <!-- Horarios -->
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <img 
                    src="/src/assets/clock-icon.svg" 
                    alt="clock" 
                    class="w-7 h-7"
                  />
                </div>
                <div>
                  <div class="text-gris-medio text-sm">
                    Lunes - Viernes: 9:00 - 18:00<br>
                    Sábados: 10:00 - 14:00
                  </div>
                  <div class="text-xs text-gris-medio mt-1">Horarios de Atención</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Línea divisoria y información adicional -->
        <div class="border-t border-gris-medio mt-8 pt-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
            <div class="text-xs text-gris-medio">
              <p>Licencia de Juegos N° 12345 - SERNAC</p>
              <p>Auditoría externa disponible bajo solicitud</p>
            </div>
            <div class="text-xs text-gris-medio md:text-right">
              <p>Desarrollado con base en Chile ❤️</p>
              <p>Versión 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- Login Modal -->
    <div v-if="showLogin" class="fixed inset-0 bg-gris-oscuro bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div class="bg-gris-claro rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <LoginForm />
        <div class="p-4 border-t border-gris-medio">
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

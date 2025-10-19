<template>
  <div class="min-h-screen bg-gradient-to-b from-crema to-white">
    <!-- Header -->
    <header class="bg-blanco-puro/80 backdrop-blur-md shadow-md border-b border-bordes sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center">
            <img
              src="/src/assets/logo.png"
              alt="MyRank Logo"
              class="h-24 w-auto"
            />
            <h1 class="text-2xl font-bold bg-gradient-to-r from-dorado to-dorado-oscuro bg-clip-text text-transparent">
              MyRank
            </h1>
          </div>

          <div class="flex items-center space-x-4">
            <div v-if="isAuthenticated" class="flex items-center space-x-3">
              <router-link
                to="/perfil"
                class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-crema/50 transition-all duration-200 group"
              >
                <div class="w-10 h-10 bg-gradient-to-br from-dorado to-dorado-oscuro rounded-full flex items-center justify-center text-blanco-puro text-sm font-bold shadow-lg group-hover:shadow-xl transition-shadow">
                  {{ userInitials }}
                </div>
                <span class="text-sm font-medium text-texto-principal hidden sm:block">{{ user?.nombre }}</span>
              </router-link>
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
      <!-- Layout con 3 columnas: Top 10 | Área de Juegos | Compra de Tickets -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Sidebar Izquierdo: Top 10 Jugadores -->
        <aside class="lg:col-span-3">
          <div class="sticky top-24">
            <TopPlayersRanking />
          </div>
        </aside>

        <!-- Contenido Central: Área de Juegos -->
        <section class="lg:col-span-6 space-y-6">
          <!-- Botón de prueba (solo desarrollo) -->
          <div class="flex justify-center">
            <BaseButton
              variant="ghost"
              size="sm"
              @click="cargarDatosPrueba"
              class="text-xs opacity-50 hover:opacity-100 transition-opacity"
            >
              Cargar Datos de Prueba
            </BaseButton>
          </div>

          <!-- Mensaje de Bienvenida -->
          <BaseCard variant="elevated" class="text-center">
            <div class="space-y-4">
              <div class="text-6xl">🎮</div>
              <h2 class="text-3xl font-bold bg-gradient-to-r from-dorado-oscuro to-dorado bg-clip-text text-transparent">
                ¡Juega y Gana Premios!
              </h2>
              <p class="text-texto-secundario max-w-md mx-auto">
                Demuestra tu habilidad en nuestros juegos diarios, acumula puntos y participa en sorteos mensuales
              </p>
            </div>
          </BaseCard>

          <!-- Juegos Disponibles (Placeholder) -->
          <BaseCard variant="elevated">
            <template #header>
              <h3 class="text-xl font-bold text-texto-principal">
                Juegos del Día
              </h3>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Wordle -->
              <router-link
                to="/juegos/wordle"
                class="group p-6 bg-gradient-to-br from-purple-50 to-transparent rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-lg cursor-pointer block"
              >
                
                <img src="../assets/letters-svgrepo-com.svg" alt="letters"  class="w-12 h-12 mb-3 ml-3 group-hover:scale-110 transition-transform"/>
                <h4 class="font-bold text-texto-principal mb-2">Palabra del Día</h4>
                <p class="text-sm text-texto-secundario mb-3">Adivina la palabra secreta</p>
                <div class="inline-flex items-center text-xs font-medium text-purple-600">
                  ¡Jugar ahora!
                  <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </router-link>

              <!-- Sudoku -->
              <router-link
                to="/juegos/sudoku"
                class="group p-6 bg-gradient-to-br from-blue-50 to-transparent rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg cursor-pointer block"
              >
                <img src="../assets/sudoku-svgrepo-com.svg" alt="sudoku"  class="w-12 h-12 mb-3 ml-3 group-hover:scale-110 transition-transform"/>
                <h4 class="font-bold text-texto-principal mb-2">Sudoku</h4>
                <p class="text-sm text-texto-secundario mb-3">Completa el puzzle numérico</p>
                <div class="inline-flex items-center text-xs font-medium text-blue-600">
                  ¡Jugar ahora!
                  <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </router-link>

              <!-- Trivia -->
              <router-link
                to="/juegos/trivia"
                class="group p-6 bg-gradient-to-br from-indigo-50 to-transparent rounded-xl border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300 hover:shadow-lg cursor-pointer block"
              >
                <div class="text-5xl mb-3 group-hover:scale-110 transition-transform">🧠</div>
                <h4 class="font-bold text-texto-principal mb-2">Trivia Challenge</h4>
                <p class="text-sm text-texto-secundario mb-3">Demuestra tu conocimiento</p>
                <div class="inline-flex items-center text-xs font-medium text-indigo-600">
                  ¡Jugar ahora!
                  <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </router-link>

              <!-- Ahorcado -->
              <router-link
                to="/juegos/ahorcado"
                class="group p-6 bg-gradient-to-br from-amber-50 to-transparent rounded-xl border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 hover:shadow-lg cursor-pointer block"
              >
                <img src="../assets/rope-svgrepo-com.svg" alt="ahorcado"  class="w-12 h-12 mb-3 ml-3 group-hover:scale-110 transition-transform"/>
                <h4 class="font-bold text-texto-principal mb-2">Ahorcado</h4>
                <p class="text-sm text-texto-secundario mb-3">Letra por letra</p>
                <div class="inline-flex items-center text-xs font-medium text-amber-600">
                  ¡Jugar ahora!
                  <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </router-link>
            </div>
          </BaseCard>

          <!-- Mensaje para usuarios no autenticados -->
          <div v-if="!isAuthenticated">
            <BaseCard class="text-center" variant="elevated">
              <div class="space-y-6">
                <div class="w-16 h-16 mx-auto bg-gradient-to-br from-dorado to-dorado-oscuro rounded-full flex items-center justify-center shadow-lg">
                  <svg class="w-8 h-8 text-blanco-puro" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-texto-principal">
                  Inicia sesión para jugar
                </h3>
                <p class="text-texto-secundario">
                  Necesitas estar registrado para jugar y participar en los sorteos
                </p>
                <BaseButton @click="showLogin = true" class="w-full" size="lg">
                  Iniciar Sesión
                </BaseButton>
              </div>
            </BaseCard>
          </div>

          <!-- Información del Sorteo Mensual -->
          <BaseCard variant="elevated">
            <template #header>
              <h3 class="text-xl font-bold text-texto-principal text-center">
                Sorteo Mensual
              </h3>
            </template>

            <div class="space-y-4">
              <div class="text-center">
                <div class="text-sm text-texto-secundario mb-2">Próximo Sorteo</div>
                <div class="text-3xl font-bold bg-gradient-to-r from-dorado-oscuro to-dorado bg-clip-text text-transparent">
                  31 de Enero, 2025
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gradient-to-br from-dorado-claro/20 to-transparent rounded-lg p-4 border border-dorado-claro text-center">
                  <div class="text-2xl font-bold text-texto-principal">500</div>
                  <div class="text-xs text-texto-secundario">Participantes</div>
                </div>
                <div class="bg-gradient-to-br from-dorado-claro/20 to-transparent rounded-lg p-4 border border-dorado-claro text-center">
                  <div class="text-2xl font-bold text-texto-principal">$5M</div>
                  <div class="text-xs text-texto-secundario">Premio Acumulado</div>
                </div>
              </div>

              <p class="text-sm text-texto-secundario text-center">
                Juega y llega al top 3 para ganar increíbles premios.
              </p>
            </div>
          </BaseCard>
        </section>

        <!-- Sidebar Derecho: Compra de Tickets -->
        <aside class="lg:col-span-3">
          <div class="sticky top-24 space-y-6">
            <TicketPurchase v-if="isAuthenticated" />

            <!-- Información adicional -->
            <BaseCard variant="elevated" class="text-center">
              <div class="space-y-3">
                <div class="text-3xl">ℹ️</div>
                <h4 class="font-bold text-texto-principal">¿Cómo funciona?</h4>
                <ul class="text-xs text-texto-secundario space-y-2 text-left">
                  <li class="flex items-start space-x-2">
                    <span class="text-dorado">•</span>
                    <span>1 intento gratis por juego al día</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-dorado">•</span>
                    <span>Compra tickets para más intentos</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-dorado">•</span>
                    <span>Acumula puntos con tu habilidad</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-dorado">•</span>
                    <span>Participa en sorteos mensuales</span>
                  </li>
                </ul>
              </div>
            </BaseCard>
          </div>
        </aside>
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
                alt="MyRank Logo"
                class="h-10 w-auto"
              />
              <h3 class="text-lg font-bold bg-gradient-to-r from-dorado-oscuro to-dorado bg-clip-text text-transparent">MyRank ltda.</h3>
            </div>
            <p class="text-texto-secundario text-sm leading-relaxed">
              Plataforma de sorteos transparentes y seguros.
              Participa en sorteos con total confianza y transparencia.
            </p>
            <div class="text-xs text-texto-secundario">
              © 2025 MyRank. Todos los derechos reservados.
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
                    href="mailto:contacto@myrank.cl"
                    class="text-texto-secundario hover:text-dorado transition-colors duration-200 text-sm font-medium"
                  >
                    contacto@myrank.cl
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
import { useTicketStore } from '@/stores/ticketStore'
import { useRankingStore } from '@/stores/rankingStore'
import TopPlayersRanking from '@/components/TopPlayersRanking.vue'
import TicketPurchase from '@/components/TicketPurchase.vue'
import LoginForm from '@/components/LoginForm.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'

const authStore = useAuthStore()
const ticketStore = useTicketStore()
const rankingStore = useRankingStore()

const showLogin = ref(false)

const isAuthenticated = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)
const userInitials = computed(() => authStore.userInitials)

const logout = async () => {
  await authStore.logout()
}

const cargarDatosPrueba = () => {
  if (user.value) {
    ticketStore.cargarDatosDePrueba(user.value.id)
  }
  rankingStore.cargarDatosDePrueba()
}

onMounted(async () => {
  // Verificar autenticación al cargar
  await authStore.checkAuth()

  // Cargar datos de tickets si está autenticado
  if (user.value) {
    await ticketStore.fetchUserTickets(user.value.id)
  }

  // Cargar ranking
  await rankingStore.fetchTopPlayers('mensual')
})
</script>

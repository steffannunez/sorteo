<template>
  <div class="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
    <!-- Header -->
    <header class="bg-blanco-puro/80 backdrop-blur-md shadow-md border-b border-bordes sticky top-0 z-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <button
            @click="volverHome"
            class="flex items-center space-x-2 text-texto-secundario hover:text-texto-principal transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span class="hidden sm:inline">Volver</span>
          </button>

          <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Trivia Challenge
          </h1>

          <div v-if="isAuthenticated" class="flex items-center space-x-2">
            <div class="flex items-center space-x-2 px-3 py-1 rounded-lg bg-indigo-50">
              <span class="text-2xl">🎫</span>
              <div>
                <div class="text-xs text-texto-secundario">Tickets</div>
                <div class="font-bold text-indigo-600">{{ ticketsDisponibles }}</div>
              </div>
            </div>
          </div>
          <div v-else>
            <BaseButton @click="showLogin = true" size="sm">
              Iniciar Sesión
            </BaseButton>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TriviaGame
        @volver="volverHome"
        @iniciar="iniciarJuego"
      />
    </main>

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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useTriviaStore } from '@/stores/triviaStore'
import { useTicketStore } from '@/stores/ticketStore'
import TriviaGame from '@/components/games/TriviaGame.vue'
import LoginForm from '@/components/LoginForm.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const triviaStore = useTriviaStore()
const ticketStore = useTicketStore()

const showLogin = ref(false)

const isAuthenticated = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)
const ticketsDisponibles = computed(() => ticketStore.ticketsDisponibles)

const volverHome = () => {
  triviaStore.reiniciarJuego()
  router.push('/')
}

const iniciarJuego = async () => {
  if (!user.value) {
    showLogin.value = true
    return
  }

  const exito = await triviaStore.iniciarJuego(user.value.id)

  if (!exito && triviaStore.yaJugoHoy) {
    // Ya jugó hoy, verificar si tiene tickets
    if (ticketStore.tieneTicketsDisponibles) {
      // TODO: Implementar lógica de consumo de tickets
      console.log('Usar ticket para jugar de nuevo')
    }
  }
}

onMounted(async () => {
  await authStore.checkAuth()
  if (user.value) {
    await ticketStore.fetchUserTickets(user.value.id)
  }
})
</script>

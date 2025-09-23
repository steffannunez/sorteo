<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-primary-600">SorteoApp</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <div v-if="isAuthenticated" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {{ userInitials }}
              </div>
              <span class="text-sm text-gray-700">{{ user?.nombre }}</span>
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
              <h3 class="text-lg font-semibold text-gray-900">
                Inicia sesión para comprar números
              </h3>
              <p class="text-gray-600">
                Necesitas estar registrado para participar en el sorteo
              </p>
              <BaseButton @click="showLogin = true" class="w-full">
                Iniciar Sesión
              </BaseButton>
            </div>
          </BaseCard>
        </div>
      </div>
    </main>

    <!-- Login Modal -->
    <div v-if="showLogin" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <LoginForm />
        <div class="p-4 border-t">
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

import { defineStore } from 'pinia'
import type {
  User,
  HistorialCompra,
  NotificationPreferences,
  UserStats,
  UpdateProfileRequest,
  ChangePasswordRequest
} from '@/types'
import { PerfilService } from '@/services/PerfilService'
import { ApiClient } from '@/services/ApiClient'
import { useAuthStore } from '@/stores/authStore'

// Store de perfil de usuario (Principio de Responsabilidad Única)
export const usePerfilStore = defineStore('perfil', {
  state: () => ({
    historialCompras: [] as HistorialCompra[],
    notificationPreferences: {
      emailNotifications: true,
      sorteoNotifications: true,
      ganadoresNotifications: true,
      promocionesNotifications: false,
    } as NotificationPreferences,
    userStats: {
      totalGanado: 0,
      sorteosParticipados: 0,
      numerosComprados: 0,
      premiosGanados: 0,
    } as UserStats,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    // Obtener compras por estado
    comprasPagadas: (state) => state.historialCompras.filter(c => c.estadoPago === 'pagado'),
    comprasPendientes: (state) => state.historialCompras.filter(c => c.estadoPago === 'pendiente'),
    comprasRechazadas: (state) => state.historialCompras.filter(c => c.estadoPago === 'rechazado'),

    // Compras ganadoras
    comprasGanadoras: (state) => state.historialCompras.filter(c => c.esGanador),

    // Ordenar historial por fecha (más reciente primero)
    historialOrdenado: (state) => {
      return [...state.historialCompras].sort((a, b) =>
        new Date(b.fechaCompra).getTime() - new Date(a.fechaCompra).getTime()
      )
    },
  },

  actions: {
    async fetchHistorialCompras() {
      const authStore = useAuthStore()
      if (!authStore.user) {
        this.error = 'Usuario no autenticado'
        return
      }

      this.loading = true
      this.error = null

      try {
        const apiClient = new ApiClient()
        const perfilService = new PerfilService(apiClient)

        const response = await perfilService.getHistorialCompras(authStore.user.id)

        if (response.success && response.data) {
          this.historialCompras = response.data
        } else {
          this.error = response.error || 'Error al cargar historial'
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error desconocido'
      } finally {
        this.loading = false
      }
    },

    async fetchUserStats() {
      const authStore = useAuthStore()
      if (!authStore.user) {
        this.error = 'Usuario no autenticado'
        return
      }

      this.loading = true
      this.error = null

      try {
        const apiClient = new ApiClient()
        const perfilService = new PerfilService(apiClient)

        const response = await perfilService.getUserStats(authStore.user.id)

        if (response.success && response.data) {
          this.userStats = response.data
        } else {
          this.error = response.error || 'Error al cargar estadísticas'
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error desconocido'
      } finally {
        this.loading = false
      }
    },

    async fetchNotificationPreferences() {
      const authStore = useAuthStore()
      if (!authStore.user) {
        this.error = 'Usuario no autenticado'
        return
      }

      this.loading = true
      this.error = null

      try {
        const apiClient = new ApiClient()
        const perfilService = new PerfilService(apiClient)

        const response = await perfilService.getNotificationPreferences(authStore.user.id)

        if (response.success && response.data) {
          this.notificationPreferences = response.data
        } else {
          this.error = response.error || 'Error al cargar preferencias'
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error desconocido'
      } finally {
        this.loading = false
      }
    },

    async updateNotificationPreferences(preferences: NotificationPreferences) {
      const authStore = useAuthStore()
      if (!authStore.user) {
        this.error = 'Usuario no autenticado'
        return false
      }

      this.loading = true
      this.error = null

      try {
        const apiClient = new ApiClient()
        const perfilService = new PerfilService(apiClient)

        const response = await perfilService.updateNotificationPreferences(
          authStore.user.id,
          preferences
        )

        if (response.success && response.data) {
          this.notificationPreferences = response.data
          return true
        } else {
          this.error = response.error || 'Error al actualizar preferencias'
          return false
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error desconocido'
        return false
      } finally {
        this.loading = false
      }
    },

    async updateProfile(data: UpdateProfileRequest) {
      const authStore = useAuthStore()
      if (!authStore.user) {
        this.error = 'Usuario no autenticado'
        return false
      }

      this.loading = true
      this.error = null

      try {
        const apiClient = new ApiClient()
        const perfilService = new PerfilService(apiClient)

        const response = await perfilService.updateProfile(authStore.user.id, data)

        if (response.success && response.data) {
          // Actualizar el usuario en el authStore
          authStore.user = response.data
          return true
        } else {
          this.error = response.error || 'Error al actualizar perfil'
          return false
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error desconocido'
        return false
      } finally {
        this.loading = false
      }
    },

    async changePassword(data: ChangePasswordRequest) {
      const authStore = useAuthStore()
      if (!authStore.user) {
        this.error = 'Usuario no autenticado'
        return false
      }

      this.loading = true
      this.error = null

      try {
        const apiClient = new ApiClient()
        const perfilService = new PerfilService(apiClient)

        const response = await perfilService.changePassword(authStore.user.id, data)

        if (response.success) {
          return true
        } else {
          this.error = response.error || 'Error al cambiar contraseña'
          return false
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error desconocido'
        return false
      } finally {
        this.loading = false
      }
    },

    async uploadAvatar(file: File) {
      const authStore = useAuthStore()
      if (!authStore.user) {
        this.error = 'Usuario no autenticado'
        return null
      }

      this.loading = true
      this.error = null

      try {
        const apiClient = new ApiClient()
        const perfilService = new PerfilService(apiClient)

        const response = await perfilService.uploadAvatar(authStore.user.id, file)

        if (response.success && response.data) {
          return response.data // URL del avatar
        } else {
          this.error = response.error || 'Error al subir avatar'
          return null
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error desconocido'
        return null
      } finally {
        this.loading = false
      }
    },

    // Cargar datos de prueba para desarrollo
    cargarDatosDePrueba() {
      this.historialCompras = [
        {
          id: '1',
          sorteoId: 's1',
          numero: 42,
          fechaCompra: new Date('2024-12-01'),
          montoPagado: 25000,
          metodoPago: 'paypal',
          estadoPago: 'pagado',
          transaccionId: 'TRX-001',
          estadoSorteo: 'finalizado',
          esGanador: true,
          montoGanado: 15000000
        },
        {
          id: '2',
          sorteoId: 's2',
          numero: 13,
          fechaCompra: new Date('2024-12-15'),
          montoPagado: 25000,
          metodoPago: 'mercadopago',
          estadoPago: 'pagado',
          transaccionId: 'TRX-002',
          estadoSorteo: 'en_curso',
        },
        {
          id: '3',
          sorteoId: 's3',
          numero: 77,
          fechaCompra: new Date('2024-11-20'),
          montoPagado: 25000,
          metodoPago: 'stripe',
          estadoPago: 'pagado',
          transaccionId: 'TRX-003',
          estadoSorteo: 'finalizado',
          esGanador: false
        },
      ]

      this.userStats = {
        totalGanado: 15000000,
        sorteosParticipados: 3,
        numerosComprados: 3,
        premiosGanados: 1
      }
    },

    clearError() {
      this.error = null
    },
  },
})

import { defineStore } from 'pinia'
import type { User, LoginForm } from '@/types'
import { AuthService } from '@/services/AuthService'
import { ApiClient } from '@/services/ApiClient'

// Store de autenticación (Principio de Responsabilidad Única)
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && !!state.user,
    userInitials: (state) => {
      if (!state.user) return ''
      return state.user.nombre
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
    },
  },

  actions: {
    async login(userData: LoginForm) {
      this.loading = true
      this.error = null

      try {
        const apiClient = new ApiClient()
        const authService = new AuthService(apiClient)
        
        const response = await authService.login(userData)
        
        if (response.success && response.data) {
          this.user = response.data
          this.isAuthenticated = true
        } else {
          this.error = response.error || 'Error al iniciar sesión'
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error desconocido'
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        const apiClient = new ApiClient()
        const authService = new AuthService(apiClient)
        
        await authService.logout()
        
        this.user = null
        this.isAuthenticated = false
        this.error = null
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al cerrar sesión'
      }
    },

    async checkAuth() {
      try {
        const apiClient = new ApiClient()
        const authService = new AuthService(apiClient)
        
        if (authService.isAuthenticated()) {
          const user = await authService.getCurrentUser()
          if (user) {
            this.user = user
            this.isAuthenticated = true
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al verificar autenticación'
      }
    },

    clearError() {
      this.error = null
    },
  },
})

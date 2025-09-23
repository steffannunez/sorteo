import { defineStore } from 'pinia'
import type { Sorteo, NumeroVendido, CompraRequest } from '@/types'
import { SorteoService } from '@/services/SorteoService'
import { ApiClient } from '@/services/ApiClient'
import { PaymentServiceFactory } from '@/services/PaymentServiceFactory'

// Store de sorteos (Principio de Responsabilidad Única)
export const useSorteoStore = defineStore('sorteo', {
  state: () => ({
    sorteo: null as Sorteo | null,
    numerosDisponibles: [] as number[],
    numerosVendidos: [] as NumeroVendido[],
    montoAcumulado: 0,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    numerosDisponiblesCount: (state) => state.numerosDisponibles.length,
    numerosVendidosCount: (state) => state.numerosVendidos.length,
    totalNumeros: (state) => state.numerosDisponibles.length + state.numerosVendidos.length,
    porcentajeVendido: (state) => {
      const total = state.numerosDisponibles.length + state.numerosVendidos.length
      return total > 0 ? (state.numerosVendidos.length / total) * 100 : 0
    },
    tiempoRestante: (state) => {
      if (!state.sorteo) return null
      
      const ahora = new Date()
      const fechaFin = new Date(state.sorteo.fechaFin)
      const diferencia = fechaFin.getTime() - ahora.getTime()
      
      if (diferencia <= 0) return null
      
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
      const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60))
      const segundos = Math.floor((diferencia % (1000 * 60)) / 1000)
      
      return { dias, horas, minutos, segundos, total: diferencia }
    },
  },

  actions: {
    async fetchSorteoActual() {
      this.loading = true
      this.error = null

      try {
        const apiClient = new ApiClient()
        const sorteoService = new SorteoService(apiClient)
        
        const response = await sorteoService.getSorteoActual()
        
        if (response.success && response.data) {
          this.sorteo = response.data
        } else {
          this.error = response.error || 'Error al obtener sorteo'
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error desconocido'
      } finally {
        this.loading = false
      }
    },

    async fetchNumerosDisponibles() {
      try {
        const apiClient = new ApiClient()
        const sorteoService = new SorteoService(apiClient)
        
        const response = await sorteoService.getNumerosDisponibles()
        
        if (response.success && response.data) {
          this.numerosDisponibles = response.data
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al obtener números'
      }
    },

    async fetchNumerosVendidos() {
      try {
        const apiClient = new ApiClient()
        const sorteoService = new SorteoService(apiClient)
        
        const response = await sorteoService.getNumerosVendidos()
        
        if (response.success && response.data) {
          this.numerosVendidos = response.data
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al obtener números vendidos'
      }
    },

    async fetchMontoAcumulado() {
      try {
        const apiClient = new ApiClient()
        const sorteoService = new SorteoService(apiClient)
        
        const response = await sorteoService.getMontoAcumulado()
        
        if (response.success && response.data !== undefined) {
          this.montoAcumulado = response.data
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al obtener monto'
      }
    },

    async comprarNumero(compra: CompraRequest) {
      this.loading = true
      this.error = null

      try {
        const apiClient = new ApiClient()
        const sorteoService = new SorteoService(apiClient)
        
        const response = await sorteoService.comprarNumero(compra)
        
        if (response.success && response.data) {
          // Redirigir a la URL de pago
          if (response.data.urlPago) {
            window.open(response.data.urlPago, '_blank')
          }
          return response.data
        } else {
          this.error = response.error || 'Error al procesar compra'
          return null
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error desconocido'
        return null
      } finally {
        this.loading = false
      }
    },

    async verificarPago(transaccionId: string, metodoPago: 'paypal' | 'mercadopago' | 'stripe') {
      try {
        const paymentService = PaymentServiceFactory.create(metodoPago)
        return await paymentService.verificarPago(transaccionId)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al verificar pago'
        return false
      }
    },

    clearError() {
      this.error = null
    },
  },
})

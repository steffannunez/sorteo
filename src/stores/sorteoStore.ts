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

    // Método para cargar datos de prueba
    cargarDatosDePrueba() {
      // Crear un sorteo que termine en 5 días, 12 horas, 30 minutos
      const fechaFin = new Date()
      fechaFin.setDate(fechaFin.getDate() + 5)
      fechaFin.setHours(fechaFin.getHours() + 12)
      fechaFin.setMinutes(fechaFin.getMinutes() + 30)

      this.sorteo = {
        id: 'sorteo-prueba-001',
        nombre: 'Gran Sorteo de Prueba',
        descripcion: 'Sorteo de prueba con premio mayor',
        fechaInicio: new Date().toISOString(),
        fechaFin: fechaFin.toISOString(),
        precioNumero: parseInt(import.meta.env.VITE_PRECIO_NUMERO)*0.8,
        totalNumeros: 10000,
        moneda: 'CLP',
        estado: 'activo',
        premio: 'Premio Mayor - $5.000.000',
      }

      // Simular números disponibles (del 1 al 1000, pero algunos vendidos)
      const numerosVendidosSet = new Set([
        1, 7, 13, 21, 33, 42, 69, 77, 88, 99, 100, 111, 123, 144, 169,
        200, 222, 234, 256, 277, 288, 300, 321, 333, 345, 369, 400,
        420, 444, 456, 477, 500, 523, 555, 567, 589, 600, 621, 666,
        678, 700, 721, 777, 789, 800, 821, 888, 900, 921, 999, 1000,
        50, 51, 52, 53, 54, 55, 56, 57, 58, 59, // Bloque de números consecutivos
        150, 151, 152, 153, 154, 155, 156, 157, 158, 159,
        250, 251, 252, 253, 254, 255, 256, 257, 258, 259,
        350, 351, 352, 353, 354, 355, 356, 357, 358, 359,
        450, 451, 452, 453, 454, 455, 456, 457, 458, 459,
        550, 551, 552, 553, 554, 555, 556, 557, 558, 559,
        650, 651, 652, 653, 654, 655, 656, 657, 658, 659,
        750, 751, 752, 753, 754, 755, 756, 757, 758, 759,
        850, 851, 852, 853, 854, 855, 856, 857, 858, 859,
        950, 951, 952, 953, 954, 955, 956, 957, 958, 959,
      ])

      // Generar números vendidos con datos de comprador
      this.numerosVendidos = Array.from(numerosVendidosSet).map(num => ({
        numero: num,
        userId: `user-${Math.floor(Math.random() * 100)}`,
        fechaCompra: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
        transaccionId: `txn-${num}-${Date.now()}`,
      }))

      // Generar números disponibles (todos excepto los vendidos)
      this.numerosDisponibles = Array.from({ length: 1000 }, (_, i) => i + 1)
        .filter(num => !numerosVendidosSet.has(num))

      // Calcular monto acumulado (números vendidos × precio)
      this.montoAcumulado = this.numerosVendidos.length * this.sorteo.precioNumero

      this.error = null
      this.loading = false

      console.log('✅ Datos de prueba cargados:')
      console.log(`   - Sorteo: ${this.sorteo.nombre}`)
      console.log(`   - Números vendidos: ${this.numerosVendidos.length} de ${this.sorteo.totalNumeros}`)
      console.log(`   - Monto acumulado: $${this.montoAcumulado.toLocaleString('es-CL')}`)
      console.log(`   - Tiempo restante: ${fechaFin.toLocaleString('es-CL')}`)
    },
  },
})

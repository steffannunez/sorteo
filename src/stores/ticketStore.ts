import { defineStore } from 'pinia'
import type { UserTickets, Ticket, TicketPurchaseRequest } from '@/types'

// Store de tickets (gestión de intentos de juego)
export const useTicketStore = defineStore('ticket', {
  state: () => ({
    userTickets: null as UserTickets | null,
    loading: false,
    error: null as string | null,
    precioTicket: 1000, // Precio en CLP por ticket
  }),

  getters: {
    ticketsDisponibles: (state) => state.userTickets?.ticketsDisponibles ?? 0,
    ticketsUsados: (state) => state.userTickets?.ticketsUsados ?? 0,
    ticketsComprados: (state) => state.userTickets?.ticketsComprados ?? 0,
    historialCompras: (state) => state.userTickets?.historialCompras ?? [],

    // Verificar si el usuario tiene tickets disponibles
    tieneTicketsDisponibles: (state) => {
      return (state.userTickets?.ticketsDisponibles ?? 0) > 0
    },

    // Calcular total gastado en tickets
    totalGastadoEnTickets: (state) => {
      return state.userTickets?.historialCompras.reduce(
        (total, ticket) => total + ticket.montoPagado,
        0
      ) ?? 0
    },
  },

  actions: {
    async fetchUserTickets(userId: string) {
      this.loading = true
      this.error = null

      try {
        // TODO: Implementar llamada a API real
        // const response = await apiClient.get(`/users/${userId}/tickets`)

        // Por ahora, datos de prueba
        this.userTickets = {
          userId,
          ticketsDisponibles: 3, // 3 tickets gratuitos inicial
          ticketsUsados: 0,
          ticketsComprados: 0,
          historialCompras: [],
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al obtener tickets'
      } finally {
        this.loading = false
      }
    },

    async comprarTickets(request: TicketPurchaseRequest) {
      this.loading = true
      this.error = null

      try {
        // TODO: Implementar llamada a API real para procesar pago
        // const response = await paymentService.procesarPago(request)

        // Simulación de compra exitosa
        const nuevoTicket: Ticket = {
          id: `ticket-${Date.now()}`,
          userId: request.userId,
          cantidad: request.cantidad,
          fechaCompra: new Date(),
          metodoPago: request.metodoPago,
          transaccionId: `txn-${Date.now()}`,
          estadoPago: 'pagado',
          montoPagado: request.cantidad * this.precioTicket,
        }

        if (this.userTickets) {
          this.userTickets.ticketsDisponibles += request.cantidad
          this.userTickets.ticketsComprados += request.cantidad
          this.userTickets.historialCompras.push(nuevoTicket)
        }

        return {
          success: true,
          ticket: nuevoTicket,
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al comprar tickets'
        return {
          success: false,
          error: this.error,
        }
      } finally {
        this.loading = false
      }
    },

    // Usar un ticket (cuando el jugador inicia un juego)
    usarTicket() {
      if (this.userTickets && this.userTickets.ticketsDisponibles > 0) {
        this.userTickets.ticketsDisponibles--
        this.userTickets.ticketsUsados++
        return true
      }
      this.error = 'No tienes tickets disponibles'
      return false
    },

    // Devolver un ticket (si el juego no se completó por error)
    devolverTicket() {
      if (this.userTickets && this.userTickets.ticketsUsados > 0) {
        this.userTickets.ticketsDisponibles++
        this.userTickets.ticketsUsados--
      }
    },

    clearError() {
      this.error = null
    },

    // Método para cargar datos de prueba
    cargarDatosDePrueba(userId: string) {
      this.userTickets = {
        userId,
        ticketsDisponibles: 5,
        ticketsUsados: 2,
        ticketsComprados: 7,
        historialCompras: [
          {
            id: 'ticket-001',
            userId,
            cantidad: 5,
            fechaCompra: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            metodoPago: 'paypal',
            transaccionId: 'txn-paypal-123',
            estadoPago: 'pagado',
            montoPagado: 5000,
          },
          {
            id: 'ticket-002',
            userId,
            cantidad: 2,
            fechaCompra: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            metodoPago: 'mercadopago',
            transaccionId: 'txn-mp-456',
            estadoPago: 'pagado',
            montoPagado: 2000,
          },
        ],
      }

      console.log('✅ Datos de prueba de tickets cargados:')
      console.log(`   - Tickets disponibles: ${this.userTickets.ticketsDisponibles}`)
      console.log(`   - Tickets usados: ${this.userTickets.ticketsUsados}`)
      console.log(`   - Total comprado: $${this.totalGastadoEnTickets.toLocaleString('es-CL')}`)
    },
  },
})

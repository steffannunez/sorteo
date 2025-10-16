import { defineStore } from 'pinia'
import type { TopPlayers, PlayerScore } from '@/types'

// Store de ranking de jugadores
export const useRankingStore = defineStore('ranking', {
  state: () => ({
    topPlayers: null as TopPlayers | null,
    loading: false,
    error: null as string | null,
    periodo: 'mensual' as 'diario' | 'semanal' | 'mensual' | 'historico',
  }),

  getters: {
    top10Players: (state) => {
      return state.topPlayers?.jugadores.slice(0, 10) ?? []
    },

    playerPosition: (state) => (userId: string) => {
      const player = state.topPlayers?.jugadores.find(p => p.userId === userId)
      return player?.posicion ?? null
    },

    playerScore: (state) => (userId: string) => {
      return state.topPlayers?.jugadores.find(p => p.userId === userId) ?? null
    },

    lastUpdate: (state) => state.topPlayers?.fechaActualizacion,
  },

  actions: {
    async fetchTopPlayers(periodo: 'diario' | 'semanal' | 'mensual' | 'historico' = 'mensual') {
      this.loading = true
      this.error = null
      this.periodo = periodo

      try {
        // TODO: Implementar llamada a API real
        // const response = await apiClient.get(`/ranking/${periodo}`)

        // Por ahora, datos de prueba
        this.topPlayers = {
          periodo,
          fechaActualizacion: new Date(),
          jugadores: [], // Se llenará con datos de prueba
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al obtener ranking'
      } finally {
        this.loading = false
      }
    },

    async actualizarPuntaje(userId: string, puntajeNuevo: number) {
      try {
        // TODO: Implementar llamada a API real
        // await apiClient.post(`/ranking/update`, { userId, puntaje: puntajeNuevo })

        // Actualizar localmente
        if (this.topPlayers) {
          const playerIndex = this.topPlayers.jugadores.findIndex(p => p.userId === userId)

          if (playerIndex !== -1) {
            const player = this.topPlayers.jugadores[playerIndex]
            player.puntajeTotal += puntajeNuevo
            player.partidasJugadas++
            player.promedioPuntaje = player.puntajeTotal / player.partidasJugadas
          }

          // Reordenar por puntaje y actualizar posiciones
          this.topPlayers.jugadores.sort((a, b) => b.puntajeTotal - a.puntajeTotal)
          this.topPlayers.jugadores.forEach((player, index) => {
            player.posicion = index + 1
          })
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al actualizar puntaje'
      }
    },

    clearError() {
      this.error = null
    },

    // Método para cargar datos de prueba
    cargarDatosDePrueba() {
      const jugadoresPrueba: PlayerScore[] = [
        {
          userId: 'user-001',
          userName: 'Carlos Rodríguez',
          puntajeTotal: 2850,
          partidasJugadas: 45,
          promedioPuntaje: 63.3,
          posicion: 1,
          avatarUrl: undefined,
        },
        {
          userId: 'user-002',
          userName: 'María González',
          puntajeTotal: 2720,
          partidasJugadas: 42,
          promedioPuntaje: 64.8,
          posicion: 2,
          avatarUrl: undefined,
        },
        {
          userId: 'user-003',
          userName: 'Ana Martínez',
          puntajeTotal: 2650,
          partidasJugadas: 38,
          promedioPuntaje: 69.7,
          posicion: 3,
          avatarUrl: undefined,
        },
        {
          userId: 'user-004',
          userName: 'Juan Pérez',
          puntajeTotal: 2480,
          partidasJugadas: 41,
          promedioPuntaje: 60.5,
          posicion: 4,
          avatarUrl: undefined,
        },
        {
          userId: 'user-005',
          userName: 'Laura Silva',
          puntajeTotal: 2350,
          partidasJugadas: 35,
          promedioPuntaje: 67.1,
          posicion: 5,
          avatarUrl: undefined,
        },
        {
          userId: 'user-006',
          userName: 'Diego Torres',
          puntajeTotal: 2280,
          partidasJugadas: 39,
          promedioPuntaje: 58.5,
          posicion: 6,
          avatarUrl: undefined,
        },
        {
          userId: 'user-007',
          userName: 'Sofía Ramírez',
          puntajeTotal: 2150,
          partidasJugadas: 33,
          promedioPuntaje: 65.2,
          posicion: 7,
          avatarUrl: undefined,
        },
        {
          userId: 'user-008',
          userName: 'Miguel Ángel Castro',
          puntajeTotal: 2080,
          partidasJugadas: 37,
          promedioPuntaje: 56.2,
          posicion: 8,
          avatarUrl: undefined,
        },
        {
          userId: 'user-009',
          userName: 'Valentina Flores',
          puntajeTotal: 1950,
          partidasJugadas: 31,
          promedioPuntaje: 62.9,
          posicion: 9,
          avatarUrl: undefined,
        },
        {
          userId: 'user-010',
          userName: 'Andrés Morales',
          puntajeTotal: 1880,
          partidasJugadas: 29,
          promedioPuntaje: 64.8,
          posicion: 10,
          avatarUrl: undefined,
        },
        {
          userId: 'user-011',
          userName: 'Camila Vargas',
          puntajeTotal: 1820,
          partidasJugadas: 28,
          promedioPuntaje: 65.0,
          posicion: 11,
          avatarUrl: undefined,
        },
        {
          userId: 'user-012',
          userName: 'Roberto Sánchez',
          puntajeTotal: 1750,
          partidasJugadas: 32,
          promedioPuntaje: 54.7,
          posicion: 12,
          avatarUrl: undefined,
        },
      ]

      this.topPlayers = {
        periodo: this.periodo,
        fechaActualizacion: new Date(),
        jugadores: jugadoresPrueba,
      }

      console.log('✅ Datos de prueba de ranking cargados:')
      console.log(`   - Periodo: ${this.periodo}`)
      console.log(`   - Total jugadores: ${jugadoresPrueba.length}`)
      console.log(`   - Líder actual: ${jugadoresPrueba[0].userName} con ${jugadoresPrueba[0].puntajeTotal} puntos`)
    },
  },
})

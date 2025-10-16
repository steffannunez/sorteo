/**
 * Tipos generados automáticamente por Supabase
 *
 * Para actualizar estos tipos después de cambios en la base de datos:
 * npx supabase gen types typescript --project-id <tu-project-id> --schema public > src/types/supabase.ts
 *
 * O manualmente al crear/modificar tablas en Supabase
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Tabla de usuarios (puede integrarse con Supabase Auth)
      users: {
        Row: {
          id: string
          email: string
          nombre: string
          rut: string
          telefono: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          nombre: string
          rut: string
          telefono: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nombre?: string
          rut?: string
          telefono?: string
          avatar_url?: string | null
          updated_at?: string
        }
      }

      // Tabla de palabras del día para Wordle
      daily_words: {
        Row: {
          id: string
          palabra: string
          fecha: string // Fecha en formato YYYY-MM-DD
          dificultad: 'facil' | 'media' | 'dificil'
          categoria: string | null
          created_at: string
        }
        Insert: {
          id?: string
          palabra: string
          fecha: string
          dificultad?: 'facil' | 'media' | 'dificil'
          categoria?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          palabra?: string
          fecha?: string
          dificultad?: 'facil' | 'media' | 'dificil'
          categoria?: string | null
        }
      }

      // Tabla de partidas de Wordle
      wordle_games: {
        Row: {
          id: string
          user_id: string
          daily_word_id: string
          intentos_usados: number
          completado: boolean
          ganado: boolean
          puntaje: number
          tiempo_segundos: number
          fecha_juego: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          daily_word_id: string
          intentos_usados?: number
          completado?: boolean
          ganado?: boolean
          puntaje?: number
          tiempo_segundos?: number
          fecha_juego?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          daily_word_id?: string
          intentos_usados?: number
          completado?: boolean
          ganado?: boolean
          puntaje?: number
          tiempo_segundos?: number
        }
      }

      // Tabla de tickets
      tickets: {
        Row: {
          id: string
          user_id: string
          cantidad: number
          fecha_compra: string
          metodo_pago: 'paypal' | 'mercadopago' | 'stripe'
          transaccion_id: string
          estado_pago: 'pendiente' | 'pagado' | 'rechazado'
          monto_pagado: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cantidad: number
          fecha_compra?: string
          metodo_pago: 'paypal' | 'mercadopago' | 'stripe'
          transaccion_id: string
          estado_pago?: 'pendiente' | 'pagado' | 'rechazado'
          monto_pagado: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cantidad?: number
          metodo_pago?: 'paypal' | 'mercadopago' | 'stripe'
          transaccion_id?: string
          estado_pago?: 'pendiente' | 'pagado' | 'rechazado'
          monto_pagado?: number
        }
      }

      // Tabla de balance de tickets del usuario
      user_tickets: {
        Row: {
          id: string
          user_id: string
          tickets_disponibles: number
          tickets_usados: number
          tickets_comprados: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tickets_disponibles?: number
          tickets_usados?: number
          tickets_comprados?: number
          updated_at?: string
        }
        Update: {
          id?: string
          tickets_disponibles?: number
          tickets_usados?: number
          tickets_comprados?: number
          updated_at?: string
        }
      }

      // Tabla de ranking de jugadores
      player_scores: {
        Row: {
          id: string
          user_id: string
          puntaje_total: number
          partidas_jugadas: number
          promedio_puntaje: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          puntaje_total?: number
          partidas_jugadas?: number
          promedio_puntaje?: number
          updated_at?: string
        }
        Update: {
          id?: string
          puntaje_total?: number
          partidas_jugadas?: number
          promedio_puntaje?: number
          updated_at?: string
        }
      }

      // Tabla de sorteos
      raffles: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          fecha_inicio: string
          fecha_fin: string
          premio: string
          monto_acumulado: number
          estado: 'activo' | 'finalizado' | 'proximo'
          ganador_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          fecha_inicio: string
          fecha_fin: string
          premio: string
          monto_acumulado?: number
          estado?: 'activo' | 'finalizado' | 'proximo'
          ganador_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          fecha_inicio?: string
          fecha_fin?: string
          premio?: string
          monto_acumulado?: number
          estado?: 'activo' | 'finalizado' | 'proximo'
          ganador_id?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

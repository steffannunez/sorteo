// Tipos base para el sistema de sorteos
export interface User {
  id: string
  email: string
  nombre: string
  rut: string
  telefono: string
  createdAt: Date
  updatedAt: Date
}

export interface Sorteo {
  id: string
  fechaInicio: Date
  fechaFin: Date
  montoAcumulado: number
  numerosDisponibles: number[]
  numerosVendidos: NumeroVendido[]
  estado: 'activo' | 'finalizado' | 'proximo'
  precioNumero: number
  moneda: string
}

export interface NumeroVendido {
  id: string
  numero: number
  userId: string
  user: User
  fechaCompra: Date
  montoPagado: number
  metodoPago: 'paypal' | 'mercadopago' | 'stripe'
  estadoPago: 'pendiente' | 'pagado' | 'rechazado'
  transaccionId: string
}

export interface CompraRequest {
  numero: number
  userId: string
  metodoPago: 'paypal' | 'mercadopago' | 'stripe'
}

export interface PagoResponse {
  success: boolean
  transaccionId?: string
  urlPago?: string
  error?: string
}

// Tipos para las pasarelas de pago
export interface PayPalConfig {
  clientId: string
  clientSecret: string
  environment: 'sandbox' | 'production'
}

export interface MercadoPagoConfig {
  accessToken: string
  publicKey: string
  environment: 'sandbox' | 'production'
}

export interface StripeConfig {
  publishableKey: string
  secretKey: string
  environment: 'test' | 'live'
}

// Tipos para el estado de la aplicación
export interface AppState {
  user: User | null
  sorteo: Sorteo | null
  loading: boolean
  error: string | null
}

// Tipos para formularios
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  nombre: string
  rut: string
  telefono: string
}

export interface CompraForm {
  numero: number
  metodoPago: 'paypal' | 'mercadopago' | 'stripe'
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface CountdownData {
  dias: number
  horas: number
  minutos: number
  segundos: number
  total: number
}

// Tipos para el perfil de usuario
export interface HistorialCompra {
  id: string
  sorteoId: string
  numero: number
  fechaCompra: Date
  montoPagado: number
  metodoPago: 'paypal' | 'mercadopago' | 'stripe'
  estadoPago: 'pendiente' | 'pagado' | 'rechazado'
  transaccionId: string
  estadoSorteo: 'en_curso' | 'finalizado'
  esGanador?: boolean
  montoGanado?: number
}

// Tipo para historial de participación en sorteos (con puntos)
export interface ParticipacionSorteo {
  id: string
  sorteoId: string
  sorteoNombre: string
  fechaInicio: Date
  fechaFin: Date
  puntosAcumulados: number
  posicionRanking: number
  participantes: number
  esGanador: boolean
  montoGanado?: number
  estado: 'en_curso' | 'finalizado'
}

export interface NotificationPreferences {
  emailNotifications: boolean
  sorteoNotifications: boolean
  ganadoresNotifications: boolean
  promocionesNotifications: boolean
}

export interface UserStats {
  // Puntos
  puntosActuales: number // Puntos acumulados en el período actual
  puntosHistoricos: number // Total de puntos ganados desde siempre
  recordPuntosMensuales: number // Máximo de puntos en un mes

  // Dinero
  totalGanado: number // Dinero total ganado en sorteos
  totalGastado: number // Dinero gastado en tickets

  // Sorteos
  sorteosParticipados: number
  sorteosGanados: number

  // Juegos
  partidasJugadas: number
  partidasGanadas: number
  promedioIntentos: number

  // Tickets
  ticketsComprados: number
  ticketsUsados: number
}

export interface UpdateProfileRequest {
  nombre?: string
  telefono?: string
  avatarUrl?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// ============================================
// TIPOS PARA SISTEMA DE JUEGOS Y TICKETS
// ============================================

// Tipos para el sistema de tickets
export interface Ticket {
  id: string
  userId: string
  cantidad: number
  fechaCompra: Date
  metodoPago: 'paypal' | 'mercadopago' | 'stripe'
  transaccionId: string
  estadoPago: 'pendiente' | 'pagado' | 'rechazado'
  montoPagado: number
}

export interface TicketPurchaseRequest {
  userId: string
  cantidad: number
  metodoPago: 'paypal' | 'mercadopago' | 'stripe'
}

export interface UserTickets {
  userId: string
  ticketsDisponibles: number
  ticketsUsados: number
  ticketsComprados: number
  historialCompras: Ticket[]
}

// Tipos para el ranking de jugadores
export interface PlayerScore {
  userId: string
  userName: string
  puntajeTotal: number
  partidasJugadas: number
  promedioPuntaje: number
  posicion: number
  avatarUrl?: string
}

export interface TopPlayers {
  periodo: 'diario' | 'semanal' | 'mensual' | 'historico'
  fechaActualizacion: Date
  jugadores: PlayerScore[]
}

// Tipos para intentos de juego
export interface GameAttempt {
  id: string
  userId: string
  gameType: 'wordle' | 'contexto' | 'ahorcado'
  fecha: Date
  puntajeObtenido: number
  intentosUsados: number
  completado: boolean
  tiempoEmpleado: number // en segundos
}

export interface DailyGameStatus {
  gameType: 'wordle' | 'contexto' | 'ahorcado'
  intentoGratisUsado: boolean
  intentosExtraUsados: number
  ultimoIntento?: Date
  mejorPuntaje?: number
}

// ============================================
// TIPOS ESPECÍFICOS PARA WORDLE
// ============================================

export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty'

export interface WordleLetter {
  letter: string
  status: LetterStatus
}

export interface WordleRow {
  letters: WordleLetter[]
  isSubmitted: boolean
}

export interface WordleGameState {
  gameId: string | null
  dailyWordId: string
  palabraSecreta: string // Solo en cliente, encriptada o no expuesta en producción
  intentosMaximos: number
  intentoActual: number
  filas: WordleRow[]
  estadoJuego: 'jugando' | 'ganado' | 'perdido'
  puntaje: number
  tiempoInicio: Date | null
  tiempoFin: Date | null
}

export interface WordleStats {
  partidasJugadas: number
  partidasGanadas: number
  rachaActual: number
  mejorRacha: number
  distribucionIntentos: Record<number, number> // {1: 5, 2: 10, 3: 15, ...}
  promedioIntentos: number
}

export interface DailyWord {
  id: string
  palabra: string
  fecha: string // YYYY-MM-DD
  dificultad: 'facil' | 'media' | 'dificil'
  categoria: string | null
}

export interface WordleGameResult {
  gameId: string
  userId: string
  dailyWordId: string
  intentosUsados: number
  completado: boolean
  ganado: boolean
  puntaje: number
  tiempoSegundos: number
  fechaJuego: Date
}

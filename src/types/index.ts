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

export interface NotificationPreferences {
  emailNotifications: boolean
  sorteoNotifications: boolean
  ganadoresNotifications: boolean
  promocionesNotifications: boolean
}

export interface UserStats {
  totalGanado: number
  sorteosParticipados: number
  numerosComprados: number
  premiosGanados: number
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

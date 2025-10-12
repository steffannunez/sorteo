import type {
  User,
  HistorialCompra,
  NotificationPreferences,
  UserStats,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ApiResponse
} from '@/types'

// Interface para el servicio de perfil (Principio de Inversión de Dependencias)
export interface IPerfilService {
  // Información del usuario
  getProfile(userId: string): Promise<ApiResponse<User>>
  updateProfile(userId: string, data: UpdateProfileRequest): Promise<ApiResponse<User>>

  // Seguridad
  changePassword(userId: string, data: ChangePasswordRequest): Promise<ApiResponse<boolean>>

  // Historial
  getHistorialCompras(userId: string): Promise<ApiResponse<HistorialCompra[]>>

  // Notificaciones
  getNotificationPreferences(userId: string): Promise<ApiResponse<NotificationPreferences>>
  updateNotificationPreferences(userId: string, preferences: NotificationPreferences): Promise<ApiResponse<NotificationPreferences>>

  // Estadísticas
  getUserStats(userId: string): Promise<ApiResponse<UserStats>>

  // Avatar
  uploadAvatar(userId: string, file: File): Promise<ApiResponse<string>>
}

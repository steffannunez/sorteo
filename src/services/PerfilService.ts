import type { IPerfilService } from '@/services/interfaces/IPerfilService'
import type { IApiClient } from '@/services/interfaces/IApiClient'
import type {
  User,
  HistorialCompra,
  NotificationPreferences,
  UserStats,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ApiResponse
} from '@/types'

// Servicio de perfil de usuario (Principio de Responsabilidad Única)
export class PerfilService implements IPerfilService {
  constructor(private apiClient: IApiClient) {}

  async getProfile(userId: string): Promise<ApiResponse<User>> {
    return this.apiClient.get<User>(`/users/${userId}`)
  }

  async updateProfile(userId: string, data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    return this.apiClient.put<User>(`/users/${userId}`, data)
  }

  async changePassword(userId: string, data: ChangePasswordRequest): Promise<ApiResponse<boolean>> {
    // Validación de contraseñas
    if (data.newPassword !== data.confirmPassword) {
      return {
        success: false,
        error: 'Las contraseñas no coinciden'
      }
    }

    if (data.newPassword.length < 8) {
      return {
        success: false,
        error: 'La contraseña debe tener al menos 8 caracteres'
      }
    }

    return this.apiClient.post<boolean>(`/users/${userId}/change-password`, {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    })
  }

  async getHistorialCompras(userId: string): Promise<ApiResponse<HistorialCompra[]>> {
    return this.apiClient.get<HistorialCompra[]>(`/users/${userId}/historial`)
  }

  async getNotificationPreferences(userId: string): Promise<ApiResponse<NotificationPreferences>> {
    return this.apiClient.get<NotificationPreferences>(`/users/${userId}/notifications`)
  }

  async updateNotificationPreferences(
    userId: string,
    preferences: NotificationPreferences
  ): Promise<ApiResponse<NotificationPreferences>> {
    return this.apiClient.put<NotificationPreferences>(
      `/users/${userId}/notifications`,
      preferences
    )
  }

  async getUserStats(userId: string): Promise<ApiResponse<UserStats>> {
    return this.apiClient.get<UserStats>(`/users/${userId}/stats`)
  }

  async uploadAvatar(userId: string, file: File): Promise<ApiResponse<string>> {
    const formData = new FormData()
    formData.append('avatar', file)

    // Nota: Aquí deberías implementar el upload de archivo específico
    // Por ahora retornamos una URL simulada
    return this.apiClient.post<string>(`/users/${userId}/avatar`, formData)
  }
}

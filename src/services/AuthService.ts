import type { IAuthService } from '@/services/interfaces/IAuthService'
import type { IApiClient } from '@/services/interfaces/IApiClient'
import type { User, LoginForm, ApiResponse } from '@/types'

// Servicio de autenticación (Principio de Responsabilidad Única)
export class AuthService implements IAuthService {
  constructor(private apiClient: IApiClient) {}

  async login(userData: LoginForm): Promise<ApiResponse<User>> {
    const response = await this.apiClient.post<User>('/auth/login', userData)
    
    if (response.success && response.data) {
      // Guardar token en localStorage
      localStorage.setItem('auth_token', 'token_placeholder')
      localStorage.setItem('user', JSON.stringify(response.data))
    }
    
    return response
  }

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  async getCurrentUser(): Promise<User | null> {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token')
  }
}

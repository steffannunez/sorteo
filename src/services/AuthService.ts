import type { IAuthService } from '@/services/interfaces/IAuthService'
import type { IApiClient } from '@/services/interfaces/IApiClient'
import type { User, LoginForm, RegisterForm, ApiResponse } from '@/types'

// Servicio de autenticación (Principio de Responsabilidad Única)
export class AuthService implements IAuthService {
  constructor(private apiClient: IApiClient) {}

  async login(userData: LoginForm): Promise<ApiResponse<User>> {
    // BYPASS para pruebas sin backend
    if (userData.email === 'steffan.relative@gmail.com' && userData.password === 'contraseña1') {
      const mockUser: User = {
        id: 'user-test-123',
        email: 'steffan.relative@gmail.com',
        nombre: 'Steffan Relative',
        rut: '12345678-9',
        telefono: '+56 9 1234 5678',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      }

      // Guardar token en localStorage
      localStorage.setItem('auth_token', 'bypass_token_test')
      localStorage.setItem('user', JSON.stringify(mockUser))

      return {
        success: true,
        data: mockUser,
        message: 'Login exitoso (modo bypass)'
      }
    }

    // Flujo normal con backend
    const response = await this.apiClient.post<User>('/auth/login', userData)

    if (response.success && response.data) {
      // Guardar token en localStorage
      localStorage.setItem('auth_token', 'token_placeholder')
      localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response
  }

  async register(userData: RegisterForm): Promise<ApiResponse<User>> {
    const response = await this.apiClient.post<User>('/auth/register', userData)

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

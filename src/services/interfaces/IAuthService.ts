import type { User, LoginForm, ApiResponse } from '@/types'

// Interface para el servicio de autenticación (Principio de Inversión de Dependencias)
export interface IAuthService {
  login(userData: LoginForm): Promise<ApiResponse<User>>
  logout(): Promise<void>
  getCurrentUser(): Promise<User | null>
  isAuthenticated(): boolean
}

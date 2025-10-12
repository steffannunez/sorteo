import type { User, LoginForm, RegisterForm, ApiResponse } from '@/types'

// Interface para el servicio de autenticación (Principio de Inversión de Dependencias)
export interface IAuthService {
  login(userData: LoginForm): Promise<ApiResponse<User>>
  register(userData: RegisterForm): Promise<ApiResponse<User>>
  logout(): Promise<void>
  getCurrentUser(): Promise<User | null>
  isAuthenticated(): boolean
}

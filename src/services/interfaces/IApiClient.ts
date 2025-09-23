import type { ApiResponse } from '@/types'

// Interface para el cliente HTTP (Principio de Inversión de Dependencias)
export interface IApiClient {
  get<T>(url: string, config?: RequestInit): Promise<ApiResponse<T>>
  post<T>(url: string, data?: any, config?: RequestInit): Promise<ApiResponse<T>>
  put<T>(url: string, data?: any, config?: RequestInit): Promise<ApiResponse<T>>
  delete<T>(url: string, config?: RequestInit): Promise<ApiResponse<T>>
}

import type { ISorteoService } from '@/services/interfaces/ISorteoService'
import type { IApiClient } from '@/services/interfaces/IApiClient'
import type { Sorteo, NumeroVendido, CompraRequest, PagoResponse, ApiResponse } from '@/types'

// Servicio de sorteos (Principio de Responsabilidad Única)
export class SorteoService implements ISorteoService {
  constructor(private apiClient: IApiClient) {}

  async getSorteoActual(): Promise<ApiResponse<Sorteo>> {
    return this.apiClient.get<Sorteo>('/sorteo/actual')
  }

  async getNumerosDisponibles(): Promise<ApiResponse<number[]>> {
    return this.apiClient.get<number[]>('/sorteo/numeros-disponibles')
  }

  async comprarNumero(compra: CompraRequest): Promise<ApiResponse<PagoResponse>> {
    return this.apiClient.post<PagoResponse>('/sorteo/comprar', compra)
  }

  async getNumerosVendidos(): Promise<ApiResponse<NumeroVendido[]>> {
    return this.apiClient.get<NumeroVendido[]>('/sorteo/numeros-vendidos')
  }

  async getMontoAcumulado(): Promise<ApiResponse<number>> {
    return this.apiClient.get<number>('/sorteo/monto-acumulado')
  }
}

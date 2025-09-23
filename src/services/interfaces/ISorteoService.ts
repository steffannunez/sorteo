import type { Sorteo, NumeroVendido, CompraRequest, PagoResponse, ApiResponse } from '@/types'

// Interface para el servicio de sorteos (Principio de Inversión de Dependencias)
export interface ISorteoService {
  getSorteoActual(): Promise<ApiResponse<Sorteo>>
  getNumerosDisponibles(): Promise<ApiResponse<number[]>>
  comprarNumero(compra: CompraRequest): Promise<ApiResponse<PagoResponse>>
  getNumerosVendidos(): Promise<ApiResponse<NumeroVendido[]>>
  getMontoAcumulado(): Promise<ApiResponse<number>>
}

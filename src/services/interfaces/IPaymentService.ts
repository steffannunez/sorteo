import type { PagoResponse, CompraRequest } from '@/types'

// Interface para el servicio de pagos (Principio de Inversión de Dependencias)
export interface IPaymentService {
  procesarPago(compra: CompraRequest): Promise<PagoResponse>
  verificarPago(transaccionId: string): Promise<boolean>
  cancelarPago(transaccionId: string): Promise<boolean>
}

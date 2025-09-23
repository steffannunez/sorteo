import type { IPaymentService } from '@/services/interfaces/IPaymentService'
import { PayPalService } from '@/services/payments/PayPalService'
import { MercadoPagoService } from '@/services/payments/MercadoPagoService'
import { StripeService } from '@/services/payments/StripeService'

// Factory para servicios de pago (Principio Abierto/Cerrado)
export class PaymentServiceFactory {
  static create(metodo: 'paypal' | 'mercadopago' | 'stripe'): IPaymentService {
    switch (metodo) {
      case 'paypal':
        return new PayPalService()
      case 'mercadopago':
        return new MercadoPagoService()
      case 'stripe':
        return new StripeService()
      default:
        throw new Error(`Método de pago no soportado: ${metodo}`)
    }
  }

  static getAvailableMethods(): Array<{ value: string; label: string; icon: string }> {
    return [
      { value: 'paypal', label: 'PayPal', icon: 'fab fa-paypal' },
      { value: 'mercadopago', label: 'MercadoPago', icon: 'fas fa-credit-card' },
      { value: 'stripe', label: 'Stripe', icon: 'fab fa-stripe' },
    ]
  }
}

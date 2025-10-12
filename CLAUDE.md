# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SorteoApp is a Vue 3 + TypeScript lottery ticket sales system with multiple payment gateway integrations (PayPal, MercadoPago, Stripe). The application follows SOLID principles with a clean service-oriented architecture.

## Development Commands

```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Type checking (does not emit files)
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview

# Lint and auto-fix code
npm run lint
```

## Architecture Patterns

### SOLID Implementation

The codebase strictly follows SOLID principles:

- **Service Layer with Interfaces**: All services implement interfaces defined in `src/services/interfaces/`. For example, `IPaymentService`, `IAuthService`, `ISorteoService`, and `IApiClient`.

- **Factory Pattern for Payment Services**: Use `PaymentServiceFactory` (`src/services/PaymentServiceFactory.ts`) to instantiate payment services. This implements Open/Closed principle - extending to new payment methods requires minimal changes:
  ```typescript
  const paymentService = PaymentServiceFactory.create('paypal' | 'mercadopago' | 'stripe')
  ```

- **Dependency Injection**: Services depend on interfaces, not concrete implementations. For example, `SorteoService` receives an `IApiClient` in its constructor.

### State Management

State is managed through Pinia stores located in `src/stores/`:

- **authStore**: Manages user authentication state (user data, tokens, login/logout)
- **sorteoStore**: Manages lottery state (current raffle, available numbers, sold numbers, accumulated amount, countdown timer)

The `sorteoStore` includes getters for calculated values like `porcentajeVendido`, `tiempoRestante`, and methods to fetch raffle data and process purchases.

### Payment Gateway Integration

Payment integrations are in `src/services/payments/`:
- `PayPalService.ts`
- `MercadoPagoService.ts`
- `StripeService.ts`

All implement the `IPaymentService` interface with methods:
- `procesarPago(compra: CompraRequest): Promise<PagoResponse>`
- `verificarPago(transaccionId: string): Promise<boolean>`
- `cancelarPago(transaccionId: string): Promise<boolean>`

### Component Structure

- **UI Components**: Base reusable components in `src/components/ui/` (`BaseButton.vue`, `BaseCard.vue`, `BaseInput.vue`)
- **Feature Components**: Domain-specific components in `src/components/` (`LoginForm.vue`, `CompraForm.vue`, `CountdownTimer.vue`, `MontoAcumulado.vue`)
- **Views**: Page-level components in `src/views/` (currently only `Home.vue`)

### Path Aliasing

The project uses `@` as an alias for the `src/` directory (configured in `vite.config.ts`):
```typescript
import { useSorteoStore } from '@/stores/sorteoStore'
import type { User } from '@/types'
```

## TypeScript Types

Core types are defined in `src/types/index.ts`:
- `User`, `Sorteo`, `NumeroVendido` - domain models
- `CompraRequest`, `PagoResponse` - request/response types
- `ApiResponse<T>` - generic API response wrapper
- Payment gateway configs: `PayPalConfig`, `MercadoPagoConfig`, `StripeConfig`

Environment variables are typed in `src/types/env.d.ts`.

## Environment Configuration

Environment variables are accessed through `src/config/env.ts` and must be prefixed with `VITE_`:

Required variables:
- `VITE_JWT_SECRET` - JWT authentication secret
- `VITE_PAYPAL_CLIENT_ID` - PayPal client ID
- `VITE_MERCADOPAGO_ACCESS_TOKEN` - MercadoPago access token
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

Optional configuration:
- `VITE_SORTEO_DURACION_HORAS` - Raffle duration in hours
- `VITE_PRECIO_NUMERO` - Price per ticket number
- `VITE_MONEDA` - Currency code (e.g., CLP)

## Key Implementation Notes

- The application uses Vue Router but currently has only one route (`/` → `Home.vue`)
- Styling is done with Tailwind CSS v3.3.6
- Utility function `cn()` in `src/utils/cn.ts` merges Tailwind classes (using `clsx` + `tailwind-merge`)
- The countdown timer in `sorteoStore` calculates remaining time until `sorteo.fechaFin`
- Payment flow: User selects number → Calls `comprarNumero()` → Opens payment URL in new tab → Verifies payment with `verificarPago()`

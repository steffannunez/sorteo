/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_DB_URL: string
  readonly VITE_DB_NAME: string
  readonly VITE_JWT_SECRET: string
  readonly VITE_JWT_EXPIRES_IN: string
  readonly VITE_PAYPAL_CLIENT_ID: string
  readonly VITE_PAYPAL_CLIENT_SECRET: string
  readonly VITE_MERCADOPAGO_ACCESS_TOKEN: string
  readonly VITE_MERCADOPAGO_PUBLIC_KEY: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_STRIPE_SECRET_KEY: string
  readonly VITE_SORTEO_DURACION_HORAS: string
  readonly VITE_PRECIO_NUMERO: string
  readonly VITE_MONEDA: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

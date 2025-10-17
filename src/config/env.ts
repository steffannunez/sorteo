// Configuración de variables de entorno
export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'SorteoApp',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  
  database: {
    url: import.meta.env.VITE_DB_URL || 'mongodb://localhost:27017/sorteo',
    name: import.meta.env.VITE_DB_NAME || 'sorteo',
  },
  
  auth: {
    jwtSecret: import.meta.env.VITE_JWT_SECRET || 'default-secret',
    jwtExpiresIn: import.meta.env.VITE_JWT_EXPIRES_IN || '7d',
  },
  
  payments: {
    paypal: {
      clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
      clientSecret: import.meta.env.VITE_PAYPAL_CLIENT_SECRET || '',
      environment: 'sandbox' as const,
    },
    mercadopago: {
      accessToken: import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN || '',
      publicKey: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '',
      environment: 'sandbox' as const,
    },
    stripe: {
      publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
      secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || '',
      environment: 'test' as const,
    },
  },
  
  sorteo: {
    duracionHoras: parseInt(import.meta.env.VITE_SORTEO_DURACION_HORAS || '24'),
    precioNumero: parseInt(import.meta.env.VITE_PRECIO_NUMERO || '2000'),
    moneda: import.meta.env.VITE_MONEDA || 'CLP',
  },
  
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  },

  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
} as const

// Validación de variables de entorno requeridas
export const validateEnv = (): boolean => {
  const requiredVars = [
    'VITE_JWT_SECRET',
    'VITE_PAYPAL_CLIENT_ID',
    'VITE_MERCADOPAGO_ACCESS_TOKEN',
    'VITE_STRIPE_PUBLISHABLE_KEY',
  ]
  
  const missing = requiredVars.filter(varName => !import.meta.env[varName])
  
  if (missing.length > 0) {
    console.error('Variables de entorno faltantes:', missing)
    return false
  }
  
  return true
}

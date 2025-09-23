# SorteoApp - Sistema de Sorteos

Una aplicación moderna de Vue 3 + TypeScript para la venta de números de sorteo con integración de múltiples pasarelas de pago.

## 🚀 Características

- **Vue 3 + TypeScript**: Desarrollo moderno y tipado
- **Arquitectura SOLID**: Código mantenible y escalable
- **UI Minimalista**: Diseño elegante y intuitivo
- **Múltiples Pasarelas de Pago**: PayPal, MercadoPago y Stripe
- **Autenticación Simple**: Login con email, nombre, RUT y teléfono
- **Countdown Timer**: Tiempo restante hasta el sorteo
- **Monto Acumulado**: Visualización del dinero recaudado
- **Responsive Design**: Adaptable a todos los dispositivos

## 🛠️ Tecnologías

- **Frontend**: Vue 3, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Pagos**: PayPal, MercadoPago, Stripe
- **Arquitectura**: Principios SOLID

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd sorteo
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Editar el archivo `.env` con tus credenciales:
   ```env
   VITE_JWT_SECRET=tu_jwt_secret_muy_seguro
   VITE_PAYPAL_CLIENT_ID=tu_paypal_client_id
   VITE_MERCADOPAGO_ACCESS_TOKEN=tu_mercadopago_token
   VITE_STRIPE_PUBLISHABLE_KEY=tu_stripe_key
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🏗️ Arquitectura

### Principios SOLID Implementados

- **S (Single Responsibility)**: Cada clase tiene una responsabilidad única
- **O (Open/Closed)**: Extensible para nuevos métodos de pago
- **L (Liskov Substitution)**: Interfaces bien definidas
- **I (Interface Segregation)**: Interfaces específicas y pequeñas
- **D (Dependency Inversion)**: Dependencias a través de interfaces

### Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base (Button, Input, Card)
│   ├── CountdownTimer.vue
│   ├── MontoAcumulado.vue
│   ├── LoginForm.vue
│   └── CompraForm.vue
├── services/           # Lógica de negocio
│   ├── interfaces/     # Contratos (Principio DIP)
│   ├── payments/       # Servicios de pago
│   ├── AuthService.ts
│   ├── SorteoService.ts
│   └── PaymentServiceFactory.ts
├── stores/             # Estado global (Pinia)
│   ├── authStore.ts
│   └── sorteoStore.ts
├── types/              # Definiciones TypeScript
├── utils/              # Utilidades
├── views/              # Páginas
└── router/             # Configuración de rutas
```

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `VITE_JWT_SECRET` | Secreto para JWT | ✅ |
| `VITE_PAYPAL_CLIENT_ID` | ID de cliente PayPal | ✅ |
| `VITE_MERCADOPAGO_ACCESS_TOKEN` | Token de MercadoPago | ✅ |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe | ✅ |
| `VITE_SORTEO_DURACION_HORAS` | Duración del sorteo | ❌ |
| `VITE_PRECIO_NUMERO` | Precio por número | ❌ |
| `VITE_MONEDA` | Moneda del sorteo | ❌ |

### Pasarelas de Pago

#### PayPal
```typescript
const paypalService = new PayPalService()
const response = await paypalService.procesarPago(compra)
```

#### MercadoPago
```typescript
const mpService = new MercadoPagoService()
const response = await mpService.procesarPago(compra)
```

#### Stripe
```typescript
const stripeService = new StripeService()
const response = await stripeService.procesarPago(compra)
```

## 🎨 UI/UX

### Diseño Minimalista
- **Colores**: Paleta de azules y grises
- **Tipografía**: Inter (Google Fonts)
- **Componentes**: Reutilizables y consistentes
- **Animaciones**: Suaves y profesionales

### Responsive Design
- **Mobile First**: Optimizado para móviles
- **Breakpoints**: sm, md, lg, xl
- **Grid System**: CSS Grid y Flexbox

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Preview
npm run preview

# Linting
npm run lint

# Type Check
npm run type-check
```

## 🔒 Seguridad

- **Variables de entorno**: Datos sensibles protegidos
- **Validación de formularios**: Frontend y backend
- **Autenticación JWT**: Tokens seguros
- **HTTPS**: Comunicación encriptada

## 📱 Funcionalidades

### Para Usuarios
- ✅ Registro/Login simple
- ✅ Visualización del countdown
- ✅ Monto acumulado en tiempo real
- ✅ Compra de números
- ✅ Múltiples métodos de pago

### Para Administradores
- ✅ Gestión de sorteos
- ✅ Monitoreo de ventas
- ✅ Configuración de precios
- ✅ Reportes de transacciones

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Tests con coverage
npm run test:coverage
```

## 📈 Performance

- **Lazy Loading**: Componentes cargados bajo demanda
- **Tree Shaking**: Código no utilizado eliminado
- **Code Splitting**: Bundles optimizados
- **Caching**: Estrategias de caché implementadas

## 🚀 Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte, envía un email a soporte@sorteoapp.com o crea un issue en GitHub.

---

**Desarrollado con ❤️ usando Vue 3 + TypeScript**

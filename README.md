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

## 🛠️ Tecnologías Necesarias

### Requisitos del Sistema
- **Node.js**: Versión 18.0.0 o superior
- **npm**: Versión 8.0.0 o superior (incluido con Node.js)
- **Git**: Para clonar el repositorio

### Stack Tecnológico
- **Frontend**: Vue 3.4.0, TypeScript 5.2.2, Vite 5.0.0
- **Styling**: Tailwind CSS 3.3.6, PostCSS 8.4.32
- **State Management**: Pinia 2.1.7
- **Routing**: Vue Router 4.2.5
- **HTTP Client**: Axios 1.6.2
- **Pagos**: 
  - PayPal (@paypal/react-paypal-js 8.1.3)
  - MercadoPago (mercadopago 1.5.14)
  - Stripe (@stripe/stripe-js 2.2.0)
- **Utilidades**: date-fns 2.30.0, clsx 2.0.0, tailwind-merge 2.0.0
- **Desarrollo**: ESLint, TypeScript, Vue TSC

## 📦 Instalación y Configuración

### Prerrequisitos
Asegúrate de tener instalado:
- **Node.js** (versión 18.0.0 o superior)
- **npm** (versión 8.0.0 o superior)
- **Git**

### Pasos de Instalación

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
   # JWT Secret (requerido)
   VITE_JWT_SECRET=tu_jwt_secret_muy_seguro
   
   # PayPal (requerido)
   VITE_PAYPAL_CLIENT_ID=tu_paypal_client_id
   
   # MercadoPago (requerido)
   VITE_MERCADOPAGO_ACCESS_TOKEN=tu_mercadopago_token
   
   # Stripe (requerido)
   VITE_STRIPE_PUBLISHABLE_KEY=tu_stripe_key
   
   # Configuración del sorteo (opcional)
   VITE_SORTEO_DURACION_HORAS=24
   VITE_PRECIO_NUMERO=1000
   VITE_MONEDA=CLP
   ```

## 🚀 Cómo Ejecutar el Proyecto

### Inicio Rápido
```bash
# 1. Clonar y entrar al directorio
git clone <repository-url>
cd sorteo

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp env.example .env
# Editar .env con tus credenciales

# 4. Ejecutar en desarrollo
npm run dev
```

### Desarrollo
```bash
npm run dev
```
- Abre tu navegador en `http://localhost:5173`
- El servidor se recarga automáticamente al hacer cambios
- Hot Module Replacement (HMR) habilitado

### Construcción para Producción
```bash
npm run build
```
- Genera archivos optimizados en la carpeta `dist/`
- Incluye minificación y tree-shaking
- Optimización automática de assets

### Preview de Producción
```bash
npm run preview
```
- Sirve la versión construida localmente
- Útil para probar antes del deploy
- Simula el comportamiento en producción

### Scripts Disponibles
```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Preview
npm run preview

# Linting (corrección automática)
npm run lint

# Verificación de tipos
npm run type-check
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
sorteo/
├── src/                           # Código fuente principal
│   ├── components/                # Componentes Vue reutilizables
│   │   ├── ui/                   # Componentes base del sistema de diseño
│   │   │   ├── BaseButton.vue    # Botón reutilizable
│   │   │   ├── BaseCard.vue      # Tarjeta contenedora
│   │   │   └── BaseInput.vue     # Input personalizado
│   │   ├── CountdownTimer.vue    # Temporizador del sorteo
│   │   ├── MontoAcumulado.vue    # Visualización del dinero recaudado
│   │   ├── LoginForm.vue         # Formulario de autenticación
│   │   └── CompraForm.vue        # Formulario de compra de números
│   ├── services/                 # Lógica de negocio y APIs
│   │   ├── interfaces/           # Contratos e interfaces (Principio DIP)
│   │   │   ├── IApiClient.ts     # Interface para cliente HTTP
│   │   │   ├── IAuthService.ts   # Interface para autenticación
│   │   │   ├── IPaymentService.ts # Interface para pagos
│   │   │   └── ISorteoService.ts # Interface para sorteos
│   │   ├── payments/             # Implementaciones de pasarelas de pago
│   │   │   ├── MercadoPagoService.ts
│   │   │   ├── PayPalService.ts
│   │   │   └── StripeService.ts
│   │   ├── ApiClient.ts          # Cliente HTTP con Axios
│   │   ├── AuthService.ts        # Servicio de autenticación
│   │   ├── SorteoService.ts      # Servicio de sorteos
│   │   └── PaymentServiceFactory.ts # Factory para servicios de pago
│   ├── stores/                   # Estado global con Pinia
│   │   ├── authStore.ts          # Store de autenticación
│   │   └── sorteoStore.ts        # Store de sorteos
│   ├── types/                    # Definiciones TypeScript
│   │   ├── index.ts              # Tipos principales
│   │   └── env.d.ts              # Tipos de variables de entorno
│   ├── utils/                    # Utilidades y helpers
│   │   └── cn.ts                 # Utilidad para clases CSS
│   ├── views/                    # Páginas/Vistas principales
│   │   └── Home.vue              # Página principal
│   ├── router/                   # Configuración de rutas
│   │   └── index.ts              # Definición de rutas
│   ├── config/                   # Configuración
│   │   └── env.ts                # Configuración de variables de entorno
│   ├── composables/              # Composables de Vue 3
│   ├── assets/                   # Recursos estáticos
│   ├── App.vue                   # Componente raíz
│   ├── main.ts                   # Punto de entrada
│   └── index.css                 # Estilos globales
├── public/                       # Archivos públicos
├── node_modules/                 # Dependencias (ignorado por Git)
├── .env.example                  # Ejemplo de variables de entorno
├── .gitignore                    # Archivos ignorados por Git
├── index.html                    # HTML principal
├── package.json                  # Dependencias y scripts
├── package-lock.json            # Lock de dependencias
├── tailwind.config.js            # Configuración de Tailwind
├── postcss.config.js             # Configuración de PostCSS
├── tsconfig.json                 # Configuración de TypeScript
├── tsconfig.node.json            # Configuración de TypeScript para Node
├── vite.config.ts                # Configuración de Vite
└── README.md                     # Documentación del proyecto
```

### Descripción de Carpetas

- **`/components`**: Componentes Vue reutilizables organizados por funcionalidad
- **`/services`**: Lógica de negocio siguiendo principios SOLID
- **`/stores`**: Estado global usando Pinia para gestión de estado
- **`/types`**: Definiciones TypeScript para tipado fuerte
- **`/utils`**: Funciones utilitarias y helpers
- **`/views`**: Páginas principales de la aplicación
- **`/router`**: Configuración de navegación con Vue Router
- **`/config`**: Archivos de configuración del proyecto

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

## 🔧 Troubleshooting

### Problemas Comunes

**Error: "Cannot find module"**
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
```

**Error de TypeScript**
```bash
# Verificar tipos
npm run type-check
```

**Error de variables de entorno**
- Verificar que el archivo `.env` existe
- Comprobar que las variables tienen el prefijo `VITE_`
- Reiniciar el servidor de desarrollo

**Error de puerto ocupado**
```bash
# Usar puerto diferente
npm run dev -- --port 3000
```

### Verificación de Instalación

```bash
# Verificar Node.js
node --version  # Debe ser >= 18.0.0

# Verificar npm
npm --version   # Debe ser >= 8.0.0

# Verificar instalación de dependencias
npm list --depth=0
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

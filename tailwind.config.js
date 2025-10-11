/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Blanco & Dorado Premium
        // Fondo principal - Blanco crema cálido
        'crema': '#FDFCF9',
        // Dorado Champagne (Acento Principal)
        'dorado': '#C9A961',
        // Dorado Antiguo (Dorado Oscuro)
        'dorado-oscuro': '#8B7355',
        // Champagne Claro (Dorado Suave)
        'dorado-claro': '#E8D7B7',
        // Texto Principal - Gris Oscuro
        'texto-principal': '#2D2D2D',
        // Texto Secundario - Gris Medio
        'texto-secundario': '#6B6B6B',
        // Bordes y Divisores - Beige Claro
        'bordes': '#E8E4DD',
        // Blanco puro para contraste
        'blanco-puro': '#FFFFFF',

        // Colores legacy (mantenidos para compatibilidad)
        'gris-oscuro': '#2D2D2D',
        'blanco-calido': '#FDFCF9',
        'gris-medio': '#6B6B6B',
        'gris-claro': '#E8E4DD',

        // Colores adicionales para compatibilidad
        primary: {
          50: '#FDFCF9',   // crema
          100: '#F5F2EB',  // crema más oscuro
          200: '#E8D7B7',  // dorado-claro
          300: '#C9A961',  // dorado
          400: '#C9A961',  // dorado
          500: '#C9A961',  // dorado
          600: '#8B7355',  // dorado-oscuro
          700: '#6B6B6B',  // texto-secundario
          800: '#2D2D2D',  // texto-principal
          900: '#2D2D2D',  // texto-principal
        },
        secondary: {
          50: '#FDFCF9',   // crema
          100: '#E8E4DD',  // bordes
          200: '#E8E4DD',  // bordes
          300: '#6B6B6B',  // texto-secundario
          400: '#6B6B6B',  // texto-secundario
          500: '#6B6B6B',  // texto-secundario
          600: '#2D2D2D',  // texto-principal
          700: '#2D2D2D',  // texto-principal
          800: '#2D2D2D',  // texto-principal
          900: '#2D2D2D',  // texto-principal
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-dorado': 'linear-gradient(135deg, #C9A961 0%, #E8D7B7 50%, #C9A961 100%)',
        'gradient-dorado-hover': 'linear-gradient(135deg, #8B7355 0%, #C9A961 50%, #8B7355 100%)',
        'gradient-dorado-sutil': 'linear-gradient(to bottom, #FDFCF9 0%, #F5F2EB 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}

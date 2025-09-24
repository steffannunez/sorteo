/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gris Oscuro Principal (Base)
        'gris-oscuro': '#212121',
        // Dorado Brillante (Acento Principal)
        'dorado': '#D4AF37',
        // Blanco Cálido (Texto y Contenido Principal)
        'blanco-calido': '#F8F8F8',
        // Gris Medio (Elementos Secundarios)
        'gris-medio': '#616161',
        // Gris Claro (Fondo Secundario o Destacado)
        'gris-claro': '#E0E0E0',
        // Colores adicionales para compatibilidad
        primary: {
          50: '#F8F8F8',   // blanco-calido
          100: '#E0E0E0',  // gris-claro
          200: '#E0E0E0',  // gris-claro
          300: '#616161',  // gris-medio
          400: '#616161',  // gris-medio
          500: '#D4AF37',  // dorado
          600: '#D4AF37',  // dorado
          700: '#212121',  // gris-oscuro
          800: '#212121',  // gris-oscuro
          900: '#212121',  // gris-oscuro
        },
        secondary: {
          50: '#F8F8F8',   // blanco-calido
          100: '#E0E0E0',  // gris-claro
          200: '#E0E0E0',  // gris-claro
          300: '#616161',  // gris-medio
          400: '#616161',  // gris-medio
          500: '#616161',  // gris-medio
          600: '#616161',  // gris-medio
          700: '#212121',  // gris-oscuro
          800: '#212121',  // gris-oscuro
          900: '#212121',  // gris-oscuro
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-dorado': 'linear-gradient(135deg,rgb(192, 150, 12) 0%,rgb(255, 233, 107) 50%,rgb(233, 154, 7) 100%)',
        'gradient-dorado-hover': 'linear-gradient(135deg, #B8941F 0%, #E6C200 50%, #E69400 100%)',
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

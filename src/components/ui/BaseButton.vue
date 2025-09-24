<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

interface Props {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variantClasses = {
    default: 'bg-gradient-dorado text-gris-medio hover:bg-gradient-dorado-hover font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gris-medio bg-transparent text-blanco-calido hover:bg-gris-claro hover:text-gris-oscuro',
    secondary: 'bg-gris-claro text-gris-oscuro hover:bg-gris-claro/80',
    ghost: 'text-gris-medio hover:bg-gris-claro hover:text-gris-oscuro',
    link: 'underline-offset-4 hover:underline text-dorado',
  }
  
  const sizeClasses = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
    icon: 'h-10 w-10',
  }
  
  return cn(
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    props.class
  )
})
</script>

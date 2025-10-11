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
  const baseClasses = 'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

  const variantClasses = {
    default: 'bg-gradient-dorado text-blanco-puro hover:bg-gradient-dorado-hover font-semibold shadow-lg hover:shadow-xl hover:shadow-dorado/30 transform hover:scale-[1.02] border border-dorado-oscuro/20',
    destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg',
    outline: 'border-2 border-dorado bg-transparent text-dorado hover:bg-dorado hover:text-blanco-puro shadow-sm hover:shadow-md',
    secondary: 'bg-dorado-claro text-texto-principal hover:bg-dorado-claro/80 shadow-sm',
    ghost: 'text-texto-secundario hover:bg-dorado-claro/30 hover:text-dorado-oscuro',
    link: 'underline-offset-4 hover:underline text-dorado hover:text-dorado-oscuro',
  }

  const sizeClasses = {
    default: 'h-11 py-2.5 px-5',
    sm: 'h-9 px-3 text-xs',
    lg: 'h-12 px-8 text-base',
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

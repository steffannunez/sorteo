<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="px-6 py-4 border-b border-bordes bg-gradient-to-r from-dorado-claro/20 to-transparent">
      <slot name="header" />
    </div>
    <div class="p-6">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-bordes bg-crema">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

interface Props {
  class?: string
  variant?: 'default' | 'elevated' | 'outlined'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const cardClasses = computed(() => {
  const baseClasses = 'rounded-xl border bg-blanco-puro text-texto-principal shadow-sm backdrop-blur-sm'

  const variants = {
    default: 'border-bordes shadow-md',
    elevated: 'border-dorado-claro shadow-xl shadow-dorado-claro/20',
    outlined: 'border-dorado shadow-none',
  }

  return cn(baseClasses, variants[props.variant], props.class)
})
</script>

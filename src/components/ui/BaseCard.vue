<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="px-6 py-4 border-b border-gris-medio">
      <slot name="header" />
    </div>
    <div class="p-6">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-gris-medio bg-gris-claro">
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
  const baseClasses = 'rounded-lg border bg-gris-claro text-gris-oscuro shadow-sm'
  
  const variants = {
    default: 'border-gris-medio',
    elevated: 'border-gris-medio shadow-lg',
    outlined: 'border-gris-medio shadow-none',
  }
  
  return cn(baseClasses, variants[props.variant], props.class)
})
</script>

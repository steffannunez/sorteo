<script setup lang="ts">
import { ref } from 'vue'

interface Rule {
  text: string
  icon?: string
}

interface Props {
  title?: string
  rules: Rule[]
  tips?: string[]
  startCollapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '📖 Cómo jugar',
  startCollapsed: true
})

const isExpanded = ref(!props.startCollapsed)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="game-tutorial w-full mt-4 border-t-2 border-gray-200 pt-4">
    <button
      @click="toggleExpanded"
      class="w-full flex items-center justify-between text-left px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-lg transition-all duration-300 shadow-sm"
      :class="{ 'rounded-b-none': isExpanded }"
    >
      <div class="flex items-center gap-3">
        <span class="text-2xl">{{ isExpanded ? '📘' : '📕' }}</span>
        <h3 class="font-bold text-lg text-gray-800">{{ title }}</h3>
      </div>
      <svg
        class="w-5 h-5 text-gray-600 transition-transform duration-300"
        :class="{ 'rotate-180': isExpanded }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition
      name="expand"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @leave="onLeave"
    >
      <div v-show="isExpanded" class="tutorial-content">
        <div class="bg-white border-2 border-t-0 border-indigo-100 rounded-b-lg px-6 py-4 space-y-4">
          <!-- Rules Section -->
          <div class="rules-section">
            <ul class="space-y-3">
              <li
                v-for="(rule, index) in rules"
                :key="index"
                class="flex items-start gap-3 text-gray-700"
              >
                <span class="text-lg flex-shrink-0 mt-0.5">
                  {{ rule.icon || '✓' }}
                </span>
                <span class="text-sm leading-relaxed">{{ rule.text }}</span>
              </li>
            </ul>
          </div>

          <!-- Tips Section (optional) -->
          <div v-if="tips && tips.length > 0" class="tips-section pt-3 border-t border-gray-200">
            <h4 class="font-semibold text-amber-700 mb-2 flex items-center gap-2">
              <span>💡</span>
              <span>Consejos útiles</span>
            </h4>
            <ul class="space-y-2">
              <li
                v-for="(tip, index) in tips"
                :key="index"
                class="text-sm text-gray-600 flex items-start gap-2"
              >
                <span class="text-amber-500">•</span>
                <span>{{ tip }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Smooth expand/collapse animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 1000px;
}

.tutorial-content {
  overflow: hidden;
}
</style>

<script lang="ts">
// Animation hooks for smooth height transitions
function onEnter(el: Element) {
  const element = el as HTMLElement
  element.style.maxHeight = '0'
  element.offsetHeight // Force reflow
  element.style.maxHeight = element.scrollHeight + 'px'
}

function onAfterEnter(el: Element) {
  const element = el as HTMLElement
  element.style.maxHeight = 'none'
}

function onLeave(el: Element) {
  const element = el as HTMLElement
  element.style.maxHeight = element.scrollHeight + 'px'
  element.offsetHeight // Force reflow
  element.style.maxHeight = '0'
}
</script>

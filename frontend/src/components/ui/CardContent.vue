<template>
  <div :class="cardContentClass">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: {
    type: String,
    default: ''
  }
})

const cardContentClass = computed(() => {
  return cn('p-6 pt-0', props.class)
})
</script>

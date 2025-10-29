<template>
  <label :class="labelClass" :for="htmlFor">
    <slot />
  </label>
</template>

<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  htmlFor: {
    type: String,
    default: ''
  },
  class: {
    type: String,
    default: ''
  }
})

const labelClass = computed(() => {
  return cn(
    'text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    props.class
  )
})
</script>

<template>
  <div class="flex items-center space-x-2">
    <input
      :id="id"
      type="checkbox"
      :checked="checked"
      @change="$emit('update:checked', $event.target.checked)"
      :class="checkboxClass"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  checked: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: ''
  }
})

defineEmits(['update:checked'])

const checkboxClass = computed(() => {
  return cn(
    'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    props.class
  )
})
</script>

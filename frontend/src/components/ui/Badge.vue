<template>
  <span :class="badgeClass"><slot /></span>
</template>

<script setup>
const props = defineProps({
  variant: { type: String, default: 'default' }
})

const variantMap = {
  default: 'bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-sm',
  success: 'bg-green-100 text-green-800 px-2 py-0.5 rounded text-sm',
  warning: 'bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-sm',
  destructive: 'bg-red-100 text-red-800 px-2 py-0.5 rounded text-sm',
}

const badgeClass = variantMap[props.variant] || variantMap.default
</script>

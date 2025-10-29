<template>
  <div class="w-full bg-[hsl(var(--nav-background))] border-b border-gray-200 py-4">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-end gap-6 px-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="$emit('tab-change', tab.id)"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
            activeTab === tab.id
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          <component :is="tab.icon" class="w-8 h-8" />
          <span class="text-sm">{{ tab.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { User, Car, Settings } from 'lucide-vue-next'

defineProps({
  activeTab: {
    type: String,
    required: true
  }
})

defineEmits(['tab-change'])

const tabs = [
  { id: 'profile', label: 'Mi Perfil', icon: User },
  { id: 'parking', label: 'Estacionamientos', icon: Car },
  { id: 'settings', label: 'Configuración', icon: Settings }
]
</script>

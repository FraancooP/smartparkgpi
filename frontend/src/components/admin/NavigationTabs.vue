<template>
  <div class="w-full bg-gradient-to-r from-blue-50 to-green-50 border-b border-blue-100 py-4">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-center gap-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="$emit('tab-change', tab.id)"
          :class="[
            'flex flex-col items-center gap-2 p-6 rounded-lg h-auto transition-all duration-200',
            activeTab === tab.id
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
              : 'text-blue-700 hover:bg-blue-100 hover:text-blue-800'
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

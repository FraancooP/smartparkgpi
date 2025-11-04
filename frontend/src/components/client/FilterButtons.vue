<template>
  <div class="absolute top-24 left-1/2 transform -translate-x-1/2 z-20">
    <div class="flex space-x-3">
      <button
        @click="toggleFilter('auto')"
        :class="[
          'flex items-center space-x-2 rounded-full h-10 px-6 shadow-lg hover:shadow-xl transition-all duration-200',
          selected === 'auto' 
            ? 'bg-blue-600 text-white' 
            : 'bg-white/95 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-slate-50'
        ]"
      >
        <Car class="h-4 w-4" />
        <span class="font-medium">Auto</span>
      </button>
      
      <button
        @click="toggleFilter('moto')"
        :class="[
          'flex items-center space-x-2 rounded-full h-10 px-6 shadow-lg hover:shadow-xl transition-all duration-200',
          selected === 'moto' 
            ? 'bg-blue-600 text-white' 
            : 'bg-white/95 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-slate-50'
        ]"
      >
        <Bike class="h-4 w-4" />
        <span class="font-medium">Moto</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { Car, Bike } from 'lucide-vue-next'

const props = defineProps({
  selected: {
    type: String,
    default: 'auto'
  }
})

const emit = defineEmits(['update:selected'])

const toggleFilter = (type) => {
  // Si ya está seleccionado, deseleccionar; si no, seleccionar
  emit('update:selected', props.selected === type ? null : type)
}
</script>

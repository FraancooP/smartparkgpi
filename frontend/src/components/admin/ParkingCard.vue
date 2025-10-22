<template>
  <Card 
    class="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white border-green-100 hover:border-green-300"
    @click="$emit('click')"
  >
    <CardContent class="p-0">
      <div class="relative overflow-hidden">
        <img
          :src="parking.image"
          :alt="parking.name"
          class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          @error="handleImageError"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span :class="[
            'text-sm',
            occupancyRate > 80 ? 'text-red-600' : occupancyRate > 50 ? 'text-orange-600' : 'text-green-600'
          ]">
            {{ occupancyRate }}% ocupado
          </span>
        </div>
      </div>
      <div class="p-6">
        <h3 class="mb-2 text-lg font-semibold text-slate-800 group-hover:text-green-700 transition-colors">
          {{ parking.name }}
        </h3>
        <p class="text-sm text-slate-600 mb-2">{{ parking.location }}</p>
        <div class="flex justify-between items-center text-sm">
          <span class="text-slate-500">{{ parking.spaces }} plazas totales</span>
          <span :class="availableSpaces > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
            {{ availableSpaces }} disponibles
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'

const props = defineProps({
  parking: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const occupiedSpaces = computed(() => props.parking.occupiedSpaces || 0)
const availableSpaces = computed(() => props.parking.spaces - occupiedSpaces.value)
const occupancyRate = computed(() => Math.round((occupiedSpaces.value / props.parking.spaces) * 100))

const handleImageError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1558457738-f199ff9dbf82?w=400&h=300&fit=crop&auto=format&q=80'
}
</script>

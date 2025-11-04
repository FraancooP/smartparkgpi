<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
    <!-- Overlay con blur -->
    <div 
      class="absolute inset-0 bg-black/20 backdrop-blur-sm"
      @click="$emit('close')"
    />
    
    <!-- Modal -->
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slideUp">
      <!-- Header con imagen -->
      <div class="relative h-48 overflow-hidden">
        <img
          :src="parking.image"
          :alt="parking.name"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        <!-- Botón cerrar -->
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full h-8 w-8 flex items-center justify-center transition shadow-lg"
        >
          <X class="h-4 w-4 text-slate-700" />
        </button>
        
        <!-- Rating y distancia -->
        <div class="absolute bottom-4 left-4 flex items-center space-x-3">
          <div class="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
            <Star class="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
            <span class="text-xs font-medium">{{ parking.rating }}</span>
          </div>
          <div class="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
            <MapPinIcon class="h-3 w-3 text-slate-600 mr-1" />
            <span class="text-xs font-medium">{{ parking.distance }}</span>
          </div>
        </div>
      </div>
      
      <!-- Contenido -->
      <div class="p-6 space-y-6">
        <!-- Nombre y disponibilidad -->
        <div class="space-y-3">
          <h2 class="text-xl font-bold text-slate-800">{{ parking.name }}</h2>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div 
                class="w-4 h-4 rounded-full"
                :class="getColorClass(parking.color)"
              />
              <span class="text-sm text-slate-600">
                {{ parking.availableSpots }} de {{ parking.totalSpots }} lugares disponibles
              </span>
            </div>
            <span 
              class="px-3 py-1 rounded-full text-xs font-semibold"
              :class="getBadgeClass(parking.color)"
            >
              {{ getAvailabilityText(parking.color) }}
            </span>
          </div>
        </div>
        
        <!-- Dirección -->
        <div v-if="parking.address" class="flex items-start space-x-2 text-sm text-slate-600">
          <MapPinIcon class="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{{ parking.address }}</span>
        </div>
        
        <!-- Horarios y precio -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <div class="flex items-center text-sm text-slate-500">
              <Clock class="h-4 w-4 mr-2" />
              Horarios
            </div>
            <p class="text-sm">
              <span class="font-medium text-slate-700">
                {{ parking.openTime === '24h' ? '24 horas' : `${parking.openTime} - ${parking.closeTime}` }}
              </span>
            </p>
          </div>
          
          <div class="space-y-1">
            <p class="text-sm text-slate-500">Precio por hora</p>
            <p class="text-lg font-bold text-blue-600">
              ${{ parking.pricePerHour }}
            </p>
          </div>
        </div>
        
        <!-- Botones de acción -->
        <div class="space-y-3 pt-2">
          <div class="grid grid-cols-2 gap-3">
            <button
              @click="handleReserveNow"
              class="h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-md hover:shadow-lg"
            >
              Reservar ahora
            </button>
            
            <button
              @click="handleSchedule"
              class="h-12 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl font-semibold transition flex items-center justify-center space-x-2"
            >
              <Calendar class="h-4 w-4" />
              <span>Programar</span>
            </button>
          </div>
          
          <button
            @click="handleDirections"
            class="w-full h-10 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition flex items-center justify-center space-x-2"
          >
            <Navigation class="h-4 w-4" />
            <span>Cómo llegar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X, Clock, MapPinIcon, Star, Calendar, Navigation } from 'lucide-vue-next'

defineProps({
  parking: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const getColorClass = (color) => {
  return {
    red: 'bg-red-600',
    yellow: 'bg-yellow-500',
    green: 'bg-green-600'
  }[color]
}

const getBadgeClass = (color) => {
  return {
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800'
  }[color]
}

const getAvailabilityText = (color) => {
  return {
    red: 'Lleno',
    yellow: 'Casi lleno',
    green: 'Disponible'
  }[color]
}

const handleReserveNow = () => {
  console.log('Reservar ahora')
  // Aquí iría la lógica de reserva inmediata
}

const handleSchedule = () => {
  console.log('Programar reserva')
  // Aquí iría la lógica de reserva programada
}

const handleDirections = () => {
  console.log('Mostrar direcciones')
  // Aquí iría la lógica para abrir Google Maps o similar
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out;
}
</style>

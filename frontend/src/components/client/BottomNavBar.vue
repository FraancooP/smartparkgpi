<template>
  <div class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
    <div class="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-full shadow-xl px-6 py-3">
      <div class="flex items-center space-x-6">
        <!-- Vehículos -->
        <button 
          @click="navigate('vehicles')"
          :class="[
            'rounded-full h-12 w-12 transition-all duration-200',
            currentView === 'vehicles' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-slate-600 hover:bg-slate-100'
          ]"
        >
          <Car class="h-6 w-6 mx-auto" />
        </button>
        
        <!-- Configuración -->
        <button 
          @click="navigate('settings')"
          :class="[
            'rounded-full h-12 w-12 transition-all duration-200',
            currentView === 'settings' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-slate-600 hover:bg-slate-100'
          ]"
        >
          <Settings class="h-6 w-6 mx-auto" />
        </button>
        
        <!-- Botón central del mapa - más prominente -->
        <button 
          @click="navigate('map')"
          :class="[
            'rounded-full h-14 w-14 shadow-lg transition-all duration-200',
            currentView === 'map' 
              ? 'bg-blue-600 text-white scale-105' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          ]"
        >
          <MapPin class="h-7 w-7 mx-auto" />
        </button>
        
        <!-- Perfil -->
        <button 
          @click="navigate('profile')"
          :class="[
            'rounded-full h-12 w-12 transition-all duration-200',
            currentView === 'profile' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-slate-600 hover:bg-slate-100'
          ]"
        >
          <User class="h-6 w-6 mx-auto" />
        </button>
        
        <!-- Acciones rápidas -->
        <button 
          @click="navigate('quickActions')"
          :class="[
            'rounded-full h-12 w-12 transition-all duration-200',
            currentView === 'quickActions' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-slate-600 hover:bg-slate-100'
          ]"
        >
          <Plus class="h-6 w-6 mx-auto" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MapPin, Car, Settings, User, Plus } from 'lucide-vue-next'

const props = defineProps({
  currentView: {
    type: String,
    default: 'map'
  }
})

const emit = defineEmits(['update:currentView'])

const navigate = (view) => {
  emit('update:currentView', view)
}
</script>

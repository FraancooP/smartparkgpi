<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 pb-8">
      <div class="flex items-center justify-between">
        <button
          @click="$emit('close')"
          class="text-white hover:bg-white/20 rounded-lg px-3 py-2 transition"
        >
          ← Volver
        </button>
        <h1 class="text-xl font-semibold">Mis Vehículos</h1>
        <div class="w-16"></div>
      </div>
    </div>

    <!-- Contenido -->
    <div class="p-6 space-y-8 -mt-4">
      <!-- Filtros centralizados -->
      <div class="flex justify-center">
        <div class="flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 space-x-2 shadow-lg">
          <button
            @click="selectedFilter = 'auto'"
            :class="[
              'h-14 px-8 rounded-xl flex items-center space-x-3 transition-all duration-200',
              selectedFilter === 'auto'
                ? 'bg-blue-500 text-white shadow-md'
                : 'hover:bg-blue-50 text-blue-600'
            ]"
          >
            <Car class="h-6 w-6" />
            <div class="text-left">
              <div class="font-medium">Autos</div>
              <div class="text-xs opacity-80">
                {{ vehicles.filter(v => v.type === 'auto').length }} registrado{{ vehicles.filter(v => v.type === 'auto').length !== 1 ? 's' : '' }}
              </div>
            </div>
          </button>
          
          <button
            @click="selectedFilter = 'moto'"
            :class="[
              'h-14 px-8 rounded-xl flex items-center space-x-3 transition-all duration-200',
              selectedFilter === 'moto'
                ? 'bg-green-500 text-white shadow-md'
                : 'hover:bg-green-50 text-green-600'
            ]"
          >
            <Bike class="h-6 w-6" />
            <div class="text-left">
              <div class="font-medium">Motos</div>
              <div class="text-xs opacity-80">
                {{ vehicles.filter(v => v.type === 'moto').length }} registrado{{ vehicles.filter(v => v.type === 'moto').length !== 1 ? 's' : '' }}
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Título de la sección -->
      <div class="text-center">
        <h2 class="text-xl font-semibold text-slate-800">
          {{ selectedFilter === 'auto' ? 'Mis Autos' : 'Mis Motos' }}
        </h2>
        <p class="text-sm text-slate-600 mt-1">
          {{ filteredVehicles.length }} vehículo{{ filteredVehicles.length !== 1 ? 's' : '' }} registrado{{ filteredVehicles.length !== 1 ? 's' : '' }}
        </p>
      </div>

      <!-- Botón registrar vehículo -->
      <div class="flex justify-center">
        <button
          @click="showRegistrationForm = true"
          :class="[
            'h-14 px-6 border-2 border-dashed rounded-xl flex items-center space-x-3 transition-all duration-200',
            selectedFilter === 'auto'
              ? 'border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400'
              : 'border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400'
          ]"
        >
          <Plus class="h-5 w-5" />
          <span>Registrar {{ selectedFilter === 'auto' ? 'un auto' : 'una moto' }}</span>
        </button>
      </div>

      <!-- Grid de vehículos -->
      <div v-if="filteredVehicles.length > 0" class="flex flex-wrap gap-4 justify-center">
        <Card
          v-for="vehicle in filteredVehicles"
          :key="vehicle.id"
          class="p-4 bg-gradient-to-br from-white to-slate-50 border-2 hover:border-blue-300 transition-all duration-200 hover:shadow-lg min-w-40 max-w-48"
        >
          <div class="space-y-3">
            <!-- Imagen del vehículo si existe -->
            <div v-if="vehicle.image" class="w-full h-24 rounded-lg overflow-hidden">
              <img 
                :src="vehicle.image" 
                :alt="vehicle.name"
                class="w-full h-full object-cover"
              />
            </div>
            
            <div class="flex items-center justify-between">
              <Car v-if="vehicle.type === 'auto'" class="h-6 w-6 text-blue-600" />
              <Bike v-else class="h-6 w-6 text-green-600" />
              <button
                class="h-8 w-8 hover:bg-slate-100 rounded-full flex items-center justify-center transition"
              >
                <Settings class="h-4 w-4 text-slate-600" />
              </button>
            </div>
            
            <div class="space-y-1">
              <p class="font-medium text-slate-800">{{ vehicle.name }}</p>
              <p class="text-sm text-slate-600 font-mono">{{ vehicle.plate }}</p>
              <p class="text-xs text-slate-500">{{ vehicle.model }}</p>
            </div>
          </div>
        </Card>
      </div>

      <!-- Mensaje cuando no hay vehículos -->
      <div v-if="filteredVehicles.length === 0" class="text-center py-12">
        <div class="inline-block p-6 bg-white/50 rounded-2xl">
          <Car v-if="selectedFilter === 'auto'" class="h-16 w-16 mx-auto text-slate-300 mb-4" />
          <Bike v-else class="h-16 w-16 mx-auto text-slate-300 mb-4" />
          <p class="text-slate-600 mb-2">No tenés {{ selectedFilter === 'auto' ? 'autos' : 'motos' }} registrados</p>
          <p class="text-sm text-slate-500">Registrá tu primer vehículo para comenzar</p>
        </div>
      </div>
    </div>

    <!-- Modal de registro (simplificado) -->
    <div v-if="showRegistrationForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h3 class="text-xl font-bold mb-4">Registrar {{ selectedFilter === 'auto' ? 'Auto' : 'Moto' }}</h3>
        <p class="text-slate-600 text-sm mb-6">Formulario de registro en desarrollo</p>
        <button
          @click="showRegistrationForm = false"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Car, Bike, Plus, Settings } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'

defineEmits(['close'])

const selectedFilter = ref('auto')
const showRegistrationForm = ref(false)

// Datos simulados de vehículos
const vehicles = ref([
  { id: '1', type: 'auto', name: 'Mi Auto', plate: 'ABC 123', model: 'Toyota Corolla 2020' },
  { id: '2', type: 'auto', name: 'Auto Familiar', plate: 'XYZ 789', model: 'Honda Civic 2019' },
  { id: '3', type: 'moto', name: 'Mi Moto', plate: 'MOT 456', model: 'Honda Wave 110' },
  { id: '4', type: 'auto', name: 'Auto Trabajo', plate: 'DEF 456', model: 'Ford Focus 2021' }
])

const filteredVehicles = computed(() => {
  return vehicles.value.filter(v => v.type === selectedFilter.value)
})
</script>

<template>
  <div class="relative w-full h-screen overflow-hidden bg-slate-100">
    <!-- Vista del Mapa -->
    <div v-if="currentView === 'map'" class="relative w-full h-full">
      <!-- Mapa de OpenStreetMap -->
      <MapView 
        :parkings="parkings"
        :searched-location="searchedLocation"
        @select-parking="handleSelectParking"
      />
      
      <!-- Barra de búsqueda superior -->
      <SearchBar 
        @location-selected="handleLocationSelected"
      />
      
      <!-- Filtros de vehículos -->
      <FilterButtons 
        v-model:selected="selectedVehicleType"
      />
      
      <!-- Modal de estacionamiento -->
      <ParkingModal
        v-if="selectedParking"
        :parking="selectedParking"
        @close="selectedParking = null"
      />
    </div>
    
    <!-- Otras vistas (vehicles, profile, settings, quickActions) -->
    <div v-else-if="currentView === 'vehicles'" class="pb-24">
      <VehicleManagement @close="currentView = 'map'" />
    </div>
    
    <div v-else-if="currentView === 'profile'" class="pb-24">
      <UserProfile @close="currentView = 'map'" />
    </div>
    
    <div v-else-if="currentView === 'settings'" class="pb-24">
      <ClientSettings @close="currentView = 'map'" />
    </div>
    
    <div v-else-if="currentView === 'quickActions'" class="pb-24">
      <QuickActions @close="currentView = 'map'" />
    </div>
    
    <!-- Barra de navegación inferior -->
    <BottomNavBar
      v-model:current-view="currentView"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MapView from '@/components/client/MapView.vue'
import SearchBar from '@/components/client/SearchBar.vue'
import FilterButtons from '@/components/client/FilterButtons.vue'
import ParkingModal from '@/components/client/ParkingModal.vue'
import BottomNavBar from '@/components/client/BottomNavBar.vue'
import VehicleManagement from '@/components/client/VehicleManagement.vue'
import UserProfile from '@/components/client/UserProfile.vue'
import ClientSettings from '@/components/client/ClientSettings.vue'
import QuickActions from '@/components/client/QuickActions.vue'
import Button from '@/components/ui/Button.vue'

const currentView = ref('map')
const selectedVehicleType = ref('auto')
const selectedParking = ref(null)
const searchedLocation = ref(null)

// Datos de prueba - Estacionamientos en Córdoba Capital
const parkings = ref([
  {
    id: 1,
    name: "Estacionamiento Patio Olmos",
    // Patio Olmos Shopping, Córdoba Capital
    lat: -31.4201,
    lng: -64.1888,
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800",
    color: 'green',
    availableSpots: 45,
    totalSpots: 120,
    pricePerHour: 450,
    openTime: "08:00",
    closeTime: "22:00",
    rating: 4.5,
    distance: "250m",
    address: "Av. Vélez Sarsfield 361, Córdoba"
  },
  {
    id: 2,
    name: "Parking Plaza San Martín",
    // Plaza San Martín, centro de Córdoba
    lat: -31.4175,
    lng: -64.1836,
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800",
    color: 'yellow',
    availableSpots: 8,
    totalSpots: 60,
    pricePerHour: 350,
    openTime: "07:00",
    closeTime: "23:00",
    rating: 4.2,
    distance: "180m",
    address: "Av. Colón 100, Córdoba"
  },
  {
    id: 3,
    name: "Estacionamiento Dinosaurio Mall",
    // Dinosaurio Mall
    lat: -31.3985,
    lng: -64.2490,
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800",
    color: 'green',
    availableSpots: 80,
    totalSpots: 200,
    pricePerHour: 500,
    openTime: "10:00",
    closeTime: "22:00",
    rating: 4.7,
    distance: "5km",
    address: "Av. Fuerza Aérea 2501, Córdoba"
  }
])

const handleSelectParking = (parking) => {
  selectedParking.value = parking
}

const handleLocationSelected = (location) => {
  searchedLocation.value = location
  console.log('Ubicación seleccionada:', location)
}

// Ciclo de vida
onMounted(() => {
  loadParkings()
  setupSocketConnection()
})

onUnmounted(() => {
  cleanupSocket()
})
</script>

<style>
/* Estilos globales para Leaflet */
@import 'leaflet/dist/leaflet.css';
</style>

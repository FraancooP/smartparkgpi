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
import { ref, onMounted, onUnmounted } from 'vue'
import { Bell, ParkingSquare } from 'lucide-vue-next'
import MapView from '@/components/client/MapView.vue'
import SearchBar from '@/components/client/SearchBar.vue'
import FilterButtons from '@/components/client/FilterButtons.vue'
import ParkingModal from '@/components/client/ParkingModal.vue'
import BottomNavBar from '@/components/client/BottomNavBar.vue'
import VehicleManagement from '@/components/client/VehicleManagement.vue'
import UserProfile from '@/components/client/UserProfile.vue'
import ClientSettings from '@/components/client/ClientSettings.vue'
import QuickActions from '@/components/client/QuickActions.vue'
import { getAllParkings } from '@/services/parkingService'
import socketService from '@/services/socketService'

const currentView = ref('map')
const selectedVehicleType = ref('auto')
const selectedParking = ref(null)
const searchedLocation = ref(null)
const parkings = ref([])
const loadingParkings = ref(false)

// Cargar estacionamientos desde el backend
const loadParkings = async () => {
  try {
    loadingParkings.value = true
    const response = await getAllParkings()
    
    // Mapear datos del backend al formato del frontend
    parkings.value = (response.estacionamientos || []).map(parking => ({
      id: parking.id,
      name: parking.nombre,
      lat: parking.lat,
      lng: parking.lng,
      image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800",
      color: parking.disponibilidad?.color || 'gray',
      availableSpots: parking.disponibilidad?.disponibles || 0,
      totalSpots: parking.disponibilidad?.total || 0,
      pricePerHour: 400,
      openTime: "08:00",
      closeTime: "22:00",
      rating: 4.5,
      distance: "N/A",
      address: parking.informacion || `Lat: ${parking.lat}, Lng: ${parking.lng}`,
      disponibilidad: parking.disponibilidad
    }))
    
    console.log('✅ Estacionamientos cargados:', parkings.value.length)
    
  } catch (error) {
    console.error('❌ Error al cargar estacionamientos:', error)
    // Si falla, usar datos de prueba
    parkings.value = [
      {
        id: 1,
        name: "Estacionamiento Patio Olmos",
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
      }
    ]
  } finally {
    loadingParkings.value = false
  }
}

// Manejar actualización de lugares en tiempo real
const handleSpotUpdate = (data) => {
  console.log('🔄 Lugar actualizado vía Socket.io:', data)
  
  // Encontrar el parking afectado
  const parking = parkings.value.find(p => p.id === data.estacionamiento_id)
  
  if (parking) {
    // Actualizar contadores según el cambio de estado
    if (data.estado === 'disponible') {
      parking.lugares_disponibles++
      parking.lugares_ocupados--
    } else if (data.estado === 'ocupado') {
      parking.lugares_disponibles--
      parking.lugares_ocupados++
    }
    
    console.log(`✅ Actualizado: ${parking.nombre} - Disponibles: ${parking.lugares_disponibles}/${parking.total_lugares}`)
  }
}

// Conectar Socket.io y escuchar actualizaciones
const setupSocketConnection = () => {
  socketService.connect()
  socketService.onSpotUpdated(handleSpotUpdate)
  socketService.onParkingCreated(handleParkingCreated)
  
  // Unirse a salas de todos los estacionamientos visibles
  parkings.value.forEach(parking => {
    socketService.joinParking(parking.id)
  })
}

// Limpiar conexión Socket.io al desmontar
const cleanupSocket = () => {
  parkings.value.forEach(parking => {
    socketService.leaveParking(parking.id)
  })
  
  socketService.offSpotUpdated(handleSpotUpdate)
  socketService.offParkingCreated(handleParkingCreated)
  socketService.disconnect()
}

// Manejar evento de nuevo estacionamiento creado
const handleParkingCreated = (newParking) => {
  console.log('🎉 Nuevo estacionamiento creado:', newParking)
  
  const totalLugares = (newParking.cantidad_lugares_auto || 0) + (newParking.cantidad_lugares_moto || 0)
  
  // Agregar el nuevo estacionamiento a la lista
  parkings.value.push({
    id: newParking.id,
    nombre: newParking.nombre,
    lat: newParking.lat,
    lng: newParking.lng,
    informacion: newParking.informacion,
    imagen_1: newParking.imagen_1,
    imagen_2: newParking.imagen_2,
    imagen_3: newParking.imagen_3,
    tarifa_moto: newParking.tarifa_moto,
    tarifa_auto: newParking.tarifa_auto,
    total_lugares: totalLugares,
    lugares_disponibles: totalLugares, // Todos disponibles al crear
    lugares_ocupados: 0,
    cantidad_lugares_auto: newParking.cantidad_lugares_auto || 0,
    cantidad_lugares_moto: newParking.cantidad_lugares_moto || 0
  })
  
  // Unirse a la sala del nuevo estacionamiento
  socketService.joinParking(newParking.id)
  
  // Mostrar notificación (opcional)
  console.log(`✅ Nuevo estacionamiento "${newParking.nombre}" agregado al mapa`)
}

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

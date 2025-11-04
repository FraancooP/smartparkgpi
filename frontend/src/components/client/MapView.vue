<template>
  <div class="absolute inset-0 z-0">
    <l-map
      ref="mapRef"
      :zoom="zoom"
      :center="center"
      :use-global-leaflet="false"
      class="w-full h-full"
      @ready="onMapReady"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      ></l-tile-layer>
      
      <!-- Marcador de ubicación actual del usuario -->
      <l-marker 
        :lat-lng="userLocation"
        :icon="userIcon"
      >
        <l-popup>
          <div class="text-center">
            <p class="font-semibold">Tu ubicación</p>
            <p class="text-xs text-slate-500">Córdoba, Argentina</p>
          </div>
        </l-popup>
      </l-marker>
      
      <!-- Marcador del destino buscado -->
      <l-marker
        v-if="searchedLocation"
        :lat-lng="[searchedLocation.lat, searchedLocation.lng]"
        :icon="destinationIcon"
      >
        <l-popup>
          <div class="text-center space-y-1">
            <p class="font-semibold">{{ searchedLocation.name }}</p>
            <p class="text-xs text-slate-500">Destino buscado</p>
          </div>
        </l-popup>
      </l-marker>
      
      <!-- Línea directa desde destino al parking más cercano (más gruesa y visible) -->
      <l-polyline
        v-if="searchedLocation && nearestParking"
        :lat-lngs="[
          [searchedLocation.lat, searchedLocation.lng],
          [nearestParking.lat, nearestParking.lng]
        ]"
        :color="'#3b82f6'"
        :weight="5"
        :opacity="0.8"
        :dashArray="'15, 10'"
      >
        <l-popup>
          <div class="text-center">
            <p class="font-semibold text-blue-600">Distancia directa</p>
            <p class="text-sm">{{ formatDistance(nearestParking.calculatedDistance) }}</p>
          </div>
        </l-popup>
      </l-polyline>
      
      <!-- Marcador en el punto medio de la ruta con etiqueta de distancia -->
      <l-marker
        v-if="routeCoordinates.length > 0 && nearestParking"
        :lat-lng="getMidPoint()"
        :icon="distanceLabelIcon"
      />
      
      <!-- Ruta desde usuario a destino (verde) -->
      <l-polyline
        v-if="userToDestinationRoute.length > 0"
        :lat-lngs="userToDestinationRoute"
        :color="'#10b981'"
        :weight="6"
        :opacity="0.9"
      >
        <l-popup>
          <div class="text-center">
            <p class="font-semibold text-green-600">Tu ruta al destino</p>
            <p class="text-sm">{{ formatDistance(userToDestinationDistance) }} • {{ userToDestinationTime }} min</p>
          </div>
        </l-popup>
      </l-polyline>
      
      <!-- Marcador en el punto medio de ruta usuario-destino -->
      <l-marker
        v-if="userToDestinationRoute.length > 0"
        :lat-lng="getMidPointUserToDestination()"
        :icon="userToDestinationLabelIcon"
      />
      
      <!-- Ruta caminando al parking (azul) -->
      <l-polyline
        v-if="routeCoordinates.length > 0"
        :lat-lngs="routeCoordinates"
        :color="'#3b82f6'"
        :weight="6"
        :opacity="0.9"
      >
        <l-popup>
          <div class="text-center">
            <p class="font-semibold text-blue-600">Ruta caminando</p>
            <p class="text-sm" v-if="nearestParking">{{ formatDistance(nearestParking.calculatedDistance) }} • {{ nearestParking.calculatedTime }} min</p>
          </div>
        </l-popup>
      </l-polyline>
      
      <!-- Marcadores de estacionamientos -->
      <l-marker
        v-for="parking in parkings"
        :key="parking.id"
        :lat-lng="[parking.lat, parking.lng]"
        :icon="getParkingIcon(parking.color)"
        @click="$emit('select-parking', parking)"
      >
        <l-popup>
          <div class="space-y-2 min-w-[200px]">
            <h3 class="font-bold text-sm">{{ parking.name }}</h3>
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-600">Disponibles:</span>
              <span class="font-semibold" :class="getColorClass(parking.color)">
                {{ parking.availableSpots }}/{{ parking.totalSpots }}
              </span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-600">Precio/hora:</span>
              <span class="font-semibold text-blue-600">${{ parking.pricePerHour }}</span>
            </div>
            <button
              @click="$emit('select-parking', parking)"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 px-3 rounded-md transition"
            >
              Ver detalles
            </button>
          </div>
        </l-popup>
      </l-marker>
    </l-map>
    
    <!-- Info box con distancia y tiempo - Arriba del mapa -->
    <div
      v-if="nearestParking && searchedLocation"
      class="absolute top-40 left-1/2 transform -translate-x-1/2 z-30 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl px-5 py-4 shadow-2xl border-2 border-white max-w-sm animate-slideDown"
    >
      <div class="text-center space-y-2">
        <p class="text-xs font-medium opacity-90">🎯 Estacionamiento más cercano</p>
        <p class="font-bold text-lg">{{ nearestParking.name }}</p>
        <div class="flex items-center justify-center space-x-6 text-sm bg-white/20 rounded-xl py-2 px-4 backdrop-blur-sm">
          <span class="flex items-center space-x-2">
            <Navigation class="h-4 w-4" />
            <span class="font-semibold">{{ formatDistance(nearestParking.calculatedDistance) }}</span>
          </span>
          <div class="w-px h-4 bg-white/40"></div>
          <span class="flex items-center space-x-2">
            <Clock class="h-4 w-4" />
            <span class="font-semibold">~{{ nearestParking.calculatedTime }} min</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup, LPolyline } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Navigation, Clock } from 'lucide-vue-next'

// Fix para iconos de Leaflet con Vite
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
})

const props = defineProps({
  parkings: {
    type: Array,
    required: true
  },
  searchedLocation: {
    type: Object,
    default: null
  }
})

defineEmits(['select-parking'])

// Centro del mapa: Córdoba Capital (Plaza San Martín)
const center = ref([-31.4201, -64.1888])
const zoom = ref(15)
const mapRef = ref(null)
const map = ref(null)
const routingControl = ref(null)
const routePolyline = ref(null)

// Ubicación del usuario (simulada en el centro de Córdoba)
const userLocation = ref([-31.4201, -64.1888])

// Estacionamiento más cercano calculado
const nearestParking = ref(null)

// Coordenadas de la ruta para dibujar
const routeCoordinates = ref([])
const userToDestinationRoute = ref([])
const userToDestinationDistance = ref(0)
const userToDestinationTime = ref(0)

// Icono personalizado para el usuario
const userIcon = L.divIcon({
  html: `
    <div class="relative">
      <div class="w-6 h-6 bg-blue-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center animate-pulse">
        <div class="w-2 h-2 bg-white rounded-full"></div>
      </div>
      <div class="absolute inset-0 w-8 h-8 -m-1 bg-blue-500/20 rounded-full animate-ping"></div>
    </div>
  `,
  className: 'custom-user-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
})

// Icono para el destino buscado
const destinationIcon = L.divIcon({
  html: `
    <div class="relative">
      <div class="w-10 h-10 bg-red-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
        </svg>
      </div>
      <div class="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-transparent border-t-red-500"></div>
    </div>
  `,
  className: 'custom-destination-icon',
  iconSize: [40, 52],
  iconAnchor: [20, 52],
  popupAnchor: [0, -52]
})

// Icono dinámico para la etiqueta de distancia usuario-destino
const userToDestinationLabelIcon = computed(() => {
  if (!userToDestinationDistance.value) return null
  
  return L.divIcon({
    html: `
      <div class="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg border-2 border-white font-semibold text-sm whitespace-nowrap">
        🚶 ${formatDistance(userToDestinationDistance.value)} • ${userToDestinationTime.value} min
      </div>
    `,
    className: 'custom-distance-label',
    iconSize: [120, 32],
    iconAnchor: [60, 16]
  })
})

// Icono dinámico para la etiqueta de distancia
const distanceLabelIcon = computed(() => {
  if (!nearestParking.value) return null
  
  return L.divIcon({
    html: `
      <div class="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg border-2 border-white font-semibold text-sm whitespace-nowrap">
        🅿️ ${formatDistance(nearestParking.value.calculatedDistance)} • ${nearestParking.value.calculatedTime} min
      </div>
    `,
    className: 'custom-distance-label',
    iconSize: [120, 32],
    iconAnchor: [60, 16]
  })
})

// Calcular punto medio de la ruta
const getMidPoint = () => {
  if (routeCoordinates.value.length === 0) return [0, 0]
  const midIndex = Math.floor(routeCoordinates.value.length / 2)
  return routeCoordinates.value[midIndex]
}

// Calcular punto medio de la ruta usuario-destino
const getMidPointUserToDestination = () => {
  if (userToDestinationRoute.value.length === 0) return [0, 0]
  const midIndex = Math.floor(userToDestinationRoute.value.length / 2)
  return userToDestinationRoute.value[midIndex]
}

const onMapReady = (mapInstance) => {
  map.value = mapInstance
  
  // Intentar obtener ubicación GPS real del usuario
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        userLocation.value = [latitude, longitude]
        // Centrar mapa en la ubicación real
        map.value.setView([latitude, longitude], 15)
        console.log('Ubicación GPS obtenida:', latitude, longitude)
      },
      (error) => {
        console.log('No se pudo obtener GPS, usando ubicación por defecto:', error.message)
        // Mantener ubicación por defecto en Córdoba
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
    
    // Actualizar ubicación en tiempo real (cada 30 segundos)
    setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          userLocation.value = [latitude, longitude]
        },
        null,
        { enableHighAccuracy: false, maximumAge: 30000 }
      )
    }, 30000)
  }
}

// Calcular distancia entre dos puntos (fórmula de Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3 // Radio de la Tierra en metros
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lon2 - lon1) * Math.PI / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return Math.round(R * c) // Distancia en metros
}

// Encontrar estacionamiento más cercano y trazar ruta
const findNearestParkingAndRoute = () => {
  if (!props.searchedLocation || !props.parkings.length || !map.value) return

  // Calcular distancias a todos los estacionamientos
  const parkingsWithDistance = props.parkings.map(parking => ({
    ...parking,
    calculatedDistance: calculateDistance(
      props.searchedLocation.lat,
      props.searchedLocation.lng,
      parking.lat,
      parking.lng
    )
  }))

  // Ordenar por distancia y tomar el más cercano
  parkingsWithDistance.sort((a, b) => a.calculatedDistance - b.calculatedDistance)
  const nearest = parkingsWithDistance[0]
  
  // Calcular tiempo estimado (asumiendo 60m/min caminando)
  nearest.calculatedTime = Math.ceil(nearest.calculatedDistance / 60)
  
  nearestParking.value = nearest

  // Limpiar rutas anteriores
  if (routingControl.value) {
    map.value.removeControl(routingControl.value)
    routingControl.value = null
  }
  routeCoordinates.value = []
  userToDestinationRoute.value = []

  // 1. Calcular ruta desde usuario a destino buscado (VERDE)
  fetch(
    `https://router.project-osrm.org/route/v1/foot/${userLocation.value[1]},${userLocation.value[0]};${props.searchedLocation.lng},${props.searchedLocation.lat}?overview=full&geometries=geojson`
  )
    .then(response => response.json())
    .then(data => {
      if (data.routes && data.routes[0]) {
        const route = data.routes[0]
        userToDestinationDistance.value = Math.round(route.distance)
        userToDestinationTime.value = Math.ceil(route.duration / 60)
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]])
        userToDestinationRoute.value = coordinates
      }
    })
    .catch(error => console.error('Error al calcular ruta usuario-destino:', error))

  // 2. Calcular ruta desde destino buscado al parking más cercano (AZUL)
  fetch(
    `https://router.project-osrm.org/route/v1/foot/${props.searchedLocation.lng},${props.searchedLocation.lat};${nearest.lng},${nearest.lat}?overview=full&geometries=geojson`
  )
    .then(response => response.json())
    .then(data => {
      if (data.routes && data.routes[0]) {
        const route = data.routes[0]
        
        // Actualizar distancia y tiempo real
        nearestParking.value.calculatedDistance = Math.round(route.distance)
        nearestParking.value.calculatedTime = Math.ceil(route.duration / 60)
        
        // Extraer coordenadas de la geometría
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]])
        routeCoordinates.value = coordinates
        
        // Ajustar mapa para mostrar toda la ruta
        setTimeout(() => {
          // Combinar todos los puntos para el bounds
          const allPoints = [
            ...userToDestinationRoute.value,
            ...coordinates
          ]
          if (allPoints.length > 0) {
            const bounds = L.latLngBounds(allPoints)
            map.value.fitBounds(bounds, { 
              padding: [120, 120],
              maxZoom: 15
            })
          }
        }, 500)
      }
    })
    .catch(error => {
      console.error('Error al calcular ruta:', error)
    })
}

// Watch para detectar cambios en la ubicación buscada
watch(() => props.searchedLocation, (newLocation) => {
  if (newLocation && map.value) {
    // Centrar mapa en la nueva ubicación
    map.value.setView([newLocation.lat, newLocation.lng], 15)
    
    // Encontrar estacionamiento más cercano y trazar ruta
    setTimeout(() => {
      findNearestParkingAndRoute()
    }, 100)
  }
}, { deep: true })

// Iconos personalizados para estacionamientos según disponibilidad
const getParkingIcon = (color) => {
  const colors = {
    red: {
      bg: '#dc2626',
      border: '#991b1b',
      text: 'Lleno'
    },
    yellow: {
      bg: '#eab308',
      border: '#a16207',
      text: 'Casi lleno'
    },
    green: {
      bg: '#16a34a',
      border: '#15803d',
      text: 'Disponible'
    }
  }
  
  const colorData = colors[color] || colors.green
  
  return L.divIcon({
    html: `
      <div class="relative group cursor-pointer transform transition-transform hover:scale-110">
        <div class="w-12 h-12 rounded-full border-4 shadow-xl overflow-hidden bg-white" 
             style="border-color: ${colorData.border}; box-shadow: 0 4px 12px ${colorData.border}40">
          <svg class="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" fill="${colorData.bg}"/>
            <path d="M19 17H5V6H19V17ZM19 4H5C3.9 4 3 4.9 3 6V17C3 18.1 3.9 19 5 19H8V21H16V19H19C20.1 19 21 18.1 21 17V6C21 4.9 20.1 4 19 4ZM7 8H9V10H7V8ZM15 8H17V10H15V8Z" 
                  fill="white"/>
          </svg>
        </div>
        <div class="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent" 
             style="border-top-color: ${colorData.border}">
        </div>
      </div>
    `,
    className: 'custom-parking-icon',
    iconSize: [48, 56],
    iconAnchor: [24, 56],
    popupAnchor: [0, -56]
  })
}

const getColorClass = (color) => {
  return {
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    green: 'text-green-600'
  }[color]
}

// Formatear distancia (mostrar en km si es mayor a 1000m)
const formatDistance = (meters) => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`
  }
  return `${meters} m`
}
</script>

<style scoped>
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.animate-slideDown {
  animation: slideDown 0.5s ease-out;
}
:deep(.leaflet-container) {
  font-family: inherit;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

:deep(.leaflet-popup-tip) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.custom-user-icon),
:deep(.custom-parking-icon),
:deep(.custom-destination-icon),
:deep(.custom-distance-label) {
  background: transparent;
  border: none;
}

/* Animación para el label de distancia */
:deep(.custom-distance-label) {
  animation: fadeInScale 0.4s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

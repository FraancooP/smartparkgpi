<template>
  <div class="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-md px-4">
    <div class="relative">
      <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
      <input
        v-model="searchQuery"
        @keyup.enter="handleSearch"
        type="text"
        placeholder="¿Donde querés ir? Ej: Patio Olmos"
        class="pl-12 pr-4 h-12 w-full bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg rounded-full text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
      
      <!-- Botón de búsqueda -->
      <button
        v-if="searchQuery"
        @click="handleSearch"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full h-8 w-8 flex items-center justify-center transition"
      >
        <Navigation class="h-4 w-4" />
      </button>
      
      <!-- Loader -->
      <div
        v-if="isSearching"
        class="absolute right-4 top-1/2 transform -translate-y-1/2"
      >
        <div class="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    </div>
    
    <!-- Resultados de búsqueda -->
    <div
      v-if="searchResults.length > 0 && showResults"
      class="mt-2 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
    >
      <div
        v-for="result in searchResults"
        :key="result.place_id"
        @click="selectLocation(result)"
        class="px-4 py-3 hover:bg-blue-50 cursor-pointer transition border-b border-slate-100 last:border-0"
      >
        <div class="flex items-start space-x-3">
          <MapPinIcon class="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="font-medium text-slate-800 truncate">{{ result.display_name.split(',')[0] }}</p>
            <p class="text-xs text-slate-500 truncate">{{ result.display_name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, Navigation, MapPinIcon } from 'lucide-vue-next'

const searchQuery = ref('')
const searchResults = ref([])
const showResults = ref(false)
const isSearching = ref(false)

const emit = defineEmits(['location-selected'])

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  isSearching.value = true
  showResults.value = false
  
  try {
    // Nominatim API de OpenStreetMap (geocodificación gratuita)
    // Priorizamos búsquedas en Córdoba, Argentina
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(searchQuery.value)},Córdoba,Argentina&` +
      `format=json&` +
      `limit=5&` +
      `countrycodes=ar&` +
      `addressdetails=1`
    )
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      searchResults.value = data
      showResults.value = true
    } else {
      // Si no encuentra en Córdoba, busca en toda Argentina
      const fallbackResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(searchQuery.value)}&` +
        `format=json&` +
        `limit=5&` +
        `countrycodes=ar&` +
        `addressdetails=1`
      )
      const fallbackData = await fallbackResponse.json()
      searchResults.value = fallbackData
      showResults.value = fallbackData.length > 0
    }
  } catch (error) {
    console.error('Error al buscar ubicación:', error)
  } finally {
    isSearching.value = false
  }
}

const selectLocation = (location) => {
  searchQuery.value = location.display_name.split(',')[0]
  showResults.value = false
  
  emit('location-selected', {
    lat: parseFloat(location.lat),
    lng: parseFloat(location.lon),
    name: location.display_name.split(',')[0],
    fullAddress: location.display_name
  })
}
</script>

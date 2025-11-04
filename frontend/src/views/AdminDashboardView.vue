<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
    <!-- Navegación -->
    <NavigationTabs :active-tab="activeTab" @tab-change="handleTabChange" />

    <!-- Contenido Principal -->
    <main class="relative">
      <!-- If a nested child route is active (parking detail, profile, settings, register), render it -->
      <router-view v-if="isChildActive" />

      <!-- Otherwise, render the internal tab views -->
      <template v-else>
        <!-- Vista de Perfil -->
        <ProfileView v-if="activeTab === 'profile'" />

        <!-- Vista de Estacionamientos -->
        <div v-else-if="activeTab === 'parking'">
          <ParkingDashboard
            :parkings="parkings"
            @register-click="showRegistrationForm = true"
            @parking-click="handleParkingClick"
          />
        </div>

        <!-- Vista de Configuración -->
        <SettingsView v-else-if="activeTab === 'settings'" />
      </template>
    </main>

    <!-- Modal de Registro de Estacionamiento -->
    <div
      v-if="showRegistrationForm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      @click.self="showRegistrationForm = false"
    >
      <div class="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl">
        <ParkingRegistrationForm
          @submit="handleRegistrationSubmit"
          @cancel="showRegistrationForm = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavigationTabs from '@/components/admin/NavigationTabs.vue'
import ParkingDashboard from '@/components/admin/ParkingDashboard.vue'
import ParkingRegistrationForm from '@/components/admin/ParkingRegistrationForm.vue'
import ProfileView from '@/components/admin/ProfileView.vue'
import SettingsView from '@/components/admin/SettingsView.vue'
import { getMyParkings, createParking } from '@/services/parkingService'

const activeTab = ref('parking')
const showRegistrationForm = ref(false)
const selectedParking = ref(null)
const loadingParkings = ref(false)

const route = useRoute()
const router = useRouter()

// When the router has an active child route under /admin/dashboard we want
// to render the child component (parking detail, profile, settings, register-parking)
const isChildActive = computed(() => {
  const name = route.name
  return (
    name === 'parking-detail' ||
    name === 'admin-profile' ||
    name === 'admin-settings' ||
    name === 'register-parking'
  )
})

// Parkings desde API
const parkings = ref([])

// Cargar estacionamientos desde backend
const loadParkings = async () => {
  try {
    loadingParkings.value = true
    const response = await getMyParkings()
    
    // Adaptar formato del backend al frontend
    parkings.value = (response.estacionamientos || []).map(parking => ({
      id: parking.id.toString(),
      name: parking.nombre_estacionamiento,
      location: `Lat: ${parking.latitud}, Lng: ${parking.longitud}`,
      image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=1000&auto=format&fit=crop',
      spaces: parking.lugares?.length || 0,
      occupiedSpaces: parking.lugares?.filter(l => l.estado === 'ocupado').length || 0,
      employees: parking.empleado ? 1 : 0,
      revenue: 0,
      lat: parking.latitud,
      lng: parking.longitud,
      informacion: parking.informacion
    }))
    
  } catch (error) {
    console.error('Error al cargar estacionamientos:', error)
    // Si falla, mostrar datos de prueba
    parkings.value = [
      {
        id: '1',
        name: 'Estacionamiento Central',
        location: 'Av. Principal 123',
        image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=1000&auto=format&fit=crop',
        spaces: 50,
        occupiedSpaces: 30,
        employees: 5,
        revenue: 150000
      }
    ]
  } finally {
    loadingParkings.value = false
  }
}

const handleTabChange = (tab) => {
  activeTab.value = tab
}

const handleParkingClick = (parking) => {
  // Navigate to the nested parking detail route so that the child route
  // (ParkingDetailView) is rendered inside this AdminDashboardView's <router-view>.
  console.log('Parking clickeado (navegando):', parking)
  selectedParking.value = parking
  router.push({ name: 'parking-detail', params: { id: parking.id } })
}

const handleRegistrationSubmit = async (formData) => {
  try {
    console.log('Datos a enviar al backend:', formData)

    // Preparar datos para el backend
    const parkingData = {
      nombre_estacionamiento: formData.name,
      latitud: formData.coordinates?.lat || -31.4201,
      longitud: formData.coordinates?.lng || -64.1888,
      informacion: formData.location || ''
    }

    // Enviar al backend
    const response = await createParking(parkingData)
    
    console.log('Estacionamiento creado:', response)
    
    // Recargar lista de estacionamientos
    await loadParkings()
    
    alert(`✅ Estacionamiento "${formData.name}" registrado exitosamente!`)
    showRegistrationForm.value = false

  } catch (error) {
    console.error('Error al crear estacionamiento:', error)
    alert(error.response?.data?.error || 'Error al registrar el estacionamiento')
  }
}

// Cargar datos al montar
onMounted(() => {
  loadParkings()
})
</script>

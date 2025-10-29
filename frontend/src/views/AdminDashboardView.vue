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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavigationTabs from '@/components/admin/NavigationTabs.vue'
import ParkingDashboard from '@/components/admin/ParkingDashboard.vue'
import ParkingRegistrationForm from '@/components/admin/ParkingRegistrationForm.vue'
import ProfileView from '@/components/admin/ProfileView.vue'
import SettingsView from '@/components/admin/SettingsView.vue'

const activeTab = ref('parking')
const showRegistrationForm = ref(false)
const selectedParking = ref(null)

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

// Datos de prueba
const parkings = ref([
  {
    id: '1',
    name: 'Estacionamiento Central',
    location: 'Av. Principal 123',
    image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=1000&auto=format&fit=crop',
    spaces: 50,
    occupiedSpaces: 30,
    employees: 5,
    revenue: 150000
  },
  {
    id: '2',
    name: 'Parking Sur',
    location: 'Calle Sur 456',
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=1000&auto=format&fit=crop',
    spaces: 35,
    occupiedSpaces: 20,
    employees: 3,
    revenue: 95000
  }
])

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

    // TODO: Aquí se enviará al backend cuando tengamos el controller
    // const response = await fetch('http://localhost:4000/api/admin/parkings', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //   },
    //   body: JSON.stringify(formData)
    // })

    // const data = await response.json()

    // if (response.ok) {
    //   parkings.value.push(data.estacionamiento)
    //   alert('¡Estacionamiento registrado exitosamente!')
    //   showRegistrationForm.value = false
    // } else {
    //   alert(data.error || 'Error al registrar el estacionamiento')
    // }

    // Por ahora solo simulamos el registro
    const newParking = {
      id: Date.now().toString(),
      name: formData.name,
      image: formData.images[0] || 'https://images.unsplash.com/photo-1558457738-f199ff9dbf82?w=400',
      location: formData.location,
      spaces: parseInt(formData.spaces),
      occupiedSpaces: 0
    }

    parkings.value.push(newParking)
    
    alert(`¡Estacionamiento "${formData.name}" registrado exitosamente!\n\nEmpleados agregados: ${formData.employees.length}\nTarifa Moto: $${formData.rates.moto}\nTarifa Auto: $${formData.rates.auto}`)
    
    showRegistrationForm.value = false

  } catch (error) {
    console.error('Error:', error)
    alert('No se pudo conectar con el servidor')
  }
}
</script>

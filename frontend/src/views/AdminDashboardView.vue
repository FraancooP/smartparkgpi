<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
    <!-- Navegación -->
    <NavigationTabs :active-tab="activeTab" @tab-change="handleTabChange" />

    <!-- Contenido Principal -->
    <main class="relative">
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
import { ref } from 'vue'
import NavigationTabs from '@/components/admin/NavigationTabs.vue'
import ParkingDashboard from '@/components/admin/ParkingDashboard.vue'
import ParkingRegistrationForm from '@/components/admin/ParkingRegistrationForm.vue'
import ProfileView from '@/components/admin/ProfileView.vue'
import SettingsView from '@/components/admin/SettingsView.vue'

const activeTab = ref('parking')
const showRegistrationForm = ref(false)
const selectedParking = ref(null)
const parkings = ref([
  // Los estacionamientos se cargarán desde el backend
  // Por ahora está vacío para que el admin registre el primero
])

const handleTabChange = (tab) => {
  activeTab.value = tab
}

const handleParkingClick = (parking) => {
  console.log('Parking clickeado:', parking)
  // Aquí se podría abrir una vista detallada del estacionamiento
  // Por ahora solo lo logueamos
  selectedParking.value = parking
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

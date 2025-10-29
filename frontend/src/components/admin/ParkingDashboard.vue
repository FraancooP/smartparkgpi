<template>
  <div class="min-h-screen bg-[hsl(var(--background))]">
    <div class="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <!-- Header with register button -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Panel de Control</h1>
        <Button
          @click="$emit('register-click')"
          class="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)_/_0.9)] text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus class="w-5 h-5" />
          Registrar Estacionamiento
        </Button>
      </div>

      <!-- Título -->
      <div class="text-center space-y-2">
        <h1 class="text-4xl font-bold text-slate-800">Mis Estacionamientos</h1>
        <p class="text-lg text-slate-600">Gestiona todos tus estacionamientos desde un solo lugar</p>
      </div>

      <!-- Grid de Estacionamientos -->
      <div v-if="parkings.length === 0" class="text-center py-16">
        <div class="max-w-md mx-auto space-y-4">
          <div class="w-24 h-24 mx-auto bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center">
            <Plus class="w-12 h-12 text-blue-600" />
          </div>
          <h3 class="text-xl font-semibold text-slate-700">No tienes estacionamientos registrados</h3>
          <p class="text-slate-500">
            Comienza registrando tu primer estacionamiento para empezar a gestionar tu negocio
          </p>
          <Button
            @click="$emit('register-click')"
            class="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white mt-4"
          >
            <Plus class="w-4 h-4 mr-2" />
            Registrar mi primer estacionamiento
          </Button>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ParkingCard
          v-for="parking in parkings"
          :key="parking.id"
          :parking="parking"
          @click="handleParkingClick(parking)"
        />
      </div>

      <!-- Estadísticas rápidas -->
      <div v-if="parkings.length > 0" class="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center space-y-2">
            <div class="text-3xl font-bold text-blue-600">{{ parkings.length }}</div>
            <div class="text-sm text-slate-600">Estacionamientos</div>
          </div>
          <div class="text-center space-y-2">
            <div class="text-3xl font-bold text-green-600">
              {{ totalSpaces }}
            </div>
            <div class="text-sm text-slate-600">Plazas Totales</div>
          </div>
          <div class="text-center space-y-2">
            <div class="text-3xl font-bold text-purple-600">
              {{ averageSpaces }}
            </div>
            <div class="text-sm text-slate-600">Promedio por Estacionamiento</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import ParkingCard from './ParkingCard.vue'

const router = useRouter()

const props = defineProps({
  parkings: {
    type: Array,
    default: () => []
  }
})

defineEmits(['register-click'])

const handleParkingClick = (parking) => {
  router.push(`/admin/dashboard/parking/${parking.id}`)
}

const totalSpaces = computed(() => 
  props.parkings.reduce((total, parking) => total + parking.spaces, 0)
)

const averageSpaces = computed(() => 
  props.parkings.length > 0 ? Math.round(totalSpaces.value / props.parkings.length) : 0
)
</script>

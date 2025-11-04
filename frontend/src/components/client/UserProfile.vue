<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 overflow-y-auto pb-20">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div class="flex items-center justify-between p-4">
        <button
          @click="$emit('close')"
          class="hover:bg-white/20 rounded-lg px-3 py-2 transition"
        >
          ← Volver
        </button>
        <h1 class="text-xl font-semibold">Mi Perfil</h1>
        <div class="w-16"></div>
      </div>
    </div>

    <div class="p-4 space-y-6">
      <!-- Avatar y datos principales -->
      <Card class="bg-white/90 backdrop-blur-sm border-0 shadow-xl -mt-8">
        <CardContent class="p-6">
          <div class="flex items-center space-x-4">
            <div class="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {{ userInitials }}
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-bold text-slate-800">{{ userData.name }}</h2>
              <p class="text-sm text-slate-600">{{ userData.email }}</p>
              <p class="text-xs text-slate-500 mt-1">Miembro desde {{ userData.joinDate }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Estadísticas -->
      <div class="grid grid-cols-3 gap-3">
        <Card class="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
          <CardContent class="p-4 text-center">
            <p class="text-2xl font-bold text-blue-600">{{ userData.completedReservations }}</p>
            <p class="text-xs text-slate-600 mt-1">Reservas</p>
          </CardContent>
        </Card>
        <Card class="bg-gradient-to-br from-green-50 to-green-100 border-0">
          <CardContent class="p-4 text-center">
            <p class="text-2xl font-bold text-green-600">${{ userData.totalSpent }}</p>
            <p class="text-xs text-slate-600 mt-1">Gastado</p>
          </CardContent>
        </Card>
        <Card class="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
          <CardContent class="p-4 text-center">
            <p class="text-2xl font-bold text-purple-600">${{ userData.penaltyBalance }}</p>
            <p class="text-xs text-slate-600 mt-1">Multas</p>
          </CardContent>
        </Card>
      </div>

      <!-- Tabs de Reservas -->
      <Card class="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader class="pb-3">
          <div class="flex space-x-2">
            <button
              @click="activeTab = 'active'"
              :class="[
                'px-4 py-2 rounded-lg transition-all',
                activeTab === 'active'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              ]"
            >
              Activas ({{ reservations.length }})
            </button>
            <button
              @click="activeTab = 'history'"
              :class="[
                'px-4 py-2 rounded-lg transition-all',
                activeTab === 'history'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              ]"
            >
              Historial
            </button>
          </div>
        </CardHeader>
        <CardContent class="p-4 space-y-3">
          <!-- Reservas Activas -->
          <div v-if="activeTab === 'active'">
            <Card
              v-for="reservation in reservations"
              :key="reservation.id"
              class="p-4 bg-gradient-to-br from-blue-50/50 to-slate-50/50 border hover:shadow-md transition"
            >
              <div class="space-y-3">
                <div class="flex items-start justify-between">
                  <div class="space-y-1">
                    <h4 class="font-medium text-slate-800">{{ reservation.parkingName }}</h4>
                    <div class="flex items-center space-x-2 text-sm text-slate-600">
                      <Calendar class="h-4 w-4" />
                      <span>{{ formatDate(reservation.date) }}</span>
                    </div>
                  </div>
                  <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 flex items-center space-x-1">
                    <Clock class="h-3 w-3" />
                    <span>Activa</span>
                  </span>
                </div>
                
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div class="space-y-2">
                    <div class="flex items-center space-x-2 text-slate-600">
                      <Clock class="h-4 w-4" />
                      <span>{{ reservation.time }} • {{ reservation.duration }}</span>
                    </div>
                    <div class="flex items-center space-x-2 text-slate-600">
                      <Car class="h-4 w-4" />
                      <span>{{ reservation.vehicle }}</span>
                    </div>
                  </div>
                  <div class="text-right space-y-2">
                    <div class="font-medium text-lg text-blue-600">${{ reservation.cost }}</div>
                    <div class="text-xs text-slate-500">
                      {{ reservation.type === 'scheduled' ? 'Programada' : 'Inmediata' }}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          <!-- Historial -->
          <div v-if="activeTab === 'history'" class="space-y-3">
            <p class="text-sm text-slate-600 text-center py-8">Historial en desarrollo</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Calendar, Clock, Car } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'

defineEmits(['close'])

const activeTab = ref('active')

const userData = ref({
  name: "Juan Carlos López",
  email: "juan.lopez@email.com",
  phone: "+54 11 1234-5678",
  joinDate: "Marzo 2024",
  penaltyBalance: 0.0,
  completedReservations: 23,
  totalSpent: 4650.50
})

const reservations = ref([
  {
    id: "1",
    parkingName: "Estacionamiento Central Plaza",
    date: "2024-11-05",
    time: "14:30",
    duration: "2h 30min",
    vehicle: "Mi Auto (ABC 123)",
    cost: 375,
    status: "active",
    type: "immediate"
  },
  {
    id: "2",
    parkingName: "Parking Green Tower",
    date: "2024-11-08",
    time: "09:00",
    duration: "4h",
    vehicle: "Auto Familiar (XYZ 789)",
    cost: 480,
    status: "active",
    type: "scheduled"
  }
])

const userInitials = computed(() => {
  const names = userData.value.name.split(' ')
  return names.map(n => n[0]).join('').slice(0, 2).toUpperCase()
})

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-AR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}
</script>

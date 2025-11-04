<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <div>
              <h1 class="text-xl font-semibold">SmartPark</h1>
              <p class="text-sm text-gray-600">Bienvenido, {{ employee?.nombre }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Temporizador de Sesión -->
            <div class="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tiempo: {{ sessionTime }}</span>
            </div>
            <!-- Logout -->
            <button
              @click="handleLogout"
              class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <component :is="tab.icon" class="w-5 h-5" />
              {{ tab.label }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div>
        <!-- Estacionamiento -->
        <div v-show="activeTab === 'parking'">
          <ParkingGrid
            :spots="parkingSpots"
            @spot-updated="handleSpotUpdate"
            @reset-all="handleResetAll"
          />
        </div>

        <!-- Validar Reserva -->
        <div v-show="activeTab === 'validate'">
          <ReservationValidator />
        </div>

        <!-- Reservas Pendientes -->
        <div v-show="activeTab === 'reservations'">
          <PendingReservations
            :reservations="pendingReservations"
            :available-spots="availableSpots"
            @reservation-assigned="handleReservationAssigned"
          />
        </div>

        <!-- Estadísticas -->
        <div v-show="activeTab === 'stats'">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-6">Estadísticas del Día</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-green-50 p-6 rounded-lg">
                <h3 class="font-medium text-green-800 mb-2">Espacios Libres</h3>
                <p class="text-3xl font-bold text-green-600">{{ stats.disponibles }}</p>
              </div>
              <div class="bg-red-50 p-6 rounded-lg">
                <h3 class="font-medium text-red-800 mb-2">Espacios Ocupados</h3>
                <p class="text-3xl font-bold text-red-600">{{ stats.ocupados }}</p>
              </div>
              <div class="bg-yellow-50 p-6 rounded-lg">
                <h3 class="font-medium text-yellow-800 mb-2">Espacios Reservados</h3>
                <p class="text-3xl font-bold text-yellow-600">{{ stats.reservados }}</p>
              </div>
            </div>
            <div class="mt-6 bg-blue-50 p-6 rounded-lg">
              <h3 class="font-medium text-blue-800 mb-2">Reservas Pendientes</h3>
              <p class="text-3xl font-bold text-blue-600">{{ stats.reservas_pendientes }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getPlaces, getPendingReservations, getDailyStats } from '@/services/employeeService';
import ParkingGrid from '@/components/employee/ParkingGrid.vue';
import ReservationValidator from '@/components/employee/ReservationValidator.vue';
import PendingReservations from '@/components/employee/PendingReservations.vue';

export default {
  name: 'EmployeeDashboardView',
  components: {
    ParkingGrid,
    ReservationValidator,
    PendingReservations
  },
  data() {
    return {
      employee: null,
      activeTab: 'parking',
      parkingSpots: [],
      pendingReservations: [],
      sessionTime: '00:00:00',
      tabs: [
        { id: 'parking', label: 'Estacionamiento', icon: 'svg' },
        { id: 'validate', label: 'Validar Reserva', icon: 'svg' },
        { id: 'reservations', label: 'Reservas Pendientes', icon: 'svg' },
        { id: 'stats', label: 'Estadísticas', icon: 'svg' }
      ]
    };
  },
  computed: {
    availableSpots() {
      return this.parkingSpots.filter(spot => spot.estado === 'disponible');
    },
    stats() {
      return {
        disponibles: this.parkingSpots.filter(s => s.estado === 'disponible').length,
        ocupados: this.parkingSpots.filter(s => s.estado === 'ocupado').length,
        reservados: this.parkingSpots.filter(s => s.estado === 'reservado').length,
        reservas_pendientes: this.pendingReservations.length
      };
    }
  },
  mounted() {
    this.loadEmployeeData();
    this.loadDashboardData();
    this.startSessionTimer();
  },
  beforeUnmount() {
    if (this.sessionTimer) clearInterval(this.sessionTimer);
  },
  methods: {
    loadEmployeeData() {
      const employeeData = localStorage.getItem('smartpark_employee');
      if (employeeData) {
        this.employee = JSON.parse(employeeData);
      }
    },
    async loadDashboardData() {
      try {
        // Importar servicios
        const { getMyParkingAsEmployee, getMyParkingSpots } = await import('@/services/parkingService');
        
        // Cargar estacionamiento asignado
        const parkingResponse = await getMyParkingAsEmployee();
        console.log('✅ Estacionamiento del empleado:', parkingResponse);
        
        if (parkingResponse.estacionamiento) {
          this.employee = {
            ...this.employee,
            estacionamiento: parkingResponse.estacionamiento.nombre,
            estacionamiento_id: parkingResponse.estacionamiento.id
          };
        }
        
        // Cargar lugares del estacionamiento
        if (parkingResponse.lugares) {
          this.parkingSpots = parkingResponse.lugares.map(lugar => ({
            id: lugar.id,
            numero: lugar.numero_lugar,
            tipo: lugar.tipo,
            estado: lugar.estado,
            ocupado_desde: null,
            reservado_hasta: null
          }));
        }

        // Por ahora, reservas pendientes vacías (implementar después)
        this.pendingReservations = [];
        
      } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        // Mostrar mensaje al usuario
        if (error.response?.status === 404) {
          alert('No tienes un estacionamiento asignado. Contacta con tu administrador.');
        }
      }
    },
    startSessionTimer() {
      this.updateSessionTime();
      this.sessionTimer = setInterval(() => {
        this.updateSessionTime();
      }, 1000);
    },
    updateSessionTime() {
      const sessionStart = localStorage.getItem('smartpark_session_start');
      if (sessionStart) {
        const now = new Date();
        const start = new Date(sessionStart);
        const diffMs = now - start;
        
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        this.sessionTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    },
    handleSpotUpdate({ id, estado }) {
      const index = this.parkingSpots.findIndex(s => s.id === id);
      if (index !== -1) {
        this.parkingSpots[index].estado = estado;
        if (estado === 'ocupado') {
          this.parkingSpots[index].ocupado_desde = new Date().toISOString();
        } else if (estado === 'disponible') {
          this.parkingSpots[index].ocupado_desde = null;
        }
      }
    },
    handleResetAll() {
      this.parkingSpots = this.parkingSpots.map(spot => ({
        ...spot,
        estado: 'disponible',
        ocupado_desde: null,
        reservado_hasta: null
      }));
    },
    handleReservationAssigned({ reservationId, spotId }) {
      // Actualizar spot
      const spotIndex = this.parkingSpots.findIndex(s => s.id === spotId);
      if (spotIndex !== -1) {
        this.parkingSpots[spotIndex].estado = 'ocupado';
        this.parkingSpots[spotIndex].ocupado_desde = new Date().toISOString();
      }

      // Remover reserva de la lista
      this.pendingReservations = this.pendingReservations.filter(r => r.id !== reservationId);
    },
    handleLogout() {
      localStorage.removeItem('smartpark_employee_token');
      localStorage.removeItem('smartpark_employee');
      localStorage.removeItem('smartpark_session_start');
      this.$router.push({ name: 'employee-login' });
    }
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center gap-2 mb-6">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h2 class="text-xl font-semibold text-gray-900">
          Reservas Pendientes ({{ reservations.length }})
        </h2>
      </div>

      <!-- Lista de Reservas -->
      <div v-if="reservations.length > 0" class="space-y-4">
        <div
          v-for="reservation in reservations"
          :key="reservation.id"
          class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
        >
          <div class="flex justify-between items-start">
            <!-- Información -->
            <div class="flex-1 space-y-3">
              <!-- Cliente y Vehículo -->
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="font-medium">{{ reservation.usuario.nombre }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span class="text-sm text-gray-600">{{ reservation.vehiculo.placa }}</span>
                </div>
              </div>

              <!-- Detalles -->
              <div class="flex items-center gap-6 text-sm text-gray-600">
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(reservation.fecha) }}
                </div>
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatTime(reservation.hora) }}
                </div>
                <div>
                  Código: <span class="font-mono font-medium">{{ reservation.codigo_numerico }}</span>
                </div>
              </div>

              <!-- Estado -->
              <div>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ getTimeUntilArrival(reservation) }}
                </span>
              </div>
            </div>

            <!-- Botón Asignar -->
            <button
              @click="openAssignDialog(reservation)"
              :disabled="availableSpots.length === 0"
              class="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Asignar Espacio
            </button>
          </div>
        </div>
      </div>

      <!-- Sin Reservas -->
      <div v-else class="text-center py-8 text-gray-500">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p>No hay reservas pendientes por asignar</p>
      </div>

      <!-- Alerta Sin Espacios -->
      <div v-if="availableSpots.length === 0 && reservations.length > 0" class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p class="text-yellow-800 text-sm">
          ⚠️ No hay espacios libres disponibles para asignar las reservas pendientes.
        </p>
      </div>
    </div>

    <!-- Dialog de Asignación -->
    <div
      v-if="showAssignDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeAssignDialog"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-semibold mb-4">Asignar Espacio de Estacionamiento</h3>

        <!-- Detalles de la Reserva -->
        <div class="mb-6 bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium mb-2">Detalles de la Reserva</h4>
          <div class="space-y-1 text-sm">
            <p><strong>Cliente:</strong> {{ selectedReservation?.usuario.nombre }}</p>
            <p><strong>Vehículo:</strong> {{ selectedReservation?.vehiculo.placa }}</p>
            <p><strong>Código:</strong> {{ selectedReservation?.codigo_numerico }}</p>
          </div>
        </div>

        <!-- Selector de Espacio -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Espacio Disponible:
          </label>
          <select
            v-model="selectedSpotId"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Escoja un espacio libre</option>
            <option v-for="spot in availableSpots" :key="spot.id" :value="spot.id">
              {{ spot.numero_lugar }} - Libre
            </option>
          </select>
        </div>

        <!-- Botones -->
        <div class="flex gap-2">
          <button
            @click="confirmAssignment"
            :disabled="!selectedSpotId"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Confirmar Asignación
          </button>
          <button
            @click="closeAssignDialog"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { assignPlaceToReservation } from '@/services/employeeService';

export default {
  name: 'PendingReservations',
  props: {
    reservations: {
      type: Array,
      required: true
    },
    availableSpots: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showAssignDialog: false,
      selectedReservation: null,
      selectedSpotId: ''
    };
  },
  methods: {
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
    formatTime(timeStr) {
      return timeStr.substring(0, 5); // HH:MM
    },
    getTimeUntilArrival(reservation) {
      const now = new Date();
      const arrivalTime = new Date(`${reservation.fecha}T${reservation.hora}`);
      const diffMinutes = Math.floor((arrivalTime - now) / (1000 * 60));
      
      if (diffMinutes < 0) return 'Retrasado';
      if (diffMinutes === 0) return 'Llegando ahora';
      return `${diffMinutes} min`;
    },
    openAssignDialog(reservation) {
      this.selectedReservation = reservation;
      this.selectedSpotId = '';
      this.showAssignDialog = true;
    },
    closeAssignDialog() {
      this.showAssignDialog = false;
      this.selectedReservation = null;
      this.selectedSpotId = '';
    },
    async confirmAssignment() {
      if (!this.selectedSpotId || !this.selectedReservation) return;

      try {
        const response = await assignPlaceToReservation(
          this.selectedReservation.id,
          parseInt(this.selectedSpotId)
        );

        if (response.success) {
          this.$emit('reservation-assigned', {
            reservationId: this.selectedReservation.id,
            spotId: parseInt(this.selectedSpotId)
          });
          this.closeAssignDialog();
        }
      } catch (error) {
        console.error('Error assigning spot:', error);
      }
    }
  }
};
</script>

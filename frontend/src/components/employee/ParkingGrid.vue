<template>
  <div class="bg-white rounded-lg shadow p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-900">Gestión de Estacionamiento</h2>
        <button
          @click="resetAllSpots"
          class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reiniciar Todo
        </button>
      </div>

      <!-- Status Summary -->
      <div class="flex gap-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          Libres: {{ statusCounts.disponible }}
        </span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          Ocupados: {{ statusCounts.ocupado }}
        </span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          Reservados: {{ statusCounts.reservado }}
        </span>
      </div>

      <!-- Filters -->
      <div class="mt-4 flex items-center gap-4">
        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <select
          v-model="filter"
          class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todos">Todos los espacios</option>
          <option value="disponible">Solo libres</option>
          <option value="ocupado">Solo ocupados</option>
          <option value="reservado">Solo reservados</option>
        </select>
      </div>
    </div>

    <!-- Grid de Espacios -->
    <div v-if="filteredSpots.length > 0" class="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
      <div
        v-for="spot in filteredSpots"
        :key="spot.id"
        @click="handleSpotClick(spot.id)"
        :class="[
          'border-2 rounded-lg p-3 cursor-pointer transition-all min-h-24 flex flex-col justify-between text-center',
          getSpotColorClass(spot)
        ]"
      >
        <div>
          <div class="font-semibold text-sm">{{ spot.numero_lugar }}</div>
          <div class="text-xs text-gray-600 mt-1">{{ getSpotStatusText(spot.estado) }}</div>
        </div>
        
        <!-- Tiempo de ocupación -->
        <div v-if="spot.ocupado_desde" class="text-xs text-red-700 mt-2 flex items-center justify-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ getOccupiedTime(spot.ocupado_desde) }}
        </div>
      </div>
    </div>

    <!-- Sin resultados -->
    <div v-else class="text-center py-8 text-gray-500">
      No hay espacios que coincidan con el filtro seleccionado.
    </div>
  </div>
</template>

<script>
import { updatePlaceStatus } from '@/services/employeeService';

export default {
  name: 'ParkingGrid',
  props: {
    spots: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      filter: 'todos',
      currentTime: new Date()
    };
  },
  computed: {
    filteredSpots() {
      if (this.filter === 'todos') return this.spots;
      return this.spots.filter(spot => spot.estado === this.filter);
    },
    statusCounts() {
      return {
        disponible: this.spots.filter(s => s.estado === 'disponible').length,
        ocupado: this.spots.filter(s => s.estado === 'ocupado').length,
        reservado: this.spots.filter(s => s.estado === 'reservado').length
      };
    }
  },
  mounted() {
    // Actualizar tiempo cada segundo
    this.timer = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    getSpotColorClass(spot) {
      const baseClasses = {
        'disponible': 'border-green-500 bg-green-50 hover:bg-green-100',
        'ocupado': 'border-red-500 bg-red-50 hover:bg-red-100',
        'reservado': 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100'
      };
      return baseClasses[spot.estado] || 'border-gray-300 bg-gray-50';
    },
    getSpotStatusText(estado) {
      const texts = {
        'disponible': 'Libre',
        'ocupado': 'Ocupado',
        'reservado': 'Reservado'
      };
      return texts[estado] || '';
    },
    getOccupiedTime(ocupadoDesde) {
      if (!ocupadoDesde) return '';
      
      const diffMs = this.currentTime - new Date(ocupadoDesde);
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours}h ${minutes}m`;
    },
    async handleSpotClick(spotId) {
      const spot = this.spots.find(s => s.id === spotId);
      if (!spot) return;

      let newStatus;
      switch (spot.estado) {
        case 'disponible':
          newStatus = 'ocupado';
          break;
        case 'ocupado':
          newStatus = 'disponible';
          break;
        case 'reservado':
          newStatus = 'ocupado';
          break;
      }

      try {
        const response = await updatePlaceStatus(spotId, newStatus);
        if (response.success) {
          this.$emit('spot-updated', { id: spotId, estado: newStatus });
        }
      } catch (error) {
        console.error('Error updating spot:', error);
      }
    },
    resetAllSpots() {
      this.$emit('reset-all');
    }
  }
};
</script>

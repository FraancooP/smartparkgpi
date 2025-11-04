<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <!-- Header -->
      <div class="flex items-center gap-2 mb-6">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
        <h2 class="text-xl font-semibold text-gray-900">Validador de Reservas</h2>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'numeric'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'numeric' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Código Numérico
            </button>
            <button
              @click="activeTab = 'qr'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'qr' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Código QR
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content: Código Numérico -->
      <div v-if="activeTab === 'numeric'" class="space-y-4">
        <div>
          <label for="code" class="block text-sm font-medium text-gray-700 mb-2">
            Ingrese el código de reserva
          </label>
          <div class="flex gap-2">
            <input
              id="code"
              v-model="numericCode"
              type="text"
              placeholder="Ej: 4567"
              @keyup.enter="validateCode"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              @click="validateCode"
              :disabled="!numericCode.trim()"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Validar
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Content: Código QR -->
      <div v-if="activeTab === 'qr'" class="text-center space-y-4">
        <p class="text-sm text-gray-600">Simulación de escaneo QR</p>
        <button
          @click="simulateQRScan"
          class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Simular Escaneo QR
        </button>
        <p class="text-xs text-gray-500">
          En producción, esto activaría la cámara para escanear un código QR real
        </p>
      </div>
    </div>

    <!-- Validation Result -->
    <div v-if="validationResult" class="bg-white rounded-lg shadow p-6">
      <!-- Éxito -->
      <div v-if="validationResult.valid" class="space-y-4">
        <div class="flex items-center gap-2 text-green-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-medium text-lg">Reserva Válida</span>
        </div>
        
        <div class="bg-green-50 p-4 rounded-lg space-y-3">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium text-gray-700">Cliente:</span>
              <span class="ml-2">{{ validationResult.reservation.usuario.nombre }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Placa:</span>
              <span class="ml-2">{{ validationResult.reservation.vehiculo.placa }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Código:</span>
              <span class="ml-2 font-mono">{{ validationResult.reservation.codigo_numerico }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Vehículo:</span>
              <span class="ml-2">{{ validationResult.reservation.vehiculo.modelo }}</span>
            </div>
          </div>
          <div class="pt-2">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Reserva Confirmada
            </span>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else class="space-y-4">
        <div class="flex items-center gap-2 text-red-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-medium text-lg">Código Inválido</span>
        </div>
        
        <div class="bg-red-50 p-4 rounded-lg">
          <p class="text-sm text-red-700">
            El código ingresado no corresponde a ninguna reserva válida.
            Verifique el código y vuelva a intentar.
          </p>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="font-medium text-gray-900 mb-4">Instrucciones</h3>
      <div class="space-y-2 text-sm text-gray-600">
        <p>• <strong>Código Numérico:</strong> Ingrese el código de 4 dígitos proporcionado al cliente</p>
        <p>• <strong>Código QR:</strong> Use la simulación para probar (en producción usará cámara)</p>
        <p>• Una vez validada la reserva, proceda a asignar un espacio disponible</p>
        <p>• Códigos de prueba válidos: <strong>4567, 8901, 2345</strong></p>
      </div>
    </div>
  </div>
</template>

<script>
import { validateReservation } from '@/services/employeeService';

export default {
  name: 'ReservationValidator',
  data() {
    return {
      activeTab: 'numeric',
      numericCode: '',
      validationResult: null
    };
  },
  methods: {
    async validateCode() {
      if (!this.numericCode.trim()) return;
      
      try {
        const response = await validateReservation(this.numericCode.trim());
        
        if (response.success) {
          this.validationResult = response.data;
          if (response.data.valid) {
            this.numericCode = '';
          }
        }
      } catch (error) {
        console.error('Validation error:', error);
      }
    },
    async simulateQRScan() {
      // Simular escaneo de QR con un código aleatorio
      const mockCodes = ['4567', '8901', '2345', 'INVALID'];
      const randomCode = mockCodes[Math.floor(Math.random() * mockCodes.length)];
      
      this.numericCode = randomCode;
      await this.validateCode();
    }
  }
};
</script>

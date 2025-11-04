<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <div class="bg-blue-600 p-3 rounded-full">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        </div>
        <h1 class="text-2xl font-semibold text-gray-900">SmartPark</h1>
        <p class="text-gray-600">Sistema de Empleados</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
            Usuario
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese su usuario"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese su contraseña"
          />
        </div>

        <!-- Error Message -->
        <div v-if="error" class="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ error }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <!-- Test Users Info -->
      <div class="mt-6 p-4 bg-gray-50 rounded-md text-sm">
        <p class="font-medium text-gray-700 mb-2">Usuarios de prueba:</p>
        <div class="space-y-1 text-gray-600">
          <p>• emp001 / 123456</p>
          <p>• emp002 / 123456</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loginEmployee } from '@/services/employeeService';

export default {
  name: 'EmployeeLogin',
  data() {
    return {
      username: '',
      password: '',
      error: '',
      isLoading: false
    };
  },
  methods: {
    async handleLogin() {
      this.error = '';
      this.isLoading = true;

      try {
        const response = await loginEmployee(this.username, this.password);
        
        if (response.success) {
          // Guardar token y datos del empleado
          localStorage.setItem('smartpark_employee_token', response.data.token);
          localStorage.setItem('smartpark_employee', JSON.stringify(response.data.employee));
          localStorage.setItem('smartpark_session_start', new Date().toISOString());
          
          // Redirigir al dashboard
          this.$router.push({ name: 'employee-dashboard' });
        } else {
          this.error = response.error || 'Error al iniciar sesión';
        }
      } catch (error) {
        this.error = 'Error de conexión. Intente nuevamente.';
        console.error('Login error:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

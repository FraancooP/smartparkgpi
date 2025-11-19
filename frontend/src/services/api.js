import axios from 'axios'

// Base URL del backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token JWT automáticamente
apiClient.interceptors.request.use(
  (config) => {
    let token = null;
    
    // Determinar qué token usar según la ruta
    if (config.url.startsWith('/employee/')) {
      // Para rutas de empleado, usar solo token de empleado
      token = localStorage.getItem('smartpark_employee_token');
      console.log('🔑 [EMPLOYEE] Usando token de empleado');
    } else if (config.url.startsWith('/admin/')) {
      // Para rutas de admin, usar token general
      token = localStorage.getItem('token');
      console.log('🔑 [ADMIN] Usando token de admin');
    } else {
      // Para otras rutas (client, auth), intentar token general primero
      token = localStorage.getItem('token') || localStorage.getItem('smartpark_employee_token');
      console.log('🔑 [GENERAL] Usando token disponible');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token encontrado:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ No hay token para enviar');
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient

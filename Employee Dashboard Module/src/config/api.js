// Configuración de la API del backend
const API_CONFIG = {
  // URL base del backend - cambiar cuando el backend esté desplegado
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
  
  // Endpoints disponibles
  endpoints: {
    // Autenticación de empleados
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    
    // Gestión de lugares/espacios
    getPlaces: '/api/lugares',
    updatePlaceStatus: '/api/lugares/:id/estado',
    
    // Gestión de reservas
    getReservations: '/api/reservas',
    getReservationByCode: '/api/reservas/codigo/:code',
    validateReservation: '/api/reservas/:id/validar',
    
    // Gestión de ocupaciones
    createOccupation: '/api/ocupaciones',
    endOccupation: '/api/ocupaciones/:id/finalizar',
    
    // Estadísticas
    getStats: '/api/estadisticas/empleado',
  },
  
  // Timeouts
  timeout: 10000, // 10 segundos
  
  // Modo de desarrollo (usar datos mock si backend no está disponible)
  useMockData: process.env.VITE_USE_MOCK === 'true' || true, // true por defecto hasta que conectemos el backend
};

export default API_CONFIG;

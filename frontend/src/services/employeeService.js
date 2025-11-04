/**
 * Servicio de Empleado - SmartPark
 * Gestión de espacios, reservas y ocupaciones
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true' || true;

// ==================== DATOS MOCK ====================

const mockEmployees = {
  'emp001': {
    id: 1,
    nombre: 'Carlos Rodríguez',
    email: 'carlos@smartpark.com',
    username: 'emp001',
    password: '123456',
    rol_id: 3,
    estacionamiento_asignado: 1
  },
  'emp002': {
    id: 2,
    nombre: 'María García',
    email: 'maria@smartpark.com',
    username: 'emp002',
    password: '123456',
    rol_id: 3,
    estacionamiento_asignado: 1
  }
};

const mockLugares = Array.from({ length: 50 }, (_, i) => {
  const random = Math.random();
  let estado;
  
  if (random < 0.4) estado = 'disponible';
  else if (random < 0.7) estado = 'ocupado';
  else estado = 'reservado';

  return {
    id: i + 1,
    numero_lugar: `A${(i + 1).toString().padStart(2, '0')}`,
    tipo: 'estandar',
    estado: estado,
    estacionamiento_id: 1,
    ocupado_desde: estado === 'ocupado' ? new Date(Date.now() - Math.random() * 3600000).toISOString() : null,
    reservado_hasta: estado === 'reservado' ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null,
    creado_en: new Date().toISOString(),
    actualizado_en: new Date().toISOString()
  };
});

const mockReservas = [
  {
    id: 1,
    codigo_numerico: '4567',
    codigo_qr: 'QR-4567-ABC123',
    tipo: 'horaria',
    estado: 'pendiente',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date(Date.now() + 300000).toTimeString().split(' ')[0],
    tolerancia: 15,
    usuario_id: 10,
    lugar_id: null,
    usuario: { nombre: 'Juan Pérez', email: 'juan@example.com' },
    vehiculo: { placa: 'ABC-123', modelo: 'Toyota Corolla', color: 'Blanco' }
  },
  {
    id: 2,
    codigo_numerico: '8901',
    codigo_qr: 'QR-8901-XYZ789',
    tipo: 'horaria',
    estado: 'pendiente',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date(Date.now() + 600000).toTimeString().split(' ')[0],
    tolerancia: 15,
    usuario_id: 11,
    lugar_id: null,
    usuario: { nombre: 'Ana López', email: 'ana@example.com' },
    vehiculo: { placa: 'XYZ-789', modelo: 'Honda Civic', color: 'Negro' }
  },
  {
    id: 3,
    codigo_numerico: '2345',
    codigo_qr: 'QR-2345-DEF456',
    tipo: 'horaria',
    estado: 'pendiente',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date(Date.now() + 900000).toTimeString().split(' ')[0],
    tolerancia: 15,
    usuario_id: 12,
    lugar_id: null,
    usuario: { nombre: 'Pedro García', email: 'pedro@example.com' },
    vehiculo: { placa: 'DEF-456', modelo: 'Ford Focus', color: 'Azul' }
  }
];

// Helper para simular delay de red
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper para respuestas
const successResponse = (data) => ({ success: true, data });
const errorResponse = (message) => ({ success: false, error: message });

// ==================== AUTENTICACIÓN ====================

export const loginEmployee = async (username, password) => {
  if (USE_MOCK_DATA) {
    await simulateDelay(800);
    
    const employee = mockEmployees[username.toLowerCase()];
    if (employee && employee.password === password) {
      const { password: _, ...employeeData } = employee;
      return successResponse({
        token: 'mock-jwt-token-' + Date.now(),
        employee: employeeData
      });
    }
    return errorResponse('Usuario o contraseña incorrectos');
  }

  // TODO: Implementar llamada real al backend
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return await response.json();
  } catch (error) {
    return errorResponse('Error de conexión con el servidor');
  }
};

// ==================== GESTIÓN DE LUGARES ====================

export const getPlaces = async (estacionamientoId) => {
  if (USE_MOCK_DATA) {
    await simulateDelay(300);
    return successResponse([...mockLugares]);
  }

  try {
    const token = localStorage.getItem('smartpark_employee_token');
    const response = await fetch(
      `${API_BASE_URL}/api/lugares?estacionamiento_id=${estacionamientoId}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    return await response.json();
  } catch (error) {
    return errorResponse('Error al obtener los lugares');
  }
};

export const updatePlaceStatus = async (lugarId, nuevoEstado) => {
  if (USE_MOCK_DATA) {
    await simulateDelay(400);
    
    const lugarIndex = mockLugares.findIndex(l => l.id === lugarId);
    if (lugarIndex !== -1) {
      mockLugares[lugarIndex].estado = nuevoEstado;
      mockLugares[lugarIndex].actualizado_en = new Date().toISOString();
      if (nuevoEstado === 'ocupado') {
        mockLugares[lugarIndex].ocupado_desde = new Date().toISOString();
      } else if (nuevoEstado === 'disponible') {
        mockLugares[lugarIndex].ocupado_desde = null;
        mockLugares[lugarIndex].reservado_hasta = null;
      }
      return successResponse(mockLugares[lugarIndex]);
    }
    return errorResponse('Lugar no encontrado');
  }

  try {
    const token = localStorage.getItem('smartpark_employee_token');
    const response = await fetch(`${API_BASE_URL}/api/lugares/${lugarId}/estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ estado: nuevoEstado })
    });
    return await response.json();
  } catch (error) {
    return errorResponse('Error al actualizar el lugar');
  }
};

// ==================== GESTIÓN DE RESERVAS ====================

export const getPendingReservations = async () => {
  if (USE_MOCK_DATA) {
    await simulateDelay(400);
    return successResponse(mockReservas.filter(r => r.estado === 'pendiente'));
  }

  try {
    const token = localStorage.getItem('smartpark_employee_token');
    const response = await fetch(
      `${API_BASE_URL}/api/reservas?estado=pendiente`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    return await response.json();
  } catch (error) {
    return errorResponse('Error al obtener las reservas');
  }
};

export const validateReservation = async (code) => {
  if (USE_MOCK_DATA) {
    await simulateDelay(500);
    
    const reserva = mockReservas.find(
      r => r.codigo_numerico === code || r.codigo_qr === code
    );
    
    if (reserva) {
      return successResponse({ valid: true, reservation: reserva });
    }
    return successResponse({ valid: false, message: 'Código inválido' });
  }

  try {
    const token = localStorage.getItem('smartpark_employee_token');
    const response = await fetch(`${API_BASE_URL}/api/reservas/codigo/${code}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    return errorResponse('Error al validar la reserva');
  }
};

export const assignPlaceToReservation = async (reservaId, lugarId) => {
  if (USE_MOCK_DATA) {
    await simulateDelay(600);
    
    const reservaIndex = mockReservas.findIndex(r => r.id === reservaId);
    const lugarIndex = mockLugares.findIndex(l => l.id === lugarId);
    
    if (reservaIndex !== -1 && lugarIndex !== -1) {
      mockReservas[reservaIndex].lugar_id = lugarId;
      mockReservas[reservaIndex].estado = 'activa';
      mockLugares[lugarIndex].estado = 'ocupado';
      mockLugares[lugarIndex].ocupado_desde = new Date().toISOString();
      
      return successResponse({
        reserva: mockReservas[reservaIndex],
        lugar: mockLugares[lugarIndex]
      });
    }
    return errorResponse('Reserva o lugar no encontrado');
  }

  try {
    const token = localStorage.getItem('smartpark_employee_token');
    const response = await fetch(`${API_BASE_URL}/api/reservas/${reservaId}/validar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ lugar_id: lugarId })
    });
    return await response.json();
  } catch (error) {
    return errorResponse('Error al asignar el lugar');
  }
};

// ==================== ESTADÍSTICAS ====================

export const getDailyStats = async () => {
  if (USE_MOCK_DATA) {
    await simulateDelay(300);
    
    const stats = {
      total_lugares: mockLugares.length,
      disponibles: mockLugares.filter(l => l.estado === 'disponible').length,
      ocupados: mockLugares.filter(l => l.estado === 'ocupado').length,
      reservados: mockLugares.filter(l => l.estado === 'reservado').length,
      reservas_pendientes: mockReservas.filter(r => r.estado === 'pendiente').length
    };
    
    return successResponse(stats);
  }

  try {
    const token = localStorage.getItem('smartpark_employee_token');
    const response = await fetch(`${API_BASE_URL}/api/estadisticas/empleado`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    return errorResponse('Error al obtener estadísticas');
  }
};

export default {
  loginEmployee,
  getPlaces,
  updatePlaceStatus,
  getPendingReservations,
  validateReservation,
  assignPlaceToReservation,
  getDailyStats
};

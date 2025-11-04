import API_CONFIG from '../config/api.js';
import {
  mockEmployees,
  mockLugares,
  mockReservas,
  mockOcupaciones,
  simulateNetworkDelay,
  mockSuccessResponse,
  mockErrorResponse,
} from './mockData.js';

/**
 * Servicio para operaciones de empleados
 * Incluye funciones para conectar con el backend y datos mock para pruebas
 */

// ==================== AUTENTICACIÓN ====================

/**
 * Login de empleado
 * @param {string} username - Usuario
 * @param {string} password - Contraseña
 * @returns {Promise} Datos del empleado autenticado
 */
export const loginEmployee = async (username, password) => {
  if (API_CONFIG.useMockData) {
    await simulateNetworkDelay(800);
    
    const employee = mockEmployees[username.toLowerCase()];
    if (employee && employee.password === password) {
      const { password: _, ...employeeData } = employee;
      return mockSuccessResponse({
        token: 'mock-jwt-token-' + Date.now(),
        employee: employeeData
      });
    }
    
    return mockErrorResponse('Usuario o contraseña incorrectos');
  }

  // TODO: Implementar llamada real al backend cuando esté listo
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.login}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return await response.json();
  } catch (error) {
    return mockErrorResponse('Error de conexión con el servidor');
  }
};

// ==================== GESTIÓN DE LUGARES ====================

/**
 * Obtener todos los lugares del estacionamiento
 * @param {number} estacionamientoId - ID del estacionamiento
 * @returns {Promise} Lista de lugares
 */
export const getPlaces = async (estacionamientoId) => {
  if (API_CONFIG.useMockData) {
    await simulateNetworkDelay(300);
    return mockSuccessResponse(mockLugares);
  }

  // TODO: Implementar llamada real al backend
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getPlaces}?estacionamiento_id=${estacionamientoId}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('smartpark_token')}`,
        },
      }
    );
    return await response.json();
  } catch (error) {
    return mockErrorResponse('Error al obtener los lugares');
  }
};

/**
 * Actualizar estado de un lugar
 * @param {number} lugarId - ID del lugar
 * @param {string} nuevoEstado - Nuevo estado (disponible, ocupado, reservado, mantenimiento)
 * @returns {Promise} Lugar actualizado
 */
export const updatePlaceStatus = async (lugarId, nuevoEstado) => {
  if (API_CONFIG.useMockData) {
    await simulateNetworkDelay(400);
    
    const lugarIndex = mockLugares.findIndex(l => l.id === lugarId);
    if (lugarIndex !== -1) {
      mockLugares[lugarIndex].estado = nuevoEstado;
      mockLugares[lugarIndex].actualizado_en = new Date().toISOString();
      return mockSuccessResponse(mockLugares[lugarIndex]);
    }
    
    return mockErrorResponse('Lugar no encontrado');
  }

  // TODO: Implementar llamada real al backend
  try {
    const url = API_CONFIG.endpoints.updatePlaceStatus.replace(':id', lugarId);
    const response = await fetch(`${API_CONFIG.baseURL}${url}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('smartpark_token')}`,
      },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    return await response.json();
  } catch (error) {
    return mockErrorResponse('Error al actualizar el lugar');
  }
};

// ==================== GESTIÓN DE RESERVAS ====================

/**
 * Obtener reservas pendientes
 * @returns {Promise} Lista de reservas pendientes
 */
export const getPendingReservations = async () => {
  if (API_CONFIG.useMockData) {
    await simulateNetworkDelay(400);
    return mockSuccessResponse(
      mockReservas.filter(r => r.estado === 'pendiente')
    );
  }

  // TODO: Implementar llamada real al backend
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.getReservations}?estado=pendiente`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('smartpark_token')}`,
        },
      }
    );
    return await response.json();
  } catch (error) {
    return mockErrorResponse('Error al obtener las reservas');
  }
};

/**
 * Validar una reserva por código
 * @param {string} code - Código numérico o QR
 * @returns {Promise} Datos de la reserva si es válida
 */
export const validateReservation = async (code) => {
  if (API_CONFIG.useMockData) {
    await simulateNetworkDelay(500);
    
    const reserva = mockReservas.find(
      r => r.codigo_numerico === code || r.codigo_qr === code
    );
    
    if (reserva) {
      return mockSuccessResponse({
        valid: true,
        reservation: reserva
      });
    }
    
    return mockSuccessResponse({
      valid: false,
      message: 'Código inválido'
    });
  }

  // TODO: Implementar llamada real al backend
  try {
    const url = API_CONFIG.endpoints.getReservationByCode.replace(':code', code);
    const response = await fetch(`${API_CONFIG.baseURL}${url}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('smartpark_token')}`,
      },
    });
    return await response.json();
  } catch (error) {
    return mockErrorResponse('Error al validar la reserva');
  }
};

/**
 * Asignar un lugar a una reserva
 * @param {number} reservaId - ID de la reserva
 * @param {number} lugarId - ID del lugar a asignar
 * @returns {Promise} Reserva actualizada
 */
export const assignPlaceToReservation = async (reservaId, lugarId) => {
  if (API_CONFIG.useMockData) {
    await simulateNetworkDelay(600);
    
    const reservaIndex = mockReservas.findIndex(r => r.id === reservaId);
    const lugarIndex = mockLugares.findIndex(l => l.id === lugarId);
    
    if (reservaIndex !== -1 && lugarIndex !== -1) {
      mockReservas[reservaIndex].lugar_id = lugarId;
      mockReservas[reservaIndex].estado = 'activa';
      mockLugares[lugarIndex].estado = 'ocupado';
      
      return mockSuccessResponse({
        reserva: mockReservas[reservaIndex],
        lugar: mockLugares[lugarIndex]
      });
    }
    
    return mockErrorResponse('Reserva o lugar no encontrado');
  }

  // TODO: Implementar llamada real al backend
  try {
    const url = API_CONFIG.endpoints.validateReservation.replace(':id', reservaId);
    const response = await fetch(`${API_CONFIG.baseURL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('smartpark_token')}`,
      },
      body: JSON.stringify({ lugar_id: lugarId }),
    });
    return await response.json();
  } catch (error) {
    return mockErrorResponse('Error al asignar el lugar');
  }
};

// ==================== GESTIÓN DE OCUPACIONES ====================

/**
 * Crear una nueva ocupación (entrada de vehículo)
 * @param {Object} ocupacionData - Datos de la ocupación
 * @returns {Promise} Ocupación creada
 */
export const createOccupation = async (ocupacionData) => {
  if (API_CONFIG.useMockData) {
    await simulateNetworkDelay(500);
    
    const newOcupacion = {
      id: mockOcupaciones.length + 1,
      ...ocupacionData,
      fecha_entrada: new Date().toISOString(),
      fecha_salida: null,
      costo: 0,
      estado: 'activa'
    };
    
    mockOcupaciones.push(newOcupacion);
    
    // Actualizar estado del lugar
    const lugarIndex = mockLugares.findIndex(l => l.id === ocupacionData.lugar_id);
    if (lugarIndex !== -1) {
      mockLugares[lugarIndex].estado = 'ocupado';
    }
    
    return mockSuccessResponse(newOcupacion);
  }

  // TODO: Implementar llamada real al backend
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.createOccupation}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('smartpark_token')}`,
      },
      body: JSON.stringify(ocupacionData),
    });
    return await response.json();
  } catch (error) {
    return mockErrorResponse('Error al crear la ocupación');
  }
};

/**
 * Finalizar una ocupación (salida de vehículo)
 * @param {number} ocupacionId - ID de la ocupación
 * @returns {Promise} Ocupación finalizada con costo calculado
 */
export const endOccupation = async (ocupacionId) => {
  if (API_CONFIG.useMockData) {
    await simulateNetworkDelay(500);
    
    const ocupacionIndex = mockOcupaciones.findIndex(o => o.id === ocupacionId);
    if (ocupacionIndex !== -1) {
      mockOcupaciones[ocupacionIndex].fecha_salida = new Date().toISOString();
      mockOcupaciones[ocupacionIndex].estado = 'finalizada';
      
      // Calcular costo (simplificado)
      const entrada = new Date(mockOcupaciones[ocupacionIndex].fecha_entrada);
      const salida = new Date();
      const horas = Math.ceil((salida - entrada) / (1000 * 60 * 60));
      mockOcupaciones[ocupacionIndex].costo = horas * 50; // $50 por hora
      
      // Liberar el lugar
      const lugarIndex = mockLugares.findIndex(
        l => l.id === mockOcupaciones[ocupacionIndex].lugar_id
      );
      if (lugarIndex !== -1) {
        mockLugares[lugarIndex].estado = 'disponible';
      }
      
      return mockSuccessResponse(mockOcupaciones[ocupacionIndex]);
    }
    
    return mockErrorResponse('Ocupación no encontrada');
  }

  // TODO: Implementar llamada real al backend
  try {
    const url = API_CONFIG.endpoints.endOccupation.replace(':id', ocupacionId);
    const response = await fetch(`${API_CONFIG.baseURL}${url}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('smartpark_token')}`,
      },
    });
    return await response.json();
  } catch (error) {
    return mockErrorResponse('Error al finalizar la ocupación');
  }
};

// ==================== ESTADÍSTICAS ====================

/**
 * Obtener estadísticas del día
 * @returns {Promise} Estadísticas
 */
export const getDailyStats = async () => {
  if (API_CONFIG.useMockData) {
    await simulateNetworkDelay(300);
    
    const stats = {
      total_lugares: mockLugares.length,
      disponibles: mockLugares.filter(l => l.estado === 'disponible').length,
      ocupados: mockLugares.filter(l => l.estado === 'ocupado').length,
      reservados: mockLugares.filter(l => l.estado === 'reservado').length,
      reservas_pendientes: mockReservas.filter(r => r.estado === 'pendiente').length,
      ocupaciones_activas: mockOcupaciones.filter(o => o.estado === 'activa').length,
    };
    
    return mockSuccessResponse(stats);
  }

  // TODO: Implementar llamada real al backend
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.getStats}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('smartpark_token')}`,
      },
    });
    return await response.json();
  } catch (error) {
    return mockErrorResponse('Error al obtener estadísticas');
  }
};

export default {
  loginEmployee,
  getPlaces,
  updatePlaceStatus,
  getPendingReservations,
  validateReservation,
  assignPlaceToReservation,
  createOccupation,
  endOccupation,
  getDailyStats,
};

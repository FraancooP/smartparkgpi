/**
 * Servicio de Empleado - SmartPark
 * Gestión de espacios, reservas y ocupaciones
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true' || false;

// Helper para simular delay de red (solo para desarrollo)
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper para respuestas
const successResponse = (data) => ({ success: true, data });
const errorResponse = (message) => ({ success: false, error: message });

// ==================== AUTENTICACIÓN ====================

export const loginEmployee = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        usuario: username, 
        contrasena: password,
        rol_solicitado: 'empleado'
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return errorResponse(data.error || 'Error al iniciar sesión');
    }
    
    // Verificar que el usuario tenga rol de empleado
    if (data.rol_activo !== 'empleado') {
      return errorResponse('No tienes permisos de empleado');
    }
    
    // Buscar el estacionamiento asignado al empleado usando el endpoint específico
    const parkingResponse = await fetch(`${API_BASE_URL}/employee/my-parking`, {
      headers: { 'Authorization': `Bearer ${data.token}` }
    });
    
    if (!parkingResponse.ok) {
      const errorData = await parkingResponse.json();
      return errorResponse(errorData.error || 'Error al obtener el estacionamiento asignado');
    }
    
    const parkingData = await parkingResponse.json();
    
    // Verificar que tenga un estacionamiento asignado
    if (!parkingData.estacionamiento) {
      return errorResponse('No tienes un estacionamiento asignado. Contacta al administrador.');
    }
    
    return successResponse({
      token: data.token,
      employee: {
        id: data.usuario.id,
        nombre: data.usuario.nombre,
        apellido: data.usuario.apellido,
        email: data.usuario.correo,
        nombre_usuario: data.usuario.nombre_usuario,
        rol_activo: data.rol_activo,
        estacionamiento_asignado: parkingData.estacionamiento.id,
        estacionamiento_nombre: parkingData.estacionamiento.nombre
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
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
      `${API_BASE_URL}/lugares?estacionamiento_id=${estacionamientoId}`,
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
    const response = await fetch(`${API_BASE_URL}/lugares/${lugarId}/estado`, {
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
      `${API_BASE_URL}/reservas?estado=pendiente`,
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
    const response = await fetch(`${API_BASE_URL}/reservas/codigo/${code}`, {
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
    const response = await fetch(`${API_BASE_URL}/reservas/${reservaId}/validar`, {
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
    const response = await fetch(`${API_BASE_URL}/estadisticas/empleado`, {
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

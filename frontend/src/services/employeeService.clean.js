/**
 * Servicio de Empleado - SmartPark
 * Gestión de espacios, reservas y ocupaciones (SIN MOCK DATA)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Helper para respuestas
const successResponse = (data) => ({ success: true, data });
const errorResponse = (message) => ({ success: false, error: message });

// ==================== AUTENTICACIÓN ====================

export const loginEmployee = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
    
    // Buscar el estacionamiento asignado al empleado
    const parkingResponse = await fetch(`${API_BASE_URL}/api/estacionamientos`, {
      headers: { 'Authorization': `Bearer ${data.token}` }
    });
    const parkingData = await parkingResponse.json();
    
    // Encontrar el estacionamiento donde este empleado está asignado
    const estacionamientoAsignado = parkingData.estacionamientos?.find(
      est => est.empleado_id === data.usuario.id
    );
    
    return successResponse({
      token: data.token,
      employee: {
        id: data.usuario.id,
        nombre: data.usuario.nombre,
        apellido: data.usuario.apellido,
        email: data.usuario.correo,
        nombre_usuario: data.usuario.nombre_usuario,
        rol_id: data.rol_activo,
        estacionamiento_asignado: estacionamientoAsignado?.id || null
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return errorResponse('Error de conexión con el servidor');
  }
};

// ==================== GESTIÓN DE LUGARES ====================

export const getPlaces = async (estacionamientoId) => {
  try {
    const token = localStorage.getItem('smartpark_employee_token');
    const response = await fetch(
      `${API_BASE_URL}/api/lugares?estacionamiento_id=${estacionamientoId}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await response.json();
    return successResponse(data.lugares || data);
  } catch (error) {
    return errorResponse('Error al obtener los lugares');
  }
};

export const updatePlaceStatus = async (lugarId, nuevoEstado) => {
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
    const data = await response.json();
    return successResponse(data);
  } catch (error) {
    return errorResponse('Error al actualizar el lugar');
  }
};

// ==================== GESTIÓN DE RESERVAS ====================

export const getPendingReservations = async () => {
  try {
    const token = localStorage.getItem('smartpark_employee_token');
    const response = await fetch(
      `${API_BASE_URL}/api/reservas?estado=pendiente`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await response.json();
    return successResponse(data);
  } catch (error) {
    return errorResponse('Error al obtener las reservas');
  }
};

export const validateReservation = async (code) => {
  try {
    const token = localStorage.getItem('smartpark_employee_token');
    const response = await fetch(`${API_BASE_URL}/api/reservas/codigo/${code}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    return successResponse(data);
  } catch (error) {
    return errorResponse('Error al validar la reserva');
  }
};

export const assignPlaceToReservation = async (reservaId, lugarId) => {
  try {
    const token = localStorage.getItem('smartpark_employee_token');
    const response = await fetch(`${API_BASE_URL}/api/reservas/${reservaId}/asignar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ lugar_id: lugarId })
    });
    const data = await response.json();
    return successResponse(data);
  } catch (error) {
    return errorResponse('Error al asignar el lugar');
  }
};

// ==================== ESTADÍSTICAS ====================

export const getDailyStats = async () => {
  try {
    const token = localStorage.getItem('smartpark_employee_token');
    const response = await fetch(`${API_BASE_URL}/api/estadisticas/empleado`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    return successResponse(data);
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

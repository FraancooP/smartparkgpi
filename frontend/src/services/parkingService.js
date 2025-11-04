import apiClient from './api'

/**
 * SERVICIOS DE ESTACIONAMIENTOS (PARKINGS)
 */

// Crear estacionamiento (Admin)
export const createParking = async (parkingData) => {
  const response = await apiClient.post('/admin/parkings', parkingData)
  return response.data
}

// Listar todos los estacionamientos (Público - para mapa del cliente)
export const getAllParkings = async () => {
  const response = await apiClient.get('/client/parkings')
  return response.data
}

// Obtener estacionamiento por ID
export const getParkingById = async (id) => {
  const response = await apiClient.get(`/client/parkings/${id}`)
  return response.data
}

// Listar mis estacionamientos (Admin logeado)
export const getMyParkings = async () => {
  const response = await apiClient.get('/admin/my-parkings')
  return response.data
}

// Actualizar estacionamiento (Admin dueño)
export const updateParking = async (id, parkingData) => {
  const response = await apiClient.put(`/admin/parkings/${id}`, parkingData)
  return response.data
}

// Eliminar estacionamiento (Admin dueño)
export const deleteParking = async (id) => {
  const response = await apiClient.delete(`/admin/parkings/${id}`)
  return response.data
}

// Asignar empleado a estacionamiento (Admin)
export const assignEmployee = async (estacionamientoId, empleadoId) => {
  const response = await apiClient.post('/admin/assign-employee', {
    estacionamiento_id: estacionamientoId,
    empleado_id: empleadoId
  })
  return response.data
}

/**
 * SERVICIOS DE LUGARES (SPOTS)
 */

// Crear lugar individual (Admin o Empleado)
export const createSpot = async (spotData) => {
  const response = await apiClient.post('/admin/spots', spotData)
  return response.data
}

// Crear múltiples lugares (Admin o Empleado)
export const createMultipleSpots = async (bulkData) => {
  const response = await apiClient.post('/admin/spots/bulk', bulkData)
  return response.data
}

// Obtener lugares de un estacionamiento (Admin o Empleado)
export const getSpotsByParking = async (estacionamientoId) => {
  const response = await apiClient.get(`/admin/parkings/${estacionamientoId}/spots`)
  return response.data
}

// Actualizar estado de lugar (Admin o Empleado)
export const updateSpotStatus = async (spotId, estado) => {
  const response = await apiClient.put(`/admin/spots/${spotId}/status`, { estado })
  return response.data
}

// Eliminar lugar (Admin o Empleado)
export const deleteSpot = async (spotId) => {
  const response = await apiClient.delete(`/admin/spots/${spotId}`)
  return response.data
}

/**
 * SERVICIOS PARA EMPLEADOS
 */

// Obtener estacionamiento asignado al empleado logeado
export const getMyParkingAsEmployee = async () => {
  const response = await apiClient.get('/employee/my-parking')
  return response.data
}

// Obtener lugares del estacionamiento asignado (Empleado)
export const getMyParkingSpots = async () => {
  const response = await apiClient.get('/employee/my-parking/spots')
  return response.data
}

// Actualizar estado de lugar (Empleado)
export const updateSpotStatusAsEmployee = async (spotId, estado) => {
  const response = await apiClient.put(`/employee/spots/${spotId}/status`, { estado })
  return response.data
}

// Crear lugar en mi estacionamiento (Empleado)
export const createSpotAsEmployee = async (spotData) => {
  const response = await apiClient.post('/employee/spots', spotData)
  return response.data
}

/**
 * SERVICIOS DE AUTENTICACIÓN
 */

// Registrar empleado (Admin)
export const registerEmployee = async (employeeData) => {
  const response = await apiClient.post('/auth/register-employee', employeeData)
  return response.data
}

// Login
export const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials)
  return response.data
}

// Registro cliente
export const registerClient = async (clientData) => {
  const response = await apiClient.post('/auth/register-client', clientData)
  return response.data
}

// Registro admin
export const registerAdmin = async (adminData) => {
  const response = await apiClient.post('/auth/register-admin', adminData)
  return response.data
}

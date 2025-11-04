// Datos mock para pruebas - estructurados según el modelo del backend

// Usuarios de prueba (empleados)
export const mockEmployees = {
  'emp001': {
    id: 1,
    nombre: 'Carlos Rodríguez',
    email: 'carlos@smartpark.com',
    username: 'emp001',
    password: '123456',
    rol_id: 3, // Rol empleado
    estacionamiento_asignado: 1,
    verificado: true
  },
  'emp002': {
    id: 2,
    nombre: 'María García',
    email: 'maria@smartpark.com',
    username: 'emp002',
    password: '123456',
    rol_id: 3,
    estacionamiento_asignado: 1,
    verificado: true
  },
};

// Estacionamiento de prueba
export const mockEstacionamiento = {
  id: 1,
  nombre_estacionamiento: 'Estacionamiento Central',
  latitud: -34.9011,
  longitud: -56.1645,
  informacion: 'Estacionamiento principal con 50 lugares',
  administrador_id: 1,
  empleado_id: 1,
};

// Lugares/espacios de estacionamiento de prueba
export const mockLugares = Array.from({ length: 50 }, (_, i) => {
  const random = Math.random();
  let estado;
  
  if (random < 0.4) {
    estado = 'disponible';
  } else if (random < 0.7) {
    estado = 'ocupado';
  } else {
    estado = 'reservado';
  }

  return {
    id: i + 1,
    numero_lugar: `A${(i + 1).toString().padStart(2, '0')}`,
    tipo: 'estandar',
    estado: estado,
    estacionamiento_id: 1,
    creado_en: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    actualizado_en: new Date().toISOString(),
  };
});

// Reservas pendientes de prueba
export const mockReservas = [
  {
    id: 1,
    codigo_numerico: '4567',
    codigo_qr: 'QR-4567-ABC123',
    tipo: 'horaria',
    estado: 'pendiente',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date(Date.now() + 300000).toTimeString().split(' ')[0], // 5 minutos
    tolerancia: 15,
    penalizacion: 0,
    usuario_id: 10,
    lugar_id: null,
    // Datos adicionales del usuario y vehículo (join)
    usuario: {
      nombre: 'Juan Pérez',
      email: 'juan@example.com'
    },
    vehiculo: {
      placa: 'ABC-123',
      modelo: 'Toyota Corolla',
      color: 'Blanco'
    }
  },
  {
    id: 2,
    codigo_numerico: '8901',
    codigo_qr: 'QR-8901-XYZ789',
    tipo: 'horaria',
    estado: 'pendiente',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date(Date.now() + 600000).toTimeString().split(' ')[0], // 10 minutos
    tolerancia: 15,
    penalizacion: 0,
    usuario_id: 11,
    lugar_id: null,
    usuario: {
      nombre: 'Ana López',
      email: 'ana@example.com'
    },
    vehiculo: {
      placa: 'XYZ-789',
      modelo: 'Honda Civic',
      color: 'Negro'
    }
  },
  {
    id: 3,
    codigo_numerico: '2345',
    codigo_qr: 'QR-2345-DEF456',
    tipo: 'horaria',
    estado: 'pendiente',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date(Date.now() + 900000).toTimeString().split(' ')[0], // 15 minutos
    tolerancia: 15,
    penalizacion: 0,
    usuario_id: 12,
    lugar_id: null,
    usuario: {
      nombre: 'Pedro García',
      email: 'pedro@example.com'
    },
    vehiculo: {
      placa: 'DEF-456',
      modelo: 'Ford Focus',
      color: 'Azul'
    }
  }
];

// Ocupaciones activas de prueba
export const mockOcupaciones = [
  {
    id: 1,
    lugar_id: 5,
    usuario_id: 13,
    vehiculo_id: 5,
    fecha_entrada: new Date(Date.now() - 1800000).toISOString(), // 30 minutos atrás
    fecha_salida: null,
    costo: 0,
    estado: 'activa'
  },
  {
    id: 2,
    lugar_id: 12,
    usuario_id: 14,
    vehiculo_id: 6,
    fecha_entrada: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
    fecha_salida: null,
    costo: 0,
    estado: 'activa'
  }
];

// Función helper para simular delay de red
export const simulateNetworkDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Función helper para generar respuesta exitosa
export const mockSuccessResponse = (data) => ({
  success: true,
  data,
  message: 'Operación exitosa'
});

// Función helper para generar respuesta de error
export const mockErrorResponse = (message) => ({
  success: false,
  error: message,
  data: null
});

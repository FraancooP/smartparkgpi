const { sequelize } = require('../config/database-sequelize');

// Importar todos los modelos
const Usuario = require('./Usuario');
const Rol = require('./Rol');
const Estacionamiento = require('./Estacionamiento');
const Lugar = require('./Lugar');
const Reserva = require('./Reserva');
const Pago = require('./Pago');
const Ocupacion = require('./Ocupacion');
const Vehiculo = require('./Vehiculo');

// ============================================
// DEFINIR TODAS LAS ASOCIACIONES
// ============================================

// 1. Usuario <-> Rol (1:1)
Usuario.hasOne(Rol, { 
  foreignKey: 'usuario_id', 
  as: 'rol',
  onDelete: 'CASCADE' 
});
Rol.belongsTo(Usuario, { 
  foreignKey: 'usuario_id', 
  as: 'usuario' 
});

// 2. Usuario (como Administrador) <-> Estacionamiento (1:N)
Usuario.hasMany(Estacionamiento, { 
  foreignKey: 'administrador_id', 
  as: 'estacionamientos_administrados',
  onDelete: 'CASCADE' 
});
Estacionamiento.belongsTo(Usuario, { 
  foreignKey: 'administrador_id', 
  as: 'administrador' 
});

// 3. Usuario (como Empleado) <-> Estacionamiento (1:N)
Usuario.hasMany(Estacionamiento, { 
  foreignKey: 'empleado_id', 
  as: 'estacionamientos_trabajados',
  onDelete: 'SET NULL' 
});
Estacionamiento.belongsTo(Usuario, { 
  foreignKey: 'empleado_id', 
  as: 'empleado' 
});

// 4. Estacionamiento <-> Lugar (1:N)
Estacionamiento.hasMany(Lugar, { 
  foreignKey: 'estacionamiento_id', 
  as: 'lugares',
  onDelete: 'CASCADE' 
});
Lugar.belongsTo(Estacionamiento, { 
  foreignKey: 'estacionamiento_id', 
  as: 'estacionamiento' 
});

// 5. Usuario <-> Vehiculo (1:N)
Usuario.hasMany(Vehiculo, { 
  foreignKey: 'usuario_id', 
  as: 'vehiculos',
  onDelete: 'CASCADE' 
});
Vehiculo.belongsTo(Usuario, { 
  foreignKey: 'usuario_id', 
  as: 'propietario' 
});

// 6. Usuario <-> Reserva (1:N)
Usuario.hasMany(Reserva, { 
  foreignKey: 'usuario_id', 
  as: 'reservas',
  onDelete: 'CASCADE' 
});
Reserva.belongsTo(Usuario, { 
  foreignKey: 'usuario_id', 
  as: 'usuario' 
});

// 7. Lugar <-> Reserva (1:N)
Lugar.hasMany(Reserva, { 
  foreignKey: 'lugar_id', 
  as: 'reservas',
  onDelete: 'CASCADE' 
});
Reserva.belongsTo(Lugar, { 
  foreignKey: 'lugar_id', 
  as: 'lugar' 
});

// 8. Reserva <-> Pago (1:1)
Reserva.hasOne(Pago, { 
  foreignKey: 'reserva_id', 
  as: 'pago',
  onDelete: 'CASCADE' 
});
Pago.belongsTo(Reserva, { 
  foreignKey: 'reserva_id', 
  as: 'reserva' 
});

// 9. Lugar <-> Ocupacion (1:N) - Historial
Lugar.hasMany(Ocupacion, { 
  foreignKey: 'lugar_id', 
  as: 'historial_ocupaciones',
  onDelete: 'CASCADE' 
});
Ocupacion.belongsTo(Lugar, { 
  foreignKey: 'lugar_id', 
  as: 'lugar' 
});

// 10. Reserva <-> Ocupacion (1:1)
Reserva.hasOne(Ocupacion, { 
  foreignKey: 'reserva_id', 
  as: 'ocupacion',
  onDelete: 'SET NULL' 
});
Ocupacion.belongsTo(Reserva, { 
  foreignKey: 'reserva_id', 
  as: 'reserva' 
});

// ============================================
// EXPORTAR TODOS LOS MODELOS
// ============================================
module.exports = {
  sequelize,
  Usuario,
  Rol,
  Estacionamiento,
  Lugar,
  Reserva,
  Pago,
  Ocupacion,
  Vehiculo
};
const { sequelize } = require('../config/database-sequelize');

// Importar todos los modelos
const Administrador = require('./Administrador');

// Aquí iremos agregando los demás modelos cuando los creemos:
// const Cliente = require('./Cliente');
// const Establecimiento = require('./Establecimiento');
// const Vehiculo = require('./Vehiculo');
// const Reserva = require('./Reserva');
// const Pago = require('./Pago');
// const Lugar = require('./Lugar');

// Definir asociaciones entre modelos aquí cuando las necesitemos
// Por ejemplo:
// Administrador.hasMany(Establecimiento, { foreignKey: 'administrador_id' });
// Establecimiento.belongsTo(Administrador, { foreignKey: 'administrador_id' });

// Exportar todos los modelos y la instancia de sequelize
module.exports = {
  sequelize,
  Administrador
  // Cliente,
  // Establecimiento,
  // Vehiculo,
  // Reserva,
  // Pago,
  // Lugar
};
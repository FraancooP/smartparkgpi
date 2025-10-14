const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sequelize');

const Pago = sequelize.define('Pago', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'procesando', 'completado', 'fallido', 'reembolsado'),
    defaultValue: 'pendiente',
    allowNull: false
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  metodo: {
    type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia', 'mercadopago', 'otro'),
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false
  },
  reserva_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'reservas',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  comprobante: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'pagos',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en'
});

module.exports = Pago;
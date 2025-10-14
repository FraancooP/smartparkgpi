const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sequelize');

const Reserva = sequelize.define('Reserva', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
    type: DataTypes.ENUM('horaria', 'diaria', 'mensual'),
    defaultValue: 'horaria',
    allowNull: false
  },
  penalizacion: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    allowNull: false
  },
  tolerancia: {
    type: DataTypes.INTEGER, // minutos de tolerancia
    defaultValue: 15,
    allowNull: false
  },
  codigo_qr: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  codigo_numerico: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'activa', 'completada', 'cancelada'),
    defaultValue: 'pendiente',
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  lugar_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'lugares',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'reservas',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en'
});

module.exports = Reserva;
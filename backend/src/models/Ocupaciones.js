const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sequelize');

const Ocupacion = sequelize.define('Ocupacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: true
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
  },
  reserva_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'reservas',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'ocupaciones',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en'
});

module.exports = Ocupacion;
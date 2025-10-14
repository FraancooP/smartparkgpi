const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sequelize');

const Lugar = sequelize.define('Lugar', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
    type: DataTypes.ENUM('estandar', 'discapacitado', 'electrico', 'moto'),
    defaultValue: 'estandar',
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('disponible', 'ocupado', 'reservado', 'mantenimiento'),
    defaultValue: 'disponible',
    allowNull: false
  },
  estacionamiento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'estacionamientos',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  numero_lugar: {
    type: DataTypes.STRING(10),
    allowNull: false
  }
}, {
  tableName: 'lugares',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en',
  indexes: [
    {
      unique: true,
      fields: ['estacionamiento_id', 'numero_lugar']
    }
  ]
});

module.exports = Lugar;
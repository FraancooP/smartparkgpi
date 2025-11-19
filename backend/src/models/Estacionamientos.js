const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sequelize');

const Estacionamiento = sequelize.define('Estacionamiento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_estacionamiento: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre del estacionamiento no puede estar vacío' }
    }
  },
  
  latitud: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
    validate: {
      min: -90,
      max: 90
    }
  },
  longitud: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
    validate: {
      min: -180,
      max: 180
    }
  },
  informacion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  matricula: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Matrícula o código de identificación del estacionamiento'
  },
  tarifa_moto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Tarifa por hora para motos (en pesos)'
  },
  tarifa_auto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Tarifa por hora para autos (en pesos)'
  },
  cantidad_lugares_auto: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'Cantidad total de lugares para autos'
  },
  cantidad_lugares_moto: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'Cantidad total de lugares para motos'
  },
  imagen_1: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800',
    comment: 'URL de la primera imagen del estacionamiento'
  },
  imagen_2: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800',
    comment: 'URL de la segunda imagen del estacionamiento'
  },
  imagen_3: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800',
    comment: 'URL de la tercera imagen del estacionamiento'
  },
  //Foranea de admin
  administrador_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  //foranea de empleado
  empleado_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'estacionamientos',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en'
});

module.exports = Estacionamiento;
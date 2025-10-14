const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sequelize');
const Rol = sequelize.define('Rol', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Un usuario solo puede tener un registro de roles
    references: {
      model: 'usuarios',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  rol_administrador: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  rol_usuario: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  rol_empleado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  tableName: 'roles',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en'
});

module.exports = Rol;
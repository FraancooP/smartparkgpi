const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sequelize');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  nombre_usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: { name: 'usuarios_nombre_usuario_unique', msg: 'El nombre de usuario ya está en uso' }
  },
  contrasena: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: { name: 'usuarios_correo_unique', msg: 'El correo ya está registrado' }
  },
  direccion: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  token_verificacion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Token para verificación de email y recuperación de contraseña'
  },
  verificacion_expiracion: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Expiración del token de verificación (24h)'
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo', 'pendiente_verificacion'),
    defaultValue: 'pendiente_verificacion',
    allowNull: false
  },
  dni: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: { name: 'usuarios_dni_unique', msg: 'El DNI ya está registrado' }
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en',
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.contrasena) {
        usuario.contrasena = await bcrypt.hash(usuario.contrasena, 10);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('contrasena')) {
        usuario.contrasena = await bcrypt.hash(usuario.contrasena, 10);
      }
    }
  }
});

module.exports = Usuario;
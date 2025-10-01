const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/database-sequelize');

const Administrador = sequelize.define('Administrador', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      name: 'administradores_nombre_usuario_unique',
      msg: 'El nombre de usuario ya está en uso'
    },
    validate: {
      notEmpty: {
        msg: 'El nombre de usuario no puede estar vacío'
      },
      len: {
        args: [3, 50],
        msg: 'El nombre de usuario debe tener entre 3 y 50 caracteres'
      }
    }
  },
  correo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: {
      name: 'administradores_correo_unique',
      msg: 'El correo ya está registrado'
    },
    validate: {
      isEmail: {
        msg: 'Debe ser un correo válido'
      },
      notEmpty: {
        msg: 'El correo no puede estar vacío'
      }
    }
  },
  contrasena: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La contraseña no puede estar vacía'
      },
      len: {
        args: [6, 255],
        msg: 'La contraseña debe tener al menos 6 caracteres'
      }
    }
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre no puede estar vacío'
      },
      len: {
        args: [2, 100],
        msg: 'El nombre debe tener entre 2 y 100 caracteres'
      }
    }
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El apellido no puede estar vacío'
      },
      len: {
        args: [2, 100],
        msg: 'El apellido debe tener entre 2 y 100 caracteres'
      }
    }
  },
  direccion: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      len: {
        args: [0, 500],
        msg: 'La dirección no puede tener más de 500 caracteres'
      }
    }
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      len: {
        args: [0, 20],
        msg: 'El teléfono no puede tener más de 20 caracteres'
      }
    }
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  token_expiracion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo', 'suspendido'),
    defaultValue: 'activo',
    allowNull: false
  },
  estacionamiento: {
    type: DataTypes.INTEGER,
    allowNull: true
    // Comentado temporalmente hasta crear el modelo Estacionamiento
    // references: {
    //   model: 'estacionamientos',
    //   key: 'id'
    // }
  }
}, {
  tableName: 'administradores',
  timestamps: true,
  createdAt: 'creado_en',
  updatedAt: 'actualizado_en',
  indexes: [
    {
      unique: true,
      fields: ['nombre_usuario']
    },
    {
      unique: true,
      fields: ['correo']
    },
    {
      fields: ['estado']
    }
  ],
  hooks: {
    // Hook para hashear la contraseña antes de crear
    beforeCreate: async (administrador) => {
      if (administrador.contrasena) {
        administrador.contrasena = await bcrypt.hash(administrador.contrasena, 10);
      }
    },
    // Hook para hashear la contraseña antes de actualizar
    beforeUpdate: async (administrador) => {
      if (administrador.changed('contrasena')) {
        administrador.contrasena = await bcrypt.hash(administrador.contrasena, 10);
      }
    }
  }
});

// Métodos de instancia
Administrador.prototype.validarContrasena = async function(contrasena) {
  return await bcrypt.compare(contrasena, this.contrasena);
};

Administrador.prototype.generarToken = function() {
  const token = jwt.sign(
    { 
      id: this.id, 
      nombre_usuario: this.nombre_usuario, 
      correo: this.correo,
      tipo: 'administrador'
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  // Guardar token y su expiración en la base de datos
  this.token = token;
  this.token_expiracion = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
  this.save();
  
  return token;
};

Administrador.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.contrasena; // No incluir la contraseña en las respuestas JSON
  return values;
};

// Métodos estáticos/de clase
Administrador.buscarPorCredenciales = async function(usuario, contrasena) {
  const admin = await this.findOne({
    where: {
      [sequelize.Sequelize.Op.or]: [
        { nombre_usuario: usuario },
        { correo: usuario }
      ],
      estado: 'activo'
    }
  });

  if (admin && await admin.validarContrasena(contrasena)) {
    return admin;
  }
  
  return null;
};

Administrador.buscarPorId = async function(id) {
  return await this.findOne({
    where: {
      id: id,
      estado: 'activo'
    }
  });
};

Administrador.buscarPorUsuario = async function(nombre_usuario) {
  return await this.findOne({
    where: {
      nombre_usuario: nombre_usuario,
      estado: 'activo'
    }
  });
};

Administrador.buscarPorCorreo = async function(correo) {
  return await this.findOne({
    where: {
      correo: correo,
      estado: 'activo'
    }
  });
};

Administrador.listarTodos = async function(filtros = {}) {
  const opciones = {
    where: {},
    order: [['creado_en', 'DESC']]
  };

  if (filtros.estado) {
    opciones.where.estado = filtros.estado;
  }

  if (filtros.busqueda) {
    opciones.where[sequelize.Sequelize.Op.or] = [
      { nombre: { [sequelize.Sequelize.Op.like]: `%${filtros.busqueda}%` } },
      { apellido: { [sequelize.Sequelize.Op.like]: `%${filtros.busqueda}%` } },
      { nombre_usuario: { [sequelize.Sequelize.Op.like]: `%${filtros.busqueda}%` } },
      { correo: { [sequelize.Sequelize.Op.like]: `%${filtros.busqueda}%` } }
    ];
  }

  return await this.findAll(opciones);
};

module.exports = Administrador;

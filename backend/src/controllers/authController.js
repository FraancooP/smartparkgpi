const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Usuario, Rol } = require('../models/Asociador_tablas');
const { Op } = require('sequelize');
const crypto = require('crypto');

/**
 * REGISTRO DE USUARIOS
 * El tipo de usuario se determina por el ENDPOINT que llama (desde el front)
 * - /api/auth/register-client → rol_usuario = true
 * - /api/auth/register-admin → rol_administrador = true
 * - Empleado lo registra el admin desde el dashboard
 */
exports.registerClient = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      nombre_usuario,
      correo,
      contrasena,
      telefono,
      direccion,
      dni
    } = req.body;

    // Validar campos requeridos
    if (!nombre || !apellido || !nombre_usuario || !correo || !contrasena) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: nombre, apellido, nombre_usuario, correo, contrasena'
      });
    }

    // Buscar si ya existe un usuario con ese correo o nombre de usuario
    const usuarioExistente = await Usuario.findOne({
      where: {
        [Op.or]: [
          { nombre_usuario: nombre_usuario },
          { correo: correo }
        ]
      },
      include: [{
        model: Rol,
        as: 'rol'
      }]
    });

    let usuario;
    let mensaje = 'Usuario registrado exitosamente';
    let esNuevo = false;
    let rolAgregado = false;
    let rolesExistentes = [];

    if (usuarioExistente) {
      // ====================================
      // CASO: Usuario ya existe - Verificar si puede agregar rol de cliente
      // ====================================
      
      // Verificar que la contraseña coincida
      const contrasenaValida = await bcrypt.compare(contrasena, usuarioExistente.contrasena);
      
      if (!contrasenaValida) {
        return res.status(400).json({ 
          error: 'Ya existe una cuenta con ese usuario o correo. Si es tu cuenta, inicia sesión.' 
        });
      }

      const rolExistente = usuarioExistente.rol;
      
      // Detectar qué roles tiene actualmente
      if (rolExistente.rol_administrador) rolesExistentes.push('Administrador');
      if (rolExistente.rol_empleado) rolesExistentes.push('Empleado');
      if (rolExistente.rol_usuario) rolesExistentes.push('Usuario/Cliente');
      
      // Verificar si ya tiene rol de usuario
      if (rolExistente.rol_usuario) {
        return res.status(400).json({ 
          error: 'Ya tienes una cuenta de usuario/cliente. Inicia sesión.',
          yaRegistrado: true,
          rolExistente: 'usuario'
        });
      }

      // Agregar el rol de usuario y generar nuevo token de verificación
      const tokenVerificacion = crypto.randomBytes(32).toString('hex');
      const tokenExpiracion = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

      await rolExistente.update({ rol_usuario: true });
      await usuarioExistente.update({
        token_verificacion: tokenVerificacion,
        verificacion_expiracion: tokenExpiracion,
        estado: 'pendiente_verificacion' // Requiere verificación del nuevo rol
      });

      usuario = usuarioExistente;
      rolAgregado = true;

      // Enviar email especial notificando el nuevo rol
      const { sendRoleAddedEmail } = require('../config/email');
      try {
        await sendRoleAddedEmail(correo, nombre, 'Usuario/Cliente', rolesExistentes, tokenVerificacion);
        console.log(`✅ Email de nuevo rol (Usuario) enviado a: ${correo}`);
      } catch (emailError) {
        console.error('❌ Error al enviar email:', emailError);
      }

      mensaje = `Hemos detectado que ya tienes cuenta registrada como ${rolesExistentes.join(' y ')}. 
      Se ha agregado el rol de Usuario/Cliente a tu cuenta. 
      Revisa tu email para activar este nuevo rol. 
      Tus credenciales son las mismas.`;
    } else {
      // ====================================
      // CASO: Usuario nuevo - Crear usuario y rol de cliente
      // ====================================

      // Generar token de verificación de email
      const tokenVerificacion = crypto.randomBytes(32).toString('hex');
      const tokenExpiracion = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

      usuario = await Usuario.create({
        nombre,
        apellido,
        nombre_usuario,
        correo,
        contrasena, // Se hasheará automáticamente por el hook
        telefono,
        direccion,
        dni,
        estado: 'pendiente_verificacion',
        token_verificacion: tokenVerificacion,
        verificacion_expiracion: tokenExpiracion
      });

      // Crear el registro de roles con rol_usuario = true
      await Rol.create({
        usuario_id: usuario.id,
        rol_administrador: false,
        rol_usuario: true, // ← CLIENTE
        rol_empleado: false
      });

      // Enviar email de verificación
      const { sendVerificationEmail } = require('../config/email');
      try {
        await sendVerificationEmail(correo, nombre, tokenVerificacion, 'Usuario/Cliente');
        console.log(`✅ Email de verificación (Usuario) enviado a: ${correo}`);
      } catch (emailError) {
        console.error('❌ Error al enviar email:', emailError);
        // No bloquear el registro si falla el email
      }

      esNuevo = true;
    }

    // ====================================
    // GENERAR JWT DE SESIÓN (NO SE GUARDA EN BD)
    // Este token incluye el ROL ACTIVO (usuario/cliente)
    // NOTA: El usuario puede loguearse pero algunas funciones pueden requerir email verificado
    // ====================================
    // ====================================
    const token = jwt.sign(
      {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        correo: usuario.correo,
        rol_activo: 'usuario' // ← Especifica que logueó como cliente/usuario
      },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '24h' }
    );

    // Cargar el usuario completo con sus roles actualizados
    const usuarioCompleto = await Usuario.findByPk(usuario.id, {
      include: [{
        model: Rol,
        as: 'rol'
      }],
      attributes: { exclude: ['contrasena', 'token_verificacion', 'verificacion_expiracion'] }
    });

    // Preparar respuesta
    const respuesta = {
      mensaje: esNuevo
        ? '✅ Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.'
        : mensaje,
      usuario: usuarioCompleto,
      token, // ← Frontend lo guarda en localStorage
      rolAgregado,
      rolesExistentes: rolAgregado ? rolesExistentes : []
    };

    // En development, incluir el token de verificación para testing
    if (esNuevo && process.env.NODE_ENV === 'development') {
      respuesta.token_verificacion = usuario.token_verificacion;
      respuesta.nota_desarrollo = 'Token de verificación incluido solo en modo desarrollo';
    }

    res.status(esNuevo ? 201 : 200).json(respuesta);

  } catch (error) {
    console.error('Error en registro de cliente:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: error.errors.map(e => e.message).join(', ')
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'El nombre de usuario, correo o DNI ya están en uso'
      });
    }

    res.status(500).json({
      error: 'Error al registrar usuario',
      detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * REGISTRO DE ADMINISTRADORES
 * Solo desde /admin/register del frontend
 */
exports.registerAdmin = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      nombre_usuario,
      correo,
      contrasena,
      telefono,
      direccion,
      dni
    } = req.body;

    // Validar campos requeridos
    if (!nombre || !apellido || !nombre_usuario || !correo || !contrasena) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: nombre, apellido, nombre_usuario, correo, contrasena'
      });
    }

    // Buscar si ya existe un usuario con ese correo o nombre de usuario
    const usuarioExistente = await Usuario.findOne({
      where: {
        [Op.or]: [
          { nombre_usuario: nombre_usuario },
          { correo: correo }
        ]
      },
      include: [{
        model: Rol,
        as: 'rol'
      }]
    });

    let usuario;
    let mensaje = 'Administrador registrado exitosamente. Revisa tu correo para verificar tu cuenta.';
    let esNuevo = false;
    let rolAgregado = false;
    let rolesExistentes = [];

    if (usuarioExistente) {
      // ====================================
      // CASO: Usuario ya existe - Verificar si puede agregar rol de admin
      // ====================================

      // Verificar que la contraseña coincida
      const contrasenaValida = await bcrypt.compare(contrasena, usuarioExistente.contrasena);

      if (!contrasenaValida) {
        return res.status(400).json({
          error: 'Ya existe una cuenta con ese usuario o correo. Si es tu cuenta, inicia sesión.'
        });
      }

      const rolExistente = usuarioExistente.rol;

      // Detectar qué roles tiene actualmente
      if (rolExistente.rol_usuario) rolesExistentes.push('Usuario/Cliente');
      if (rolExistente.rol_empleado) rolesExistentes.push('Empleado');
      if (rolExistente.rol_administrador) rolesExistentes.push('Administrador');

      // Verificar si ya tiene rol de administrador
      if (rolExistente.rol_administrador) {
        return res.status(400).json({
          error: 'Ya tienes una cuenta de administrador. Inicia sesión.',
          yaRegistrado: true,
          rolExistente: 'administrador'
        });
      }

      // Agregar el rol de administrador y generar nuevo token de verificación
      const tokenVerificacion = crypto.randomBytes(32).toString('hex');
      const tokenExpiracion = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

      await rolExistente.update({ rol_administrador: true });
      await usuarioExistente.update({
        token_verificacion: tokenVerificacion,
        verificacion_expiracion: tokenExpiracion,
        estado: 'pendiente_verificacion' // Requiere verificación del nuevo rol
      });

      usuario = usuarioExistente;
      rolAgregado = true;

      // Enviar email especial notificando el nuevo rol
      const { sendRoleAddedEmail } = require('../config/email');
      try {
        await sendRoleAddedEmail(correo, nombre, 'Administrador', rolesExistentes, tokenVerificacion);
        console.log(`✅ Email de nuevo rol (Administrador) enviado a: ${correo}`);
      } catch (emailError) {
        console.error('❌ Error al enviar email:', emailError);
      }

      mensaje = `Hemos detectado que ya tienes cuenta registrada como ${rolesExistentes.join(' y ')}. 
      Se ha agregado el rol de Administrador a tu cuenta. 
      Revisa tu email para activar este nuevo rol. 
      Tus credenciales son las mismas.`;

    } else {
      // ====================================
      // CASO: Usuario nuevo - Crear usuario y rol de admin
      // ====================================
      
      // Generar token de verificación de email
      const tokenVerificacion = crypto.randomBytes(32).toString('hex');
      const tokenExpiracion = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

      usuario = await Usuario.create({
        nombre,
        apellido,
        nombre_usuario,
        correo,
        contrasena, // Se hasheará automáticamente
        telefono,
        direccion,
        dni,
        estado: 'pendiente_verificacion',
        token_verificacion: tokenVerificacion,
        verificacion_expiracion: tokenExpiracion
      });

      // Crear el registro de roles con rol_administrador = true
      await Rol.create({
        usuario_id: usuario.id,
        rol_administrador: true, // ← ADMIN
        rol_usuario: false,
        rol_empleado: false
      });

      // Enviar email de verificación
      const { sendVerificationEmail } = require('../config/email');
      try {
        await sendVerificationEmail(correo, nombre, tokenVerificacion, 'Administrador');
        console.log(`✅ Email de verificación (Administrador) enviado a: ${correo}`);
      } catch (emailError) {
        console.error('❌ Error al enviar email:', emailError);
      }

      esNuevo = true;
    }

    // ====================================
    // GENERAR JWT DE SESIÓN (NO SE GUARDA EN BD)
    // Este token incluye el ROL ACTIVO (administrador)
    // ====================================
    const token = jwt.sign(
      {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        correo: usuario.correo,
        rol_activo: 'administrador' // ← Especifica que logueó como admin
      },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '24h' }
    );

    // Cargar el usuario completo con sus roles actualizados
    const usuarioCompleto = await Usuario.findByPk(usuario.id, {
      include: [{
        model: Rol,
        as: 'rol'
      }],
      attributes: { exclude: ['contrasena', 'token_verificacion', 'verificacion_expiracion'] }
    });

    // Preparar respuesta
    const respuesta = {
      mensaje,
      usuario: usuarioCompleto,
      token, // ← Frontend lo guarda en localStorage
      rolAgregado,
      rolesExistentes: rolAgregado ? rolesExistentes : []
    };

    // En development, incluir el token de verificación para testing
    if (esNuevo && process.env.NODE_ENV === 'development') {
      respuesta.token_verificacion = usuario.token_verificacion;
      respuesta.nota_desarrollo = 'Token de verificación incluido solo en modo desarrollo';
    }

    res.status(esNuevo ? 201 : 200).json(respuesta);

  } catch (error) {
    console.error('Error en registro de administrador:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: error.errors.map(e => e.message).join(', ')
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'El nombre de usuario, correo o DNI ya están en uso'
      });
    }

    res.status(500).json({
      error: 'Error al registrar administrador',
      detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * LOGIN UNIVERSAL
 * Funciona para cualquier tipo de usuario (admin, cliente, empleado)
 * El ROL ACTIVO se determina por el ENDPOINT que llama:
 * - /api/auth/login-client → rol_activo: 'usuario'
 * - /api/auth/login-admin → rol_activo: 'administrador'
 * - /api/auth/login-employee → rol_activo: 'empleado'
 */
exports.login = async (req, res) => {
  try {
    const { usuario, contrasena, rol_solicitado } = req.body;

    // Validar campos requeridos
    if (!usuario || !contrasena) {
      return res.status(400).json({
        error: 'Usuario/correo y contraseña son requeridos'
      });
    }

    // Buscar usuario por nombre de usuario o correo
    const usuarioEncontrado = await Usuario.findOne({
      where: {
        [Op.or]: [
          { nombre_usuario: usuario },
          { correo: usuario }
        ]
      },
      include: [{
        model: Rol,
        as: 'rol'
      }]
    });

    if (!usuarioEncontrado) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuarioEncontrado.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Verificar estado de la cuenta
    if (usuarioEncontrado.estado === 'inactivo') {
      return res.status(403).json({
        error: 'Cuenta inactiva. Contacta al administrador'
      });
    }

    if (usuarioEncontrado.estado === 'pendiente_verificacion') {
      return res.status(403).json({
        error: 'Cuenta pendiente de verificación. Revisa tu correo electrónico'
      });
    }

    // ====================================
    // VALIDAR QUE EL USUARIO TENGA EL ROL QUE INTENTA USAR
    // ====================================
    const rolesDisponibles = [];
    if (usuarioEncontrado.rol.rol_administrador) rolesDisponibles.push('administrador');
    if (usuarioEncontrado.rol.rol_usuario) rolesDisponibles.push('usuario');
    if (usuarioEncontrado.rol.rol_empleado) rolesDisponibles.push('empleado');

    // Determinar rol activo (viene del endpoint o por defecto el primero disponible)
    let rol_activo = rol_solicitado || rolesDisponibles[0];

    // Verificar que tenga el rol solicitado
    if (!rolesDisponibles.includes(rol_activo)) {
      return res.status(403).json({
        error: `No tienes permisos de ${rol_activo}`,
        roles_disponibles: rolesDisponibles
      });
    }

    // ====================================
    // GENERAR JWT DE SESIÓN (NO SE GUARDA EN BD)
    // Incluye el ROL ACTIVO para que el frontend sepa qué puede hacer
    // ====================================
    const token = jwt.sign(
      {
        id: usuarioEncontrado.id,
        nombre_usuario: usuarioEncontrado.nombre_usuario,
        correo: usuarioEncontrado.correo,
        rol_activo: rol_activo, // ← Define qué permisos tiene en esta sesión
        roles: rolesDisponibles  // ← Lista de todos los roles (para cambiar después)
      },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '24h' }
    );

    // Preparar respuesta sin contraseña ni tokens de verificación
    const usuarioRespuesta = usuarioEncontrado.toJSON();
    delete usuarioRespuesta.contrasena;
    delete usuarioRespuesta.token_verificacion;
    delete usuarioRespuesta.verificacion_expiracion;

    res.json({
      mensaje: 'Login exitoso',
      usuario: usuarioRespuesta,
      token, // ← Frontend guarda esto en localStorage
      rol_activo,
      roles_disponibles: rolesDisponibles
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error al iniciar sesión',
      detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * LOGOUT
 * Solo confirma el cierre de sesión
 * El frontend debe eliminar el token de localStorage
 */
exports.logout = async (req, res) => {
  try {
    res.json({
      mensaje: 'Sesión cerrada exitosamente. Elimina el token de localStorage.'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      error: 'Error al cerrar sesión'
    });
  }
};

/**
 * FORGOT PASSWORD (para cliente)
 * Genera un token_verificacion para restablecer contraseña
 */
exports.forgotPasswordClient = async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({
        error: 'El correo es requerido'
      });
    }

    const usuario = await Usuario.findOne({
      where: { correo },
      include: [{
        model: Rol,
        as: 'rol',
        where: { rol_usuario: true } // Solo clientes
      }]
    });

    if (!usuario) {
      // Por seguridad, siempre responder igual exista o no el correo
      return res.json({
        mensaje: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña'
      });
    }

    // ====================================
    // GENERAR TOKEN DE VERIFICACIÓN (este SÍ se guarda en BD)
    // ====================================
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiracion = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    usuario.token_verificacion = resetToken;
    usuario.verificacion_expiracion = resetTokenExpiracion;
    await usuario.save();

    // TODO: Enviar email con el link: /reset-password?token=resetToken
    console.log(`Token de recuperación (cliente) para ${correo}: ${resetToken}`);

    res.json({
      mensaje: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña',
      token: process.env.NODE_ENV === 'development' ? resetToken : undefined // Solo en dev
    });

  } catch (error) {
    console.error('Error en forgot password cliente:', error);
    res.status(500).json({
      error: 'Error al procesar solicitud de recuperación'
    });
  }
};

/**
 * FORGOT PASSWORD (para admin)
 * Genera un token_verificacion para restablecer contraseña
 */
exports.forgotPasswordAdmin = async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({
        error: 'El correo es requerido'
      });
    }

    const usuario = await Usuario.findOne({
      where: { correo },
      include: [{
        model: Rol,
        as: 'rol',
        where: { rol_administrador: true } // Solo admins
      }]
    });

    if (!usuario) {
      return res.json({
        mensaje: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña'
      });
    }

    // ====================================
    // GENERAR TOKEN DE VERIFICACIÓN (este SÍ se guarda en BD)
    // ====================================
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiracion = new Date(Date.now() + 60 * 60 * 1000);

    usuario.token_verificacion = resetToken;
    usuario.verificacion_expiracion = resetTokenExpiracion;
    await usuario.save();

    // TODO: Enviar email con el link: /reset-password?token=resetToken
    console.log(`Token de recuperación (admin) para ${correo}: ${resetToken}`);

    res.json({
      mensaje: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña',
      token: process.env.NODE_ENV === 'development' ? resetToken : undefined // Solo en dev
    });

  } catch (error) {
    console.error('Error en forgot password admin:', error);
    res.status(500).json({
      error: 'Error al procesar solicitud de recuperación'
    });
  }
};

/**
 * RESET PASSWORD
 * Valida el token_verificacion y cambia la contraseña
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, nueva_contrasena } = req.body;

    if (!token || !nueva_contrasena) {
      return res.status(400).json({
        error: 'Token y nueva contraseña son requeridos'
      });
    }

    // Buscar usuario con el token_verificacion válido
    const usuario = await Usuario.findOne({
      where: {
        token_verificacion: token,
        verificacion_expiracion: {
          [Op.gt]: new Date() // Token no expirado
        }
      }
    });

    if (!usuario) {
      return res.status(400).json({
        error: 'Token inválido o expirado'
      });
    }

    // Cambiar contraseña y limpiar token de verificación
    usuario.contrasena = nueva_contrasena; // Se hasheará automáticamente
    usuario.token_verificacion = null;
    usuario.verificacion_expiracion = null;
    await usuario.save();

    res.json({
      mensaje: 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión.'
    });

  } catch (error) {
    console.error('Error en reset password:', error);
    res.status(500).json({
      error: 'Error al restablecer contraseña'
    });
  }
};

/**
 * VERIFICAR TOKEN JWT DE SESIÓN
 * Extrae información del token (no consulta BD)
 */
exports.verifyToken = async (req, res) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // req.usuario ya viene del middleware verificarToken
    res.json({
      valido: true,
      usuario: req.usuario
    });

  } catch (error) {
    console.error('Error en verify token:', error);
    res.status(500).json({
      error: 'Error al verificar token'
    });
  }
};

/**
 * OBTENER PERFIL DEL USUARIO AUTENTICADO
 */
exports.getProfile = async (req, res) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // Consultar datos actualizados del usuario
    const usuario = await Usuario.findByPk(req.usuario.id, {
      include: [{
        model: Rol,
        as: 'rol'
      }],
      attributes: { exclude: ['contrasena', 'token_verificacion', 'verificacion_expiracion'] }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ usuario });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      error: 'Error al obtener perfil'
    });
  }
};

/**
 * VERIFICAR EMAIL
 * El usuario hace clic en el link del email y envía el token
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Token de verificación requerido'
      });
    }

    // Buscar usuario con el token de verificación válido
    const usuario = await Usuario.findOne({
      where: {
        token_verificacion: token,
        verificacion_expiracion: {
          [Op.gt]: new Date() // Token no expirado
        }
      }
    });

    if (!usuario) {
      return res.status(400).json({
        error: 'Token de verificación inválido o expirado. Solicita un nuevo email de verificación.'
      });
    }

    // Activar la cuenta y limpiar el token
    usuario.estado = 'activo';
    usuario.token_verificacion = null;
    usuario.verificacion_expiracion = null;
    await usuario.save();

    res.json({
      mensaje: '✅ Email verificado exitosamente. Ya puedes iniciar sesión con todas las funcionalidades.',
      usuario: {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        correo: usuario.correo,
        estado: usuario.estado
      }
    });

  } catch (error) {
    console.error('Error al verificar email:', error);
    res.status(500).json({
      error: 'Error al verificar email'
    });
  }
};

/**
 * REENVIAR EMAIL DE VERIFICACIÓN
 * Si el token expiró, el usuario puede solicitar uno nuevo
 */
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({
        error: 'El correo es requerido'
      });
    }

    const usuario = await Usuario.findOne({
      where: {
        correo,
        estado: 'pendiente_verificacion' // Solo si está pendiente
      }
    });

    if (!usuario) {
      // Por seguridad, siempre responder igual
      return res.json({
        mensaje: 'Si el correo existe y está pendiente de verificación, recibirás un nuevo email.'
      });
    }

    // Generar nuevo token
    const nuevoToken = crypto.randomBytes(32).toString('hex');
    const nuevaExpiracion = new Date(Date.now() + 24 * 60 * 60 * 1000);

    usuario.token_verificacion = nuevoToken;
    usuario.verificacion_expiracion = nuevaExpiracion;
    await usuario.save();

    // TODO: Enviar email
    console.log(`📧 Nuevo token de verificación para ${correo}: ${nuevoToken}`);

    res.json({
      mensaje: 'Si el correo existe y está pendiente de verificación, recibirás un nuevo email.',
      token: process.env.NODE_ENV === 'development' ? nuevoToken : undefined
    });

  } catch (error) {
    console.error('Error al reenviar email de verificación:', error);
    res.status(500).json({
      error: 'Error al procesar solicitud'
    });
  }
};
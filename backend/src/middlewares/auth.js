// middlewares/auth.js
const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar el token JWT de sesión
 * NO consulta la base de datos, solo valida el token y extrae la información
 * El token incluye: id, nombre_usuario, correo, rol_activo, roles
 */
const verificarToken = async (req, res, next) => {
  try {
    // Obtener token del header Authorization tipo "Bearer token..."
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    // El header suele tener el formato "Bearer <token>"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token mal formado' });
    }

    // Verificar y decodificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    
    // Agregar información del usuario al request (extraída del token)
    req.usuario = {
      id: decoded.id,
      nombre_usuario: decoded.nombre_usuario,
      correo: decoded.correo,
      rol_activo: decoded.rol_activo,      // 'usuario', 'administrador', o 'empleado'
      roles_disponibles: decoded.roles || [] // ['usuario', 'administrador']
    };

    next(); // Continuar con la siguiente función o ruta
  } catch (err) {
    console.error('Error al verificar token:', err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado. Por favor inicia sesión nuevamente' 
      });
    }
    
    return res.status(401).json({ error: 'Token inválido' });
  }
};

/**
 * Middleware para verificar que el usuario tiene rol de administrador ACTIVO
 */
const soloAdmin = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  
  if (req.usuario.rol_activo !== 'administrador') {
    return res.status(403).json({ 
      error: 'Acceso denegado. Debes iniciar sesión como administrador' 
    });
  }
  
  next();
};

/**
 * Middleware para verificar que el usuario tiene rol de usuario/cliente ACTIVO
 */
const soloUsuario = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  
  if (req.usuario.rol_activo !== 'usuario') {
    return res.status(403).json({ 
      error: 'Acceso denegado. Debes iniciar sesión como usuario/cliente' 
    });
  }
  
  next();
};

/**
 * Middleware para verificar que el usuario tiene rol de empleado ACTIVO
 */
const soloEmpleado = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  
  if (req.usuario.rol_activo !== 'empleado') {
    return res.status(403).json({ 
      error: 'Acceso denegado. Debes iniciar sesión como empleado' 
    });
  }
  
  next();
};

/**
 * Middleware para verificar que el usuario tiene el ROL ACTIVO en la lista especificada
 * Uso: requireRoles(['administrador', 'empleado'])
 */
const requireRoles = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!rolesPermitidos.includes(req.usuario.rol_activo)) {
      return res.status(403).json({ 
        error: `Acceso denegado. Roles permitidos: ${rolesPermitidos.join(', ')}`,
        tu_rol_activo: req.usuario.rol_activo
      });
    }

    next();
  };
};

const verificarEmailVerificado = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    
    if (usuario.estado !== 'activo') {
      return res.status(403).json({
        error: 'Debes verificar tu email antes de acceder a esta funcionalidad',
        estado: usuario.estado
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar estado del usuario' });
  }
};

module.exports = { 
  verificarToken, 
  soloAdmin, 
  soloUsuario, 
  soloEmpleado,
  requireRoles,
  verificarEmailVerificado
};
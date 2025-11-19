const { Estacionamiento, Usuario, Lugar, Rol } = require('../models/Asociador_tablas');
const { sequelize } = require('../config/database-sequelize');
const bcrypt = require('bcrypt');

/**
 * CREAR ESTACIONAMIENTO CON EMPLEADOS (Solo Admin)
 */
exports.createParking = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      nombre,
      lat,
      lng,
      informacion,
      cantidad_lugares_auto,
      cantidad_lugares_moto,
      matricula,
      tarifa_moto,
      tarifa_auto,
      empleados
    } = req.body;

    // Validar campos requeridos
    if (!nombre || !lat || !lng) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Faltan campos requeridos: nombre, lat, lng'
      });
    }

    // Validar que haya al menos un lugar (auto o moto)
    const totalLugares = (parseInt(cantidad_lugares_auto) || 0) + (parseInt(cantidad_lugares_moto) || 0);
    if (totalLugares === 0) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Debe haber al menos un lugar (auto o moto)'
      });
    }

    // Validar que haya al menos un empleado
    if (!empleados || empleados.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Debe agregar al menos un empleado'
      });
    }

    // Validar rango de coordenadas
    if (lat < -90 || lat > 90) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Latitud debe estar entre -90 y 90'
      });
    }

    if (lng < -180 || lng > 180) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Longitud debe estar entre -180 y 180'
      });
    }

    // Obtener el ID del administrador desde el token
    const administrador_id = req.usuario.id;

    console.log('📋 Creando estacionamiento:', nombre);
    
    // 1. Crear el estacionamiento
    const nuevoEstacionamiento = await Estacionamiento.create({
      nombre_estacionamiento: nombre,
      latitud: lat,
      longitud: lng,
      informacion: informacion || `${nombre} - Ubicación: Lat ${lat}, Lng ${lng}`,
      administrador_id,
      matricula: matricula || null,
      tarifa_moto: tarifa_moto || null,
      tarifa_auto: tarifa_auto || null,
      cantidad_lugares_auto: parseInt(cantidad_lugares_auto) || 0,
      cantidad_lugares_moto: parseInt(cantidad_lugares_moto) || 0
    }, { transaction });

    console.log('✅ Estacionamiento creado con ID:', nuevoEstacionamiento.id);

    // 2. Registrar cada empleado
    const empleadosCreados = [];
    
    for (const empleadoData of empleados) {
      // Validar que el empleado tenga credenciales
      if (!empleadoData.nombre_usuario || !empleadoData.contrasena || !empleadoData.correo) {
        await transaction.rollback();
        return res.status(400).json({
          error: `El empleado ${empleadoData.nombre} ${empleadoData.apellido} debe tener nombre de usuario, email y contraseña`
        });
      }

      // Verificar si el usuario ya existe
      const usuarioExistente = await Usuario.findOne({
        where: { nombre_usuario: empleadoData.nombre_usuario }
      });

      if (usuarioExistente) {
        await transaction.rollback();
        return res.status(400).json({
          error: `El nombre de usuario "${empleadoData.nombre_usuario}" ya está en uso`
        });
      }

      // Verificar si el correo ya existe
      const correoExistente = await Usuario.findOne({
        where: { correo: empleadoData.correo }
      });

      if (correoExistente) {
        await transaction.rollback();
        return res.status(400).json({
          error: `El email "${empleadoData.correo}" ya está en uso`
        });
      }

      // Verificar si el DNI ya existe
      if (empleadoData.dni) {
        const dniExistente = await Usuario.findOne({
          where: { dni: empleadoData.dni }
        });

        if (dniExistente) {
          await transaction.rollback();
          return res.status(400).json({
            error: `El DNI "${empleadoData.dni}" ya está registrado`
          });
        }
      }

      // Crear el empleado (la contraseña se hasheará automáticamente por el hook beforeCreate)
      const nuevoEmpleado = await Usuario.create({
        nombre: empleadoData.nombre,
        apellido: empleadoData.apellido,
        nombre_usuario: empleadoData.nombre_usuario,
        correo: empleadoData.correo,
        contrasena: empleadoData.contrasena, // Se hasheará automáticamente
        direccion: empleadoData.direccion || null,
        telefono: empleadoData.telefono || null,
        dni: empleadoData.dni || null,
        estado: 'activo' // Activar directamente sin verificación de email
      }, { transaction });

      console.log(`✅ Empleado creado: ${nuevoEmpleado.nombre_usuario} (ID: ${nuevoEmpleado.id})`);

      // Crear el rol para el empleado
      await Rol.create({
        usuario_id: nuevoEmpleado.id,
        rol_empleado: true,
        rol_administrador: false,
        rol_usuario: false
      }, { transaction });

      console.log(`✅ Rol de empleado asignado a ${nuevoEmpleado.nombre_usuario}`);

      empleadosCreados.push(nuevoEmpleado);
    }

    // 3. Asignar el primer empleado al estacionamiento
    await nuevoEstacionamiento.update({
      empleado_id: empleadosCreados[0].id
    }, { transaction });

    console.log(`✅ Empleado ${empleadosCreados[0].nombre_usuario} asignado al estacionamiento`);

    // 4. Crear lugares automáticamente según tipo de vehículo
    const lugaresACrear = [];
    let numeroLugar = 1;

    // Crear lugares para autos
    const cantidadAutos = parseInt(cantidad_lugares_auto) || 0;
    for (let i = 0; i < cantidadAutos; i++) {
      lugaresACrear.push({
        estacionamiento_id: nuevoEstacionamiento.id,
        tipo: 'estandar', // Lugares para auto son estándar
        estado: 'disponible',
        numero_lugar: `A${numeroLugar++}` // A1, A2, A3... para autos
      });
    }

    // Crear lugares para motos
    const cantidadMotos = parseInt(cantidad_lugares_moto) || 0;
    numeroLugar = 1; // Reiniciar contador para motos
    for (let i = 0; i < cantidadMotos; i++) {
      lugaresACrear.push({
        estacionamiento_id: nuevoEstacionamiento.id,
        tipo: 'moto', // Tipo específico para motos
        estado: 'disponible',
        numero_lugar: `M${numeroLugar++}` // M1, M2, M3... para motos
      });
    }

    await Lugar.bulkCreate(lugaresACrear, { transaction });
    console.log(`✅ ${totalLugares} lugares creados (${cantidadAutos} autos, ${cantidadMotos} motos)`);

    // Commit de la transacción
    await transaction.commit();

    // Emitir evento Socket.io para notificar a todos los clientes
    if (req.io) {
      req.io.emit('parking-created', {
        id: nuevoEstacionamiento.id,
        nombre: nuevoEstacionamiento.nombre_estacionamiento,
        lat: parseFloat(nuevoEstacionamiento.latitud),
        lng: parseFloat(nuevoEstacionamiento.longitud),
        informacion: nuevoEstacionamiento.informacion,
        imagen_1: nuevoEstacionamiento.imagen_1,
        imagen_2: nuevoEstacionamiento.imagen_2,
        imagen_3: nuevoEstacionamiento.imagen_3,
        tarifa_moto: parseFloat(nuevoEstacionamiento.tarifa_moto) || 0,
        tarifa_auto: parseFloat(nuevoEstacionamiento.tarifa_auto) || 0,
        cantidad_lugares_auto: cantidadAutos,
        cantidad_lugares_moto: cantidadMotos
      });
      console.log(`📡 Evento Socket.io emitido: parking-created (ID: ${nuevoEstacionamiento.id})`);
    }

    res.status(201).json({
      mensaje: 'Estacionamiento creado exitosamente con empleados',
      estacionamiento: {
        id: nuevoEstacionamiento.id,
        nombre: nuevoEstacionamiento.nombre_estacionamiento,
        lat: parseFloat(nuevoEstacionamiento.latitud),
        lng: parseFloat(nuevoEstacionamiento.longitud),
        informacion: nuevoEstacionamiento.informacion,
        cantidad_lugares_auto: cantidadAutos,
        cantidad_lugares_moto: cantidadMotos,
        empleados: empleadosCreados.map(e => ({
          id: e.id,
          nombre: e.nombre,
          apellido: e.apellido,
          usuario: e.nombre_usuario,
          correo: e.correo
        }))
      }
    });

  } catch (error) {
    // Solo hacer rollback si la transacción NO está finalizada
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error('❌ Error al crear estacionamiento:', error);
    res.status(500).json({
      error: 'Error al crear el estacionamiento',
      detalle: error.message
    });
  }
};


/**
 * LISTAR TODOS LOS ESTACIONAMIENTOS (Público - para mostrar en mapa del cliente)
 */
exports.getAllParkings = async (req, res) => {
  try {
    const estacionamientos = await Estacionamiento.findAll({
      include: [
        {
          model: Usuario,
          as: 'administrador',
          attributes: ['id', 'nombre', 'apellido', 'correo']
        },
        {
          model: Usuario,
          as: 'empleado',
          attributes: ['id', 'nombre', 'apellido', 'correo'],
          required: false
        },
        {
          model: Lugar,
          as: 'lugares',
          attributes: ['id', 'tipo', 'estado', 'numero_lugar']
        }
      ],
      order: [['creado_en', 'DESC']]
    });

    // Calcular disponibilidad para cada estacionamiento
    const estacionamientosConDisponibilidad = estacionamientos.map(estacionamiento => {
      const lugares = estacionamiento.lugares || [];
      const totalLugares = lugares.length;
      const lugaresDisponibles = lugares.filter(l => l.estado === 'disponible').length;
      const lugaresOcupados = lugares.filter(l => l.estado === 'ocupado').length;
      const lugaresReservados = lugares.filter(l => l.estado === 'reservado').length;

      // Calcular porcentaje de disponibilidad
      let porcentajeDisponible = 0;
      if (totalLugares > 0) {
        porcentajeDisponible = Math.round((lugaresDisponibles / totalLugares) * 100);
      }

      // Determinar color según disponibilidad
      let color = 'gray'; // Sin lugares
      if (totalLugares > 0) {
        if (porcentajeDisponible >= 70) {
          color = 'green'; // Alto disponibilidad
        } else if (porcentajeDisponible >= 30) {
          color = 'yellow'; // Disponibilidad media
        } else {
          color = 'red'; // Baja disponibilidad
        }
      }

      return {
        id: estacionamiento.id,
        nombre: estacionamiento.nombre_estacionamiento,
        lat: parseFloat(estacionamiento.latitud),
        lng: parseFloat(estacionamiento.longitud),
        informacion: estacionamiento.informacion,
        administrador: estacionamiento.administrador ? {
          id: estacionamiento.administrador.id,
          nombre: `${estacionamiento.administrador.nombre} ${estacionamiento.administrador.apellido}`
        } : null,
        empleado: estacionamiento.empleado ? {
          id: estacionamiento.empleado.id,
          nombre: `${estacionamiento.empleado.nombre} ${estacionamiento.empleado.apellido}`
        } : null,
        disponibilidad: {
          total: totalLugares,
          disponibles: lugaresDisponibles,
          ocupados: lugaresOcupados,
          reservados: lugaresReservados,
          porcentaje: porcentajeDisponible,
          color: color
        },
        creado_en: estacionamiento.creado_en
      };
    });

    res.json({
      total: estacionamientosConDisponibilidad.length,
      estacionamientos: estacionamientosConDisponibilidad
    });

  } catch (error) {
    console.error('Error al obtener estacionamientos:', error);
    res.status(500).json({
      error: 'Error al obtener los estacionamientos',
      detalle: error.message
    });
  }
};

/**
 * OBTENER ESTACIONAMIENTO POR ID
 */
exports.getParkingById = async (req, res) => {
  try {
    const { id } = req.params;

    const estacionamiento = await Estacionamiento.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'administrador',
          attributes: ['id', 'nombre', 'apellido', 'correo']
        },
        {
          model: Usuario,
          as: 'empleado',
          attributes: ['id', 'nombre', 'apellido', 'correo'],
          required: false
        },
        {
          model: Lugar,
          as: 'lugares',
          attributes: ['id', 'tipo', 'estado', 'numero_lugar']
        }
      ]
    });

    if (!estacionamiento) {
      return res.status(404).json({
        error: 'Estacionamiento no encontrado'
      });
    }

    // Calcular disponibilidad
    const lugares = estacionamiento.lugares || [];
    const totalLugares = lugares.length;
    const lugaresDisponibles = lugares.filter(l => l.estado === 'disponible').length;

    res.json({
      id: estacionamiento.id,
      nombre: estacionamiento.nombre_estacionamiento,
      lat: parseFloat(estacionamiento.latitud),
      lng: parseFloat(estacionamiento.longitud),
      informacion: estacionamiento.informacion,
      administrador: estacionamiento.administrador,
      empleado: estacionamiento.empleado,
      lugares: lugares,
      disponibilidad: {
        total: totalLugares,
        disponibles: lugaresDisponibles
      }
    });

  } catch (error) {
    console.error('Error al obtener estacionamiento:', error);
    res.status(500).json({
      error: 'Error al obtener el estacionamiento',
      detalle: error.message
    });
  }
};

/**
 * LISTAR ESTACIONAMIENTOS DEL ADMIN LOGEADO
 */
exports.getMyParkings = async (req, res) => {
  try {
    const administrador_id = req.usuario.id;

    const estacionamientos = await Estacionamiento.findAll({
      where: { administrador_id },
      include: [
        {
          model: Usuario,
          as: 'empleado',
          attributes: ['id', 'nombre', 'apellido', 'correo'],
          required: false
        },
        {
          model: Lugar,
          as: 'lugares',
          attributes: ['id', 'tipo', 'estado', 'numero_lugar']
        }
      ],
      order: [['creado_en', 'DESC']]
    });

    res.json({
      total: estacionamientos.length,
      estacionamientos
    });

  } catch (error) {
    console.error('Error al obtener mis estacionamientos:', error);
    res.status(500).json({
      error: 'Error al obtener los estacionamientos',
      detalle: error.message
    });
  }
};

/**
 * ACTUALIZAR ESTACIONAMIENTO (Solo el admin dueño)
 */
exports.updateParking = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre_estacionamiento,
      latitud,
      longitud,
      informacion
    } = req.body;

    const estacionamiento = await Estacionamiento.findByPk(id);

    if (!estacionamiento) {
      return res.status(404).json({
        error: 'Estacionamiento no encontrado'
      });
    }

    // Verificar que el admin sea el dueño
    if (estacionamiento.administrador_id !== req.usuario.id) {
      return res.status(403).json({
        error: 'No tienes permiso para editar este estacionamiento'
      });
    }

    // Actualizar campos
    const datosActualizados = {};
    if (nombre_estacionamiento) datosActualizados.nombre_estacionamiento = nombre_estacionamiento;
    if (latitud) datosActualizados.latitud = latitud;
    if (longitud) datosActualizados.longitud = longitud;
    if (informacion !== undefined) datosActualizados.informacion = informacion;

    await estacionamiento.update(datosActualizados);

    res.json({
      mensaje: 'Estacionamiento actualizado exitosamente',
      estacionamiento
    });

  } catch (error) {
    console.error('Error al actualizar estacionamiento:', error);
    res.status(500).json({
      error: 'Error al actualizar el estacionamiento',
      detalle: error.message
    });
  }
};

/**
 * ELIMINAR ESTACIONAMIENTO (Solo el admin dueño)
 */
exports.deleteParking = async (req, res) => {
  try {
    const { id } = req.params;

    const estacionamiento = await Estacionamiento.findByPk(id);

    if (!estacionamiento) {
      return res.status(404).json({
        error: 'Estacionamiento no encontrado'
      });
    }

    // Verificar que el admin sea el dueño
    if (estacionamiento.administrador_id !== req.usuario.id) {
      return res.status(403).json({
        error: 'No tienes permiso para eliminar este estacionamiento'
      });
    }

    await estacionamiento.destroy();

    res.json({
      mensaje: 'Estacionamiento eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar estacionamiento:', error);
    res.status(500).json({
      error: 'Error al eliminar el estacionamiento',
      detalle: error.message
    });
  }
};

/**
 * ASIGNAR EMPLEADO A ESTACIONAMIENTO (Solo el admin dueño)
 */
exports.assignEmployee = async (req, res) => {
  try {
    const { estacionamiento_id, empleado_id } = req.body;

    if (!estacionamiento_id || !empleado_id) {
      return res.status(400).json({
        error: 'Faltan campos: estacionamiento_id, empleado_id'
      });
    }

    // Buscar estacionamiento
    const estacionamiento = await Estacionamiento.findByPk(estacionamiento_id);

    if (!estacionamiento) {
      return res.status(404).json({
        error: 'Estacionamiento no encontrado'
      });
    }

    // Verificar que el admin sea el dueño
    if (estacionamiento.administrador_id !== req.usuario.id) {
      return res.status(403).json({
        error: 'No tienes permiso para asignar empleados a este estacionamiento'
      });
    }

    // Verificar que el empleado existe y tiene rol de empleado
    const empleado = await Usuario.findByPk(empleado_id, {
      include: [{
        model: require('./Roles'),
        as: 'rol'
      }]
    });

    if (!empleado) {
      return res.status(404).json({
        error: 'Empleado no encontrado'
      });
    }

    if (!empleado.rol || !empleado.rol.rol_empleado) {
      return res.status(400).json({
        error: 'El usuario seleccionado no tiene rol de empleado'
      });
    }

    // Asignar empleado
    await estacionamiento.update({ empleado_id });

    res.json({
      mensaje: 'Empleado asignado exitosamente',
      estacionamiento: {
        id: estacionamiento.id,
        nombre: estacionamiento.nombre_estacionamiento,
        empleado: {
          id: empleado.id,
          nombre: `${empleado.nombre} ${empleado.apellido}`
        }
      }
    });

  } catch (error) {
    console.error('Error al asignar empleado:', error);
    res.status(500).json({
      error: 'Error al asignar empleado',
      detalle: error.message
    });
  }
};

/**
 * OBTENER ESTACIONAMIENTO ASIGNADO AL EMPLEADO (Solo Empleado)
 */
exports.getMyParkingAsEmployee = async (req, res) => {
  try {
    const empleadoId = req.usuario.id;

    // Buscar el estacionamiento donde este empleado está asignado
    const estacionamiento = await Estacionamiento.findOne({
      where: { empleado_id: empleadoId },
      include: [{
        model: Lugar,
        as: 'lugares',
        attributes: ['id', 'numero_lugar', 'tipo', 'estado', 'ocupado_desde']
      }]
    });

    if (!estacionamiento) {
      return res.status(404).json({
        error: 'No tienes un estacionamiento asignado. Contacta al administrador.'
      });
    }

    res.json({
      estacionamiento: {
        id: estacionamiento.id,
        nombre: estacionamiento.nombre_estacionamiento,
        informacion: estacionamiento.informacion,
        latitud: estacionamiento.latitud,
        longitud: estacionamiento.longitud,
        tarifa_auto: estacionamiento.tarifa_auto,
        tarifa_moto: estacionamiento.tarifa_moto,
        cantidad_lugares_auto: estacionamiento.cantidad_lugares_auto,
        cantidad_lugares_moto: estacionamiento.cantidad_lugares_moto
      },
      lugares: estacionamiento.lugares || []
    });

  } catch (error) {
    console.error('Error al obtener estacionamiento del empleado:', error);
    res.status(500).json({
      error: 'Error al obtener estacionamiento',
      detalle: error.message
    });
  }
};

module.exports = exports;

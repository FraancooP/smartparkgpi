const { Estacionamiento, Usuario, Lugar } = require('../models/Asociador_tablas');
const { sequelize } = require('../config/database-sequelize');

/**
 * CREAR ESTACIONAMIENTO (Solo Admin)
 */
exports.createParking = async (req, res) => {
  try {
    const {
      nombre_estacionamiento,
      latitud,
      longitud,
      informacion
    } = req.body;

    // Validar campos requeridos
    if (!nombre_estacionamiento || !latitud || !longitud) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: nombre_estacionamiento, latitud, longitud'
      });
    }

    // Validar rango de coordenadas
    if (latitud < -90 || latitud > 90) {
      return res.status(400).json({
        error: 'Latitud debe estar entre -90 y 90'
      });
    }

    if (longitud < -180 || longitud > 180) {
      return res.status(400).json({
        error: 'Longitud debe estar entre -180 y 180'
      });
    }

    // Obtener el ID del administrador desde el token (req.usuario viene del middleware)
    const administrador_id = req.usuario.id;

    // Crear el estacionamiento
    const nuevoEstacionamiento = await Estacionamiento.create({
      nombre_estacionamiento,
      latitud,
      longitud,
      informacion: informacion || null,
      administrador_id
    });

    res.status(201).json({
      mensaje: 'Estacionamiento creado exitosamente',
      estacionamiento: {
        id: nuevoEstacionamiento.id,
        nombre: nuevoEstacionamiento.nombre_estacionamiento,
        latitud: parseFloat(nuevoEstacionamiento.latitud),
        longitud: parseFloat(nuevoEstacionamiento.longitud),
        informacion: nuevoEstacionamiento.informacion,
        administrador_id: nuevoEstacionamiento.administrador_id,
        creado_en: nuevoEstacionamiento.creado_en
      }
    });

  } catch (error) {
    console.error('Error al crear estacionamiento:', error);
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

module.exports = exports;

const { Lugar, Estacionamiento, Ocupacion } = require('../models/Asociador_tablas');
const { Op } = require('sequelize');

/**
 * CREAR LUGAR/SPOT (Admin o Empleado del estacionamiento)
 */
exports.createSpot = async (req, res) => {
  try {
    const {
      estacionamiento_id,
      numero_lugar,
      tipo // 'estandar', 'discapacitado', 'electrico', 'moto'
    } = req.body;

    // Validar campos requeridos
    if (!estacionamiento_id || !numero_lugar) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: estacionamiento_id, numero_lugar'
      });
    }

    // Verificar que el estacionamiento existe
    const estacionamiento = await Estacionamiento.findByPk(estacionamiento_id);

    if (!estacionamiento) {
      return res.status(404).json({
        error: 'Estacionamiento no encontrado'
      });
    }

    // Verificar permisos (admin dueño o empleado asignado)
    const esAdmin = estacionamiento.administrador_id === req.usuario.id;
    const esEmpleado = estacionamiento.empleado_id === req.usuario.id;

    if (!esAdmin && !esEmpleado) {
      return res.status(403).json({
        error: 'No tienes permiso para crear lugares en este estacionamiento'
      });
    }

    // Verificar que no exista un lugar con ese número en el estacionamiento
    const lugarExistente = await Lugar.findOne({
      where: {
        estacionamiento_id,
        numero_lugar
      }
    });

    if (lugarExistente) {
      return res.status(400).json({
        error: `Ya existe un lugar con el número ${numero_lugar} en este estacionamiento`
      });
    }

    // Crear el lugar
    const nuevoLugar = await Lugar.create({
      estacionamiento_id,
      numero_lugar,
      tipo: tipo || 'estandar',
      estado: 'disponible'
    });

    res.status(201).json({
      mensaje: 'Lugar creado exitosamente',
      lugar: nuevoLugar
    });

  } catch (error) {
    console.error('Error al crear lugar:', error);
    res.status(500).json({
      error: 'Error al crear el lugar',
      detalle: error.message
    });
  }
};

/**
 * CREAR MÚLTIPLES LUGARES (Admin o Empleado)
 */
exports.createMultipleSpots = async (req, res) => {
  try {
    const {
      estacionamiento_id,
      cantidad,
      tipo,
      prefijo // Ej: "A", "B", "1", etc.
    } = req.body;

    if (!estacionamiento_id || !cantidad) {
      return res.status(400).json({
        error: 'Faltan campos: estacionamiento_id, cantidad'
      });
    }

    // Verificar estacionamiento y permisos
    const estacionamiento = await Estacionamiento.findByPk(estacionamiento_id);
    if (!estacionamiento) {
      return res.status(404).json({ error: 'Estacionamiento no encontrado' });
    }

    const esAdmin = estacionamiento.administrador_id === req.usuario.id;
    const esEmpleado = estacionamiento.empleado_id === req.usuario.id;

    if (!esAdmin && !esEmpleado) {
      return res.status(403).json({
        error: 'No tienes permiso para crear lugares en este estacionamiento'
      });
    }

    // Obtener el último número de lugar
    const ultimoLugar = await Lugar.findOne({
      where: { estacionamiento_id },
      order: [['id', 'DESC']]
    });

    let numeroInicial = 1;
    if (ultimoLugar) {
      // Intentar extraer número del numero_lugar
      const match = ultimoLugar.numero_lugar.match(/\d+$/);
      if (match) {
        numeroInicial = parseInt(match[0]) + 1;
      }
    }

    // Crear lugares en bulk
    const lugares = [];
    for (let i = 0; i < cantidad; i++) {
      const numeroLugar = prefijo ? `${prefijo}${numeroInicial + i}` : `${numeroInicial + i}`;
      lugares.push({
        estacionamiento_id,
        numero_lugar: numeroLugar,
        tipo: tipo || 'estandar',
        estado: 'disponible'
      });
    }

    const lugaresCreados = await Lugar.bulkCreate(lugares);

    res.status(201).json({
      mensaje: `${lugaresCreados.length} lugares creados exitosamente`,
      lugares: lugaresCreados
    });

  } catch (error) {
    console.error('Error al crear múltiples lugares:', error);
    res.status(500).json({
      error: 'Error al crear lugares',
      detalle: error.message
    });
  }
};

/**
 * OBTENER LUGARES DE UN ESTACIONAMIENTO
 */
exports.getSpotsByParking = async (req, res) => {
  try {
    const { estacionamiento_id } = req.params;

    const lugares = await Lugar.findAll({
      where: { estacionamiento_id },
      order: [['numero_lugar', 'ASC']]
    });

    // Calcular disponibilidad
    const total = lugares.length;
    const disponibles = lugares.filter(l => l.estado === 'disponible').length;
    const ocupados = lugares.filter(l => l.estado === 'ocupado').length;
    const reservados = lugares.filter(l => l.estado === 'reservado').length;
    const mantenimiento = lugares.filter(l => l.estado === 'mantenimiento').length;

    res.json({
      estacionamiento_id: parseInt(estacionamiento_id),
      total,
      disponibilidad: {
        disponibles,
        ocupados,
        reservados,
        mantenimiento,
        porcentaje_disponible: total > 0 ? Math.round((disponibles / total) * 100) : 0
      },
      lugares
    });

  } catch (error) {
    console.error('Error al obtener lugares:', error);
    res.status(500).json({
      error: 'Error al obtener lugares',
      detalle: error.message
    });
  }
};

/**
 * ACTUALIZAR ESTADO DE UN LUGAR (Empleado o Admin)
 */
exports.updateSpotStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // 'disponible', 'ocupado', 'reservado', 'mantenimiento'

    if (!estado) {
      return res.status(400).json({
        error: 'Falta el campo estado'
      });
    }

    // Validar estado
    const estadosValidos = ['disponible', 'ocupado', 'reservado', 'mantenimiento'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        error: `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}`
      });
    }

    const lugar = await Lugar.findByPk(id, {
      include: [{
        model: Estacionamiento,
        as: 'estacionamiento'
      }]
    });

    if (!lugar) {
      return res.status(404).json({
        error: 'Lugar no encontrado'
      });
    }

    // Verificar permisos
    const esAdmin = lugar.estacionamiento.administrador_id === req.usuario.id;
    const esEmpleado = lugar.estacionamiento.empleado_id === req.usuario.id;

    if (!esAdmin && !esEmpleado) {
      return res.status(403).json({
        error: 'No tienes permiso para modificar este lugar'
      });
    }

    const estadoAnterior = lugar.estado;

    // Actualizar estado
    await lugar.update({ estado });

    // Si pasa de disponible a ocupado, crear registro de ocupación
    if (estadoAnterior === 'disponible' && estado === 'ocupado') {
      await Ocupacion.create({
        fecha: new Date(),
        hora_inicio: new Date(),
        lugar_id: lugar.id
      });
    }

    // Si pasa de ocupado a disponible, actualizar hora_fin
    if (estadoAnterior === 'ocupado' && estado === 'disponible') {
      const ocupacionActiva = await Ocupacion.findOne({
        where: {
          lugar_id: lugar.id,
          hora_fin: null
        },
        order: [['creado_en', 'DESC']]
      });

      if (ocupacionActiva) {
        await ocupacionActiva.update({ hora_fin: new Date() });
      }
    }

    // Emitir evento Socket.io para actualizar clientes en tiempo real
    if (req.io) {
      req.io.emit('spot-updated', {
        lugar_id: lugar.id,
        estacionamiento_id: lugar.estacionamiento_id,
        estado: lugar.estado,
        numero_lugar: lugar.numero_lugar
      });
    }

    res.json({
      mensaje: 'Estado actualizado exitosamente',
      lugar,
      cambio: {
        de: estadoAnterior,
        a: estado
      }
    });

  } catch (error) {
    console.error('Error al actualizar estado del lugar:', error);
    res.status(500).json({
      error: 'Error al actualizar el estado',
      detalle: error.message
    });
  }
};

/**
 * ELIMINAR LUGAR (Admin o Empleado)
 */
exports.deleteSpot = async (req, res) => {
  try {
    const { id } = req.params;

    const lugar = await Lugar.findByPk(id, {
      include: [{
        model: Estacionamiento,
        as: 'estacionamiento'
      }]
    });

    if (!lugar) {
      return res.status(404).json({
        error: 'Lugar no encontrado'
      });
    }

    // Verificar permisos
    const esAdmin = lugar.estacionamiento.administrador_id === req.usuario.id;
    const esEmpleado = lugar.estacionamiento.empleado_id === req.usuario.id;

    if (!esAdmin && !esEmpleado) {
      return res.status(403).json({
        error: 'No tienes permiso para eliminar este lugar'
      });
    }

    await lugar.destroy();

    res.json({
      mensaje: 'Lugar eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar lugar:', error);
    res.status(500).json({
      error: 'Error al eliminar el lugar',
      detalle: error.message
    });
  }
};

/**
 * OBTENER ESTACIONAMIENTO DEL EMPLEADO LOGEADO
 */
exports.getMyParkingAsEmployee = async (req, res) => {
  try {
    const empleado_id = req.usuario.id;

    const estacionamiento = await Estacionamiento.findOne({
      where: { empleado_id },
      include: [
        {
          model: Lugar,
          as: 'lugares',
          order: [['numero_lugar', 'ASC']]
        }
      ]
    });

    if (!estacionamiento) {
      return res.status(404).json({
        error: 'No tienes un estacionamiento asignado',
        mensaje: 'Contacta con tu administrador para que te asigne un estacionamiento'
      });
    }

    // Calcular estadísticas
    const lugares = estacionamiento.lugares || [];
    const total = lugares.length;
    const disponibles = lugares.filter(l => l.estado === 'disponible').length;
    const ocupados = lugares.filter(l => l.estado === 'ocupado').length;

    res.json({
      estacionamiento: {
        id: estacionamiento.id,
        nombre: estacionamiento.nombre_estacionamiento,
        lat: parseFloat(estacionamiento.latitud),
        lng: parseFloat(estacionamiento.longitud),
        informacion: estacionamiento.informacion
      },
      lugares: lugares,
      estadisticas: {
        total,
        disponibles,
        ocupados,
        porcentaje_disponible: total > 0 ? Math.round((disponibles / total) * 100) : 0
      }
    });

  } catch (error) {
    console.error('Error al obtener estacionamiento del empleado:', error);
    res.status(500).json({
      error: 'Error al obtener datos del estacionamiento',
      detalle: error.message
    });
  }
};

module.exports = exports;

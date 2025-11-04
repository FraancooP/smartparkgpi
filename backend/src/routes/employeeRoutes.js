const express = require('express');
const router = express.Router();
const spotController = require('../controllers/spotController');
const { verificarToken, verificarRol } = require('../middlewares/auth');

// ============================================
// RUTAS PARA EMPLEADOS
// ============================================

// Obtener estacionamiento asignado al empleado logeado
router.get(
  '/my-parking',
  verificarToken,
  verificarRol(['empleado']),
  spotController.getMyParkingAsEmployee
);

// Obtener lugares del estacionamiento asignado
router.get(
  '/my-parking/spots',
  verificarToken,
  verificarRol(['empleado']),
  async (req, res, next) => {
    try {
      // Primero obtener el estacionamiento del empleado
      const { Estacionamiento } = require('../models/Asociador_tablas');
      const estacionamiento = await Estacionamiento.findOne({
        where: { empleado_id: req.usuario.id }
      });

      if (!estacionamiento) {
        return res.status(404).json({
          error: 'No tienes un estacionamiento asignado'
        });
      }

      // Pasar al siguiente handler con el estacionamiento_id
      req.params.estacionamiento_id = estacionamiento.id;
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  spotController.getSpotsByParking
);

// Actualizar estado de lugar (ocupar/liberar)
router.put(
  '/spots/:id/status',
  verificarToken,
  verificarRol(['empleado']),
  spotController.updateSpotStatus
);

// Crear lugar en mi estacionamiento
router.post(
  '/spots',
  verificarToken,
  verificarRol(['empleado']),
  spotController.createSpot
);

module.exports = router;

const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');
const spotController = require('../controllers/spotController');
const { verificarToken, verificarRol } = require('../middlewares/auth');

// ============================================
// RUTAS DE ESTACIONAMIENTOS (Admin)
// ============================================

// Crear estacionamiento (Solo Admin)
router.post(
  '/parkings',
  verificarToken,
  verificarRol(['administrador']),
  parkingController.createParking
);

// Listar mis estacionamientos (Admin logeado)
router.get(
  '/my-parkings',
  verificarToken,
  verificarRol(['administrador']),
  parkingController.getMyParkings
);

// Actualizar estacionamiento (Admin dueño)
router.put(
  '/parkings/:id',
  verificarToken,
  verificarRol(['administrador']),
  parkingController.updateParking
);

// Eliminar estacionamiento (Admin dueño)
router.delete(
  '/parkings/:id',
  verificarToken,
  verificarRol(['administrador']),
  parkingController.deleteParking
);

// Asignar empleado a estacionamiento (Admin dueño)
router.post(
  '/assign-employee',
  verificarToken,
  verificarRol(['administrador']),
  parkingController.assignEmployee
);

// ============================================
// RUTAS DE LUGARES/SPOTS (Admin y Empleado)
// ============================================

// Crear lugar individual
router.post(
  '/spots',
  verificarToken,
  verificarRol(['administrador', 'empleado']),
  spotController.createSpot
);

// Crear múltiples lugares
router.post(
  '/spots/bulk',
  verificarToken,
  verificarRol(['administrador', 'empleado']),
  spotController.createMultipleSpots
);

// Obtener lugares de un estacionamiento
router.get(
  '/parkings/:estacionamiento_id/spots',
  verificarToken,
  verificarRol(['administrador', 'empleado']),
  spotController.getSpotsByParking
);

// Actualizar estado de lugar
router.put(
  '/spots/:id/status',
  verificarToken,
  verificarRol(['administrador', 'empleado']),
  spotController.updateSpotStatus
);

// Eliminar lugar
router.delete(
  '/spots/:id',
  verificarToken,
  verificarRol(['administrador', 'empleado']),
  spotController.deleteSpot
);

module.exports = router;

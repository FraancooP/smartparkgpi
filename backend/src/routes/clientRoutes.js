const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');

// ============================================
// RUTAS PÚBLICAS PARA CLIENTES
// ============================================

// Obtener todos los estacionamientos (para mostrar en mapa)
router.get('/parkings', parkingController.getAllParkings);

// Obtener estacionamiento por ID
router.get('/parkings/:id', parkingController.getParkingById);

module.exports = router;

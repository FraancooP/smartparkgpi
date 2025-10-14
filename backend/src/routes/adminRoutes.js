const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verificarToken } = require('../middlewares/auth');

router.post('/registrar-estacionamiento', verificarToken, adminController.registrarEstacionamiento);



module.exports = router;
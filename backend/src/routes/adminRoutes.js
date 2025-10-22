const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verificarToken, soloAdmin } = require('../middlewares/auth');

router.post('/registrar-estacionamiento', verificarToken, soloAdmin, adminController.registrarEstacionamiento);



module.exports = router;
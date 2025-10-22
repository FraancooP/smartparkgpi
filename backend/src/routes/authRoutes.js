const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken, soloAdmin, soloUsuario } = require('../middlewares/auth');

// ========================================
// RUTAS PÚBLICAS (sin autenticación)
// ========================================

// Registro
router.post('/register-client', authController.registerClient);
router.post('/register-admin', authController.registerAdmin);

// Login universal (cliente, admin o empleado)
router.post('/login', authController.login);

// Recuperación de contraseña
router.post('/forgot-password-client', authController.forgotPasswordClient);
router.post('/forgot-password-admin', authController.forgotPasswordAdmin);
router.post('/reset-password', authController.resetPassword);

// Verificación de email
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationEmail);

// ========================================
// RUTAS PROTEGIDAS (requieren JWT)
// ========================================

// Verificar si el token es válido
router.get('/verify-token', verificarToken, authController.verifyToken);

// Obtener perfil del usuario autenticado
router.get('/profile', verificarToken, authController.getProfile);

// Cerrar sesión (opcional, frontend borra token de localStorage)
router.post('/logout', verificarToken, authController.logout);

module.exports = router;
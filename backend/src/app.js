const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const parkingRoutes = require('./routes/parkingRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const clientRoutes = require('./routes/clientRoutes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);        // Rutas de autenticación
app.use('/api/admin', adminRoutes);      // Rutas de administrador
app.use('/api/admin', parkingRoutes);    // Rutas de parkings y spots (admin)
app.use('/api/employee', employeeRoutes); // Rutas de empleado
app.use('/api/client', clientRoutes);    // Rutas públicas para clientes







// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SmartPark API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
# SmartPark - Sistema de Gestión de Estacionamientos

Sistema completo para la gestión de estacionamientos con roles diferenciados para clientes y administradores.

## 🏗️ Estructura del proyecto

```
ProyectoSmartpark/
├── backend/                 # API REST con Node.js
│   ├── src/
│   │   ├── config/         # Configuración de BD
│   │   ├── controllers/    # Controladores
│   │   ├── models/         # Modelos de datos
│   │   ├── routes/         # Rutas de la API
│   │   ├── middleware/     # Middlewares
│   │   └── utils/          # Utilidades
│   ├── package.json
│   └── .env
├── frontend/               # Aplicación Vue.js
├── docker/                 # Scripts SQL
└── docker-compose.yml      # Configuración Docker
```

## 🚀 Inicio rápido

### 1. Levantar la base de datos
```bash
docker-compose up -d
```

### 2. Instalar dependencias del backend
```bash
cd backend
npm install
```

### 3. Iniciar el servidor backend
```bash
npm run dev
```

### 4. Configurar frontend (próximamente)
```bash
cd ../frontend
npm install
npm run dev
```

## 📊 Servicios disponibles

- **Backend API**: http://localhost:3000
- **phpMyAdmin**: http://localhost:8080
- **Frontend**: http://localhost:8080 (próximamente)

## 🏢 Funcionalidades principales

### Para Clientes
- Registro y autenticación
- Búsqueda de estacionamientos en mapa
- Visualización de disponibilidad
- Información de precios y ubicación

### Para Administradores
- Gestión completa de establecimientos
- Asignación de empleados
- Control de espacios disponibles
- Análisis y reportes

### Para Empleados
- Gestión de espacios del establecimiento asignado
- Control de entrada y salida

## 🔧 Tecnologías utilizadas

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- Docker

### Frontend (en desarrollo)
- Vue.js
- Vue Router
- Vuex/Pinia
- Leaflet (mapas)

## 👨‍💻 Desarrollo

Este proyecto está en desarrollo activo. Funcionalidades implementadas:

- ✅ Backend API completo
- ✅ Base de datos con Docker
- ✅ Sistema de autenticación
- ✅ CRUD de establecimientos
- ✅ Gestión de usuarios y empleados
- 🔄 Frontend Vue.js (en progreso)
- 📋 Integración con mapas (planificado)
- 📋 Sistema de reservas (planificado)

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles.
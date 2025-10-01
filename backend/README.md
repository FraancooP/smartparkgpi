# SmartPark Backend API

API RESTful para el sistema de gestión de estacionamientos SmartPark.

## 🚀 Características

- **Autenticación JWT** - Sistema seguro de autenticación
- **Roles de usuario** - Cliente, Admin y Empleado
- **Gestión de establecimientos** - CRUD completo para estacionamientos
- **Búsqueda geolocalizada** - Encuentra estacionamientos cercanos
- **Base de datos MySQL** - Con Docker para desarrollo
- **Validación de datos** - Usando Joi
- **Middleware de seguridad** - Rate limiting, CORS, Helmet

## 🛠️ Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MySQL** - Base de datos
- **Docker** - Contenedorización
- **JWT** - Autenticación
- **Bcrypt** - Hashing de contraseñas
- **Joi** - Validación de esquemas

## 📋 Requisitos previos

- Node.js (v14 o superior)
- Docker y Docker Compose
- Git

## 🚀 Instalación y configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd ProyectoSmartpark/backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

### 4. Levantar base de datos con Docker
```bash
cd ..
docker-compose up -d
```

### 5. Iniciar el servidor
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📊 Base de datos

La base de datos se inicializa automáticamente con:
- Tablas necesarias para el sistema
- Usuario administrador por defecto
- Establecimientos de ejemplo

### Acceso a phpMyAdmin
- URL: http://localhost:8080
- Usuario: smartpark_user
- Contraseña: smartpark_password

## 🔗 Endpoints principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil

### Usuarios (Admin)
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `DELETE /api/users/:id` - Desactivar usuario

### Establecimientos
- `GET /api/establishments` - Listar establecimientos
- `POST /api/establishments` - Crear establecimiento (Admin)
- `GET /api/establishments/:id` - Obtener establecimiento
- `PUT /api/establishments/:id` - Actualizar establecimiento (Admin)
- `DELETE /api/establishments/:id` - Eliminar establecimiento (Admin)
- `GET /api/establishments/nearby` - Buscar cercanos

## 🔐 Autenticación

El sistema usa JWT tokens. Incluye el token en el header:
```
Authorization: Bearer <token>
```

## 👥 Roles de usuario

- **client** - Usuario cliente (default)
- **admin** - Administrador del sistema
- **employee** - Empleado de establecimiento

## 🧪 Testing

```bash
npm test
```

## 📝 Ejemplos de uso

### Registro de usuario
```javascript
POST /api/auth/register
{
  "email": "usuario@example.com",
  "password": "123456",
  "name": "Usuario Test",
  "phone": "1234567890"
}
```

### Login
```javascript
POST /api/auth/login
{
  "email": "usuario@example.com",
  "password": "123456"
}
```

### Crear establecimiento
```javascript
POST /api/establishments
Authorization: Bearer <token>
{
  "name": "Mi Parking",
  "address": "Av. Corrientes 1234",
  "latitude": -34.6037,
  "longitude": -58.3816,
  "total_spaces": 50,
  "price_per_hour": 250.00,
  "description": "Estacionamiento seguro"
}
```

## 🐳 Docker

Para usar solo Docker:
```bash
docker-compose up --build
```

## 📄 Licencia

MIT License

## 👨‍💻 Autor

Franco - Proyecto SmartPark
# 📡 Resumen de Rutas API - SmartPark

## 🌐 Base URL
```
http://localhost:3000
```

---

## 📍 MAPA DE RUTAS

```
SmartPark API
│
├── 🏥 /api/health (GET) - Health Check
│
└── 🔐 /api/auth - Autenticación
    │
    ├── 📝 REGISTRO
    │   ├── POST /register-client      → Registrar cliente
    │   └── POST /register-admin       → Registrar administrador
    │
    ├── 🔑 LOGIN
    │   └── POST /login                → Login universal (cliente/admin/empleado)
    │
    ├── 🔓 RECUPERACIÓN DE CONTRASEÑA
    │   ├── POST /forgot-password-client  → Solicitar reset (cliente)
    │   ├── POST /forgot-password-admin   → Solicitar reset (admin)
    │   └── POST /reset-password          → Cambiar contraseña con token
    │
    └── 🛡️ RUTAS PROTEGIDAS (requieren JWT)
        ├── GET  /verify-token         → Verificar validez del token
        ├── GET  /profile              → Obtener perfil del usuario
        └── POST /logout               → Cerrar sesión
```

---

## 📊 TABLA DE ENDPOINTS

| Método | Ruta | Auth | Descripción | Body |
|--------|------|------|-------------|------|
| GET | `/api/health` | ❌ | Health check | - |
| POST | `/api/auth/register-client` | ❌ | Registrar cliente | `nombre, apellido, nombre_usuario, correo, contrasena` |
| POST | `/api/auth/register-admin` | ❌ | Registrar admin | `nombre, apellido, nombre_usuario, correo, contrasena` |
| POST | `/api/auth/login` | ❌ | Login universal | `usuario, contrasena, rol_solicitado` |
| POST | `/api/auth/forgot-password-client` | ❌ | Reset password cliente | `correo` |
| POST | `/api/auth/forgot-password-admin` | ❌ | Reset password admin | `correo` |
| POST | `/api/auth/reset-password` | ❌ | Cambiar contraseña | `token, nueva_contrasena` |
| GET | `/api/auth/verify-token` | ✅ | Verificar token JWT | - |
| GET | `/api/auth/profile` | ✅ | Obtener perfil | - |
| POST | `/api/auth/logout` | ✅ | Cerrar sesión | - |

**Leyenda:**
- ❌ = No requiere autenticación (ruta pública)
- ✅ = Requiere JWT en header: `Authorization: Bearer <token>`

---

## 🔄 FLUJO DE TOKENS

### 🎫 Token de Verificación (BD)
```
Generado por: forgot-password-client, forgot-password-admin
Guardado en: Base de datos (campo token_verificacion)
Duración: 1 hora
Uso: Solo para reset-password
```

### 🎟️ Token JWT de Sesión (localStorage)
```
Generado por: register-client, register-admin, login
Guardado en: localStorage del navegador
Duración: 24 horas
Uso: Navegación y acceso a rutas protegidas
Contenido: { id, nombre_usuario, correo, rol_activo, roles }
```

---

## 🎭 ROLES ACTIVOS

El `rol_activo` en el JWT determina qué puede hacer el usuario:

| Rol Activo | Acceso | Login desde |
|------------|--------|-------------|
| `usuario` | Dashboard cliente, reservas, vehículos | `/client/login` |
| `administrador` | Dashboard admin, gestión completa | `/admin/login` |
| `empleado` | Dashboard empleado, ocupaciones | `/employee/login` (futuro) |

**Ejemplo de JWT decodificado:**
```json
{
  "id": 1,
  "nombre_usuario": "franco",
  "correo": "franco@test.com",
  "rol_activo": "usuario",
  "roles": ["usuario", "administrador"],
  "iat": 1697324800,
  "exp": 1697411200
}
```

---

## 📋 RESPUESTAS ESTÁNDAR

### ✅ Éxito (200-201)
```json
{
  "mensaje": "Operación exitosa",
  "data": { ... }
}
```

### ❌ Error de Validación (400)
```json
{
  "error": "Faltan campos requeridos: nombre, correo"
}
```

### 🚫 No Autorizado (401)
```json
{
  "error": "Token requerido"
}
```

### 🔒 Acceso Denegado (403)
```json
{
  "error": "No tienes permisos de administrador",
  "tu_rol_activo": "usuario"
}
```

### 💥 Error del Servidor (500)
```json
{
  "error": "Error interno del servidor",
  "detalle": "..." // Solo en development
}
```

---

## 🧪 EJEMPLOS DE USO

### 1️⃣ Registrar y Obtener Token
```bash
curl -X POST http://localhost:3000/api/auth/register-client \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Franco",
    "apellido": "P",
    "nombre_usuario": "franco",
    "correo": "franco@test.com",
    "contrasena": "123456"
  }'

# Respuesta: { "token": "eyJhbG...", ... }
```

### 2️⃣ Login con Rol Específico
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "franco",
    "contrasena": "123456",
    "rol_solicitado": "usuario"
  }'
```

### 3️⃣ Acceder a Ruta Protegida
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4️⃣ Recuperar Contraseña
```bash
# Paso 1: Solicitar token
curl -X POST http://localhost:3000/api/auth/forgot-password-client \
  -H "Content-Type: application/json" \
  -d '{ "correo": "franco@test.com" }'

# Paso 2: Cambiar contraseña (con token recibido por email)
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123def456...",
    "nueva_contrasena": "nuevaPass123"
  }'
```

---

## 🎯 PRÓXIMAS RUTAS (Futuro)

```
/api/admin
  ├── POST /estacionamientos     → Crear estacionamiento
  ├── GET  /estacionamientos     → Listar estacionamientos
  └── POST /empleados            → Crear empleado

/api/client
  ├── GET  /reservas             → Mis reservas
  ├── POST /reservas             → Crear reserva
  └── GET  /vehiculos            → Mis vehículos

/api/employee
  ├── GET  /ocupaciones          → Ver ocupaciones
  └── POST /ocupaciones/validar  → Validar QR
```

---

## 📝 NOTAS IMPORTANTES

1. **JWT en Header:** Todas las rutas protegidas requieren el header `Authorization: Bearer <token>`

2. **Rol Solicitado:** El parámetro `rol_solicitado` en `/login` es opcional:
   - Si se omite, se usa el primer rol disponible
   - Si se especifica, valida que el usuario tenga ese rol

3. **Estado del Usuario:** Los usuarios registrados tienen `estado: 'pendiente_verificacion'`
   - Cambiar a `'activo'` manualmente en BD para permitir login
   - O implementar verificación por email en el futuro

4. **Tokens de Verificación:** Solo se usan para reset de password
   - Expiran en 1 hora
   - Se eliminan automáticamente después de usar

5. **Multi-Rol:** Un usuario puede tener múltiples roles
   - Al registrarse como cliente y después como admin con mismo correo/contraseña
   - Puede cambiar entre roles haciendo login con `rol_solicitado` diferente

---

**Última actualización:** Octubre 2025  
**Versión API:** 1.0.0

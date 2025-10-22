# 🚀 Guía de Testeo - SmartPark API

## 📋 Resumen de Rutas

### **Base URL:** `http://localhost:3000`

---

## 🔓 RUTAS PÚBLICAS (Sin autenticación)

### 1. Health Check
```http
GET http://localhost:3000/api/health
```

### 2. Registro de Cliente
```http
POST http://localhost:3000/api/auth/register-client
Content-Type: application/json

{
  "nombre": "Franco",
  "apellido": "Perez",
  "nombre_usuario": "franco123",
  "correo": "franco@test.com",
  "contrasena": "123456",
  "telefono": "+54911234567",
  "direccion": "Calle Falsa 123",
  "dni": "12345678"
}
```

**Respuesta exitosa:**
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Franco",
    "rol": {
      "rol_usuario": true,
      "rol_administrador": false,
      "rol_empleado": false
    }
  }
}
```

### 3. Registro de Administrador
```http
POST http://localhost:3000/api/auth/register-admin
Content-Type: application/json

{
  "nombre": "Admin",
  "apellido": "Principal",
  "nombre_usuario": "admin",
  "correo": "admin@smartpark.com",
  "contrasena": "admin123",
  "telefono": "+54911111111"
}
```

### 4. Login Universal
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "usuario": "franco123",
  "contrasena": "123456",
  "rol_solicitado": "usuario"
}
```

**Respuesta:**
```json
{
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "rol_activo": "usuario",
  "roles_disponibles": ["usuario"],
  "usuario": { ... }
}
```

**⚠️ IMPORTANTE:** Guardar el `token` para usar en rutas protegidas.

### 5. Forgot Password (Cliente)
```http
POST http://localhost:3000/api/auth/forgot-password-client
Content-Type: application/json

{
  "correo": "franco@test.com"
}
```

**Respuesta:**
```json
{
  "mensaje": "Si el correo existe, recibirás instrucciones...",
  "token": "abc123def456..." // Solo en development
}
```

### 6. Forgot Password (Admin)
```http
POST http://localhost:3000/api/auth/forgot-password-admin
Content-Type: application/json

{
  "correo": "admin@smartpark.com"
}
```

### 7. Reset Password
```http
POST http://localhost:3000/api/auth/reset-password
Content-Type: application/json

{
  "token": "abc123def456...",
  "nueva_contrasena": "nuevaPass123"
}
```

---

## 🔒 RUTAS PROTEGIDAS (Requieren JWT)

**Para todas estas rutas, incluir el header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 8. Verificar Token
```http
GET http://localhost:3000/api/auth/verify-token
Authorization: Bearer <tu_token>
```

**Respuesta:**
```json
{
  "valido": true,
  "usuario": {
    "id": 1,
    "nombre_usuario": "franco123",
    "correo": "franco@test.com",
    "rol_activo": "usuario",
    "roles_disponibles": ["usuario"]
  }
}
```

### 9. Obtener Perfil
```http
GET http://localhost:3000/api/auth/profile
Authorization: Bearer <tu_token>
```

### 10. Logout
```http
POST http://localhost:3000/api/auth/logout
Authorization: Bearer <tu_token>
```

---

## 🧪 FLUJOS DE PRUEBA COMPLETOS

### **FLUJO A: Registro y Login de Cliente**
```bash
1. POST /api/auth/register-client
   → Guardar token de respuesta

2. POST /api/auth/login (con rol_solicitado: "usuario")
   → Guardar nuevo token

3. GET /api/auth/profile (con token en header)
   → Verificar datos del usuario
```

### **FLUJO B: Recuperación de Contraseña**
```bash
1. POST /api/auth/forgot-password-client
   → Copiar token de la respuesta (en development)

2. POST /api/auth/reset-password (con el token copiado)
   → Contraseña cambiada

3. POST /api/auth/login (con nueva contraseña)
   → Login exitoso
```

### **FLUJO C: Usuario con Múltiples Roles**
```bash
1. POST /api/auth/register-client (correo: multi@test.com)
   → Usuario con rol_usuario: true

2. POST /api/auth/register-admin (mismo correo y contraseña)
   → Ahora tiene rol_usuario: true Y rol_administrador: true

3. POST /api/auth/login (rol_solicitado: "usuario")
   → Token con rol_activo: "usuario"

4. POST /api/auth/login (rol_solicitado: "administrador")
   → Token con rol_activo: "administrador"
```

---

## 📝 Colección Postman

Puedes importar esta colección en Postman:

```json
{
  "info": {
    "name": "SmartPark API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

Después de cada login, ejecuta en "Tests" de Postman:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.collectionVariables.set("token", response.token);
}
```

---

## ❌ Posibles Errores y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `Token requerido` | No se envió el header Authorization | Agregar `Authorization: Bearer <token>` |
| `Token expirado` | El JWT tiene más de 24h | Hacer login nuevamente |
| `Credenciales inválidas` | Usuario/contraseña incorrectos | Verificar datos |
| `No tienes permisos de administrador` | Intentas acceder como admin pero tu rol_activo es "usuario" | Hacer login con `rol_solicitado: "administrador"` |
| `Cuenta pendiente de verificación` | El usuario tiene estado pendiente | Cambiar estado a "activo" en BD o implementar verificación |
| `Token inválido o expirado` (reset password) | El token_verificacion expiró (1h) | Solicitar nuevo token con forgot-password |

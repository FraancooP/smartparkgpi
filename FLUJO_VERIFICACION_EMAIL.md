# 📧 Flujo de Verificación de Email - SmartPark

## 🎯 Objetivo
Cuando un usuario se registra, debe verificar su email antes de poder usar todas las funcionalidades del sistema.

---

## 🔄 FLUJO COMPLETO

### **1️⃣ Registro de Usuario**

```http
POST http://localhost:3000/api/auth/register-client
Content-Type: application/json

{
  "nombre": "Franco",
  "apellido": "Perez",
  "nombre_usuario": "franco123",
  "correo": "franco@test.com",
  "contrasena": "123456"
}
```

**Respuesta (201 Created):**
```json
{
  "mensaje": "✅ Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Franco",
    "correo": "franco@test.com",
    "estado": "pendiente_verificacion",
    "rol": {
      "rol_usuario": true,
      "rol_administrador": false
    }
  },
  "token_verificacion": "abc123def456...",  // ← Solo en development
  "nota_desarrollo": "Token de verificación incluido solo en modo desarrollo"
}
```

**Lo que sucede en el backend:**
1. ✅ Usuario creado con `estado: 'pendiente_verificacion'`
2. ✅ Se genera `token_verificacion` (32 bytes aleatorios)
3. ✅ Se guarda `verificacion_expiracion` (24 horas)
4. ✅ Se genera JWT de sesión (localStorage)
5. 📧 TODO: Se envía email con link de verificación

**En la Base de Datos:**
```sql
SELECT 
    nombre_usuario,
    correo,
    estado,
    token_verificacion,
    verificacion_expiracion
FROM usuarios
WHERE correo = 'franco@test.com';
```

**Resultado:**
```
nombre_usuario: franco123
correo: franco@test.com
estado: pendiente_verificacion
token_verificacion: abc123def456...
verificacion_expiracion: 2025-10-16 19:30:00
```

---

### **2️⃣ Intento de Login SIN Verificar**

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "usuario": "franco123",
  "contrasena": "123456",
  "rol_solicitado": "usuario"
}
```

**Respuesta (403 Forbidden):**
```json
{
  "error": "Cuenta pendiente de verificación. Revisa tu correo electrónico"
}
```

---

### **3️⃣ Verificación de Email**

El usuario recibe un email con un link como:
```
http://localhost:5173/verify-email?token=abc123def456...
```

El frontend envía el token al backend:

```http
POST http://localhost:3000/api/auth/verify-email
Content-Type: application/json

{
  "token": "abc123def456..."
}
```

**Respuesta (200 OK):**
```json
{
  "mensaje": "✅ Email verificado exitosamente. Ya puedes iniciar sesión con todas las funcionalidades.",
  "usuario": {
    "id": 1,
    "nombre_usuario": "franco123",
    "correo": "franco@test.com",
    "estado": "activo"
  }
}
```

**Lo que sucede en el backend:**
1. ✅ Valida que el token existe y no expiró
2. ✅ Cambia `estado` de `'pendiente_verificacion'` a `'activo'`
3. ✅ Limpia `token_verificacion` (null)
4. ✅ Limpia `verificacion_expiracion` (null)

---

### **4️⃣ Login DESPUÉS de Verificar**

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "usuario": "franco123",
  "contrasena": "123456",
  "rol_solicitado": "usuario"
}
```

**Respuesta (200 OK):**
```json
{
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "rol_activo": "usuario",
  "roles_disponibles": ["usuario"],
  "usuario": { ... }
}
```

✅ **¡Ahora puede usar toda la aplicación!**

---

## 🔄 REENVIAR EMAIL DE VERIFICACIÓN

Si el token expiró (después de 24 horas):

```http
POST http://localhost:3000/api/auth/resend-verification
Content-Type: application/json

{
  "correo": "franco@test.com"
}
```

**Respuesta:**
```json
{
  "mensaje": "Si el correo existe y está pendiente de verificación, recibirás un nuevo email.",
  "token": "xyz789abc123..."  // ← Solo en development
}
```

**Lo que sucede:**
1. ✅ Genera nuevo `token_verificacion`
2. ✅ Actualiza `verificacion_expiracion` (nuevo plazo de 24h)
3. 📧 TODO: Envía nuevo email

---

## 📊 ESTADOS DEL USUARIO

| Estado | Descripción | Puede Loguearse |
|--------|-------------|-----------------|
| `pendiente_verificacion` | Recién registrado, email sin verificar | ❌ NO |
| `activo` | Email verificado, cuenta operativa | ✅ SÍ |
| `inactivo` | Cuenta suspendida por admin | ❌ NO |

---

## 🔍 QUERIES ÚTILES PARA VERIFICAR

### Ver usuarios pendientes de verificación:
```sql
SELECT 
    id,
    nombre_usuario,
    correo,
    estado,
    token_verificacion IS NOT NULL AS tiene_token,
    verificacion_expiracion,
    CASE 
        WHEN verificacion_expiracion > NOW() THEN '✅ Válido'
        WHEN verificacion_expiracion < NOW() THEN '⏰ Expirado'
        ELSE '❌ Sin token'
    END AS estado_token,
    TIMESTAMPDIFF(HOUR, NOW(), verificacion_expiracion) AS horas_restantes
FROM usuarios
WHERE estado = 'pendiente_verificacion';
```

### Activar manualmente un usuario (para testing):
```sql
UPDATE usuarios
SET 
    estado = 'activo',
    token_verificacion = NULL,
    verificacion_expiracion = NULL
WHERE correo = 'franco@test.com';
```

### Ver tokens expirados:
```sql
SELECT 
    nombre_usuario,
    correo,
    verificacion_expiracion,
    TIMESTAMPDIFF(HOUR, verificacion_expiracion, NOW()) AS horas_expirado
FROM usuarios
WHERE 
    token_verificacion IS NOT NULL 
    AND verificacion_expiracion < NOW();
```

---

## 🧪 TESTING EN POSTMAN

### **Colección Completa:**

1. **Registrar:**
   ```
   POST /api/auth/register-client
   ```
   → Guardar `token_verificacion` de la respuesta

2. **Intentar Login (fallará):**
   ```
   POST /api/auth/login
   ```
   → Esperar error 403

3. **Verificar Email:**
   ```
   POST /api/auth/verify-email
   Body: { "token": "<token_copiado>" }
   ```
   → Usuario activado

4. **Login Exitoso:**
   ```
   POST /api/auth/login
   ```
   → Recibir JWT, guardar en localStorage

5. **Acceder a Perfil:**
   ```
   GET /api/auth/profile
   Header: Authorization: Bearer <jwt>
   ```
   → Ver datos del usuario

---

## 📋 RESUMEN DE ENDPOINTS

| Método | Endpoint | Propósito |
|--------|----------|-----------|
| POST | `/api/auth/register-client` | Registra usuario y genera token_verificacion |
| POST | `/api/auth/verify-email` | Verifica email con el token |
| POST | `/api/auth/resend-verification` | Reenvía email si expiró |
| POST | `/api/auth/login` | Login (solo si email verificado) |

---

## 🔐 DOS TIPOS DE TOKENS

### 1️⃣ **token_verificacion** (Base de Datos)
- **Guardado en:** Columna `usuarios.token_verificacion`
- **Duración:** 24 horas
- **Propósito:** Verificar email al registrarse
- **Se elimina:** Al verificar el email exitosamente

### 2️⃣ **JWT de Sesión** (localStorage)
- **Guardado en:** Frontend (localStorage)
- **Duración:** 24 horas
- **Propósito:** Autenticación y navegación
- **Contenido:** `{ id, nombre_usuario, correo, rol_activo, roles }`

---

## 🎨 FLUJO VISUAL

```
┌─────────────────────────────────────────────────────────────┐
│ REGISTRO                                                     │
│ POST /register-client                                        │
│ ↓                                                            │
│ ✅ Usuario creado (estado: pendiente_verificacion)          │
│ ✅ token_verificacion generado                              │
│ ✅ JWT de sesión generado                                   │
│ 📧 Email enviado (TODO)                                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ INTENTO DE LOGIN                                             │
│ POST /login                                                  │
│ ↓                                                            │
│ ❌ Error 403: "Cuenta pendiente de verificación"            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ VERIFICACIÓN                                                 │
│ Usuario hace clic en link del email                          │
│ POST /verify-email { token: "abc..." }                       │
│ ↓                                                            │
│ ✅ estado → 'activo'                                         │
│ ✅ token_verificacion → NULL                                │
│ ✅ verificacion_expiracion → NULL                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ LOGIN EXITOSO                                                │
│ POST /login                                                  │
│ ↓                                                            │
│ ✅ JWT de sesión devuelto                                   │
│ ✅ Puede usar toda la aplicación                            │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ NOTAS IMPORTANTES

1. **Admins NO requieren verificación:** Se crean con `estado: 'activo'` directamente.

2. **Token de verificación expira en 24h:** Si pasa ese tiempo, usar `/resend-verification`.

3. **Usuario puede tener JWT pero no estar verificado:** El JWT se genera al registrarse, pero no podrá hacer login hasta verificar.

4. **En development:** El `token_verificacion` se incluye en la respuesta de registro para facilitar testing sin email.

5. **En producción:** Configurar servicio de email (SendGrid, Nodemailer, etc.) para enviar links de verificación.

---

**Última actualización:** Octubre 2025

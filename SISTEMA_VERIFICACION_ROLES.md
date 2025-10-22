# 🎯 Sistema de Verificación de Email y Roles Múltiples

## ✅ Cambios Implementados

### 1. **Registro de Administrador con Verificación de Email**
- ✅ Ahora los administradores también deben verificar su email
- ✅ Se genera `token_verificacion` y `verificacion_expiracion` (24 horas)
- ✅ Estado inicial: `'pendiente_verificacion'`
- ✅ Email con diseño personalizado indicando el rol de "Administrador"

### 2. **Detección de Credenciales Existentes**
- ✅ El sistema detecta cuando alguien intenta registrarse con credenciales que ya existen en otro rol
- ✅ Ejemplo: Si eres Usuario y te registras como Admin, detecta que ya tienes cuenta
- ✅ No permite registros duplicados con contraseñas diferentes

### 3. **Email Especial para Agregado de Roles**
- ✅ Cuando se detecta cuenta existente, envía un email diferente (`sendRoleAddedEmail`)
- ✅ El email muestra:
  - Roles existentes que ya tienes
  - Nuevo rol agregado
  - Link de verificación para activar el nuevo rol
  - Recordatorio de que las credenciales son las mismas

### 4. **Frontend Mejorado**
- ✅ ClientRegister y AdminRegister ahora muestran mensajes personalizados:
  - Si es cuenta nueva: Mensaje de verificación estándar
  - Si es rol agregado: Mensaje explicando que ya tiene cuenta en otro rol

---

## 📧 Tipos de Emails

### **Email 1: Verificación de Cuenta Nueva**
- **Asunto**: `🚗 Verifica tu cuenta de [Usuario/Administrador] en SmartPark`
- **Contenido**: 
  - Badge con el tipo de rol
  - Botón de verificación
  - Link manual
  - Advertencia de expiración (24h)

### **Email 2: Nuevo Rol Agregado a Cuenta Existente**
- **Asunto**: `🎉 Nuevo rol de [Usuario/Administrador] agregado - SmartPark`
- **Contenido**:
  - Lista de roles existentes (badges grises)
  - Nuevo rol agregado (badge verde)
  - Explicación de que las credenciales son las mismas
  - Botón para activar el nuevo rol
  - Instrucciones de cómo usar los múltiples roles

---

## 🔄 Flujo Completo

### **Escenario 1: Usuario Nuevo**
```
1. Usuario se registra como Cliente
2. Backend crea cuenta con estado 'pendiente_verificacion'
3. Se genera token de 24h
4. Email de verificación enviado
5. Usuario verifica email
6. Estado cambia a 'activo'
7. Usuario puede iniciar sesión ✅
```

### **Escenario 2: Admin Nuevo**
```
1. Usuario se registra como Admin
2. Backend crea cuenta con estado 'pendiente_verificacion'
3. Se genera token de 24h
4. Email de verificación enviado (con badge "Administrador")
5. Usuario verifica email
6. Estado cambia a 'activo'
7. Admin puede iniciar sesión ✅
```

### **Escenario 3: Usuario Existente que se Registra como Admin**
```
1. Usuario YA tiene cuenta como Cliente (activa)
2. Intenta registrarse como Admin con las MISMAS credenciales
3. Backend detecta que el usuario existe
4. Verifica que la contraseña coincida ✅
5. Verifica que NO tenga rol de Admin aún
6. Agrega rol_administrador = true al registro de roles
7. Genera nuevo token de verificación
8. Cambia estado a 'pendiente_verificacion'
9. Envía email ESPECIAL explicando la situación
10. Frontend muestra mensaje: "Hemos detectado que ya tienes cuenta como Usuario"
11. Usuario va a su email
12. Hace clic en el link de verificación
13. Backend activa el nuevo rol (estado = 'activo')
14. Usuario ahora puede iniciar sesión como Cliente O Admin ✅
```

### **Escenario 4: Intento de Registro con Credenciales Existentes pero Contraseña Diferente**
```
1. Usuario intenta registrarse con email/username existente
2. Backend detecta que el usuario existe
3. Compara contraseñas con bcrypt
4. ❌ Contraseñas NO coinciden
5. Backend responde: "Ya existe una cuenta con ese usuario o correo. Si es tu cuenta, inicia sesión."
6. Frontend muestra error ❌
```

---

## 🗄️ Cambios en la Base de Datos

### **Tabla `usuarios`** (Sin cambios estructurales)
```sql
-- Campos existentes usados para verificación:
token_verificacion       TEXT          -- Token de 64 caracteres hex
verificacion_expiracion  DATETIME      -- Timestamp + 24h
estado                   ENUM          -- 'activo' | 'pendiente_verificacion' | 'inactivo'
```

### **Tabla `roles`** (Sin cambios)
```sql
rol_usuario       BOOLEAN   -- Cliente/Usuario
rol_administrador BOOLEAN   -- Administrador
rol_empleado      BOOLEAN   -- Empleado
```

**Una cuenta puede tener múltiples roles activos simultáneamente:**
- ✅ Usuario + Admin
- ✅ Usuario + Empleado
- ✅ Admin + Empleado
- ✅ Usuario + Admin + Empleado

---

## 📱 Respuestas de la API

### **Registro Exitoso (Cuenta Nueva)**
```json
{
  "mensaje": "✅ Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.",
  "usuario": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "rolAgregado": false,
  "rolesExistentes": []
}
```

### **Registro con Rol Agregado**
```json
{
  "mensaje": "Hemos detectado que ya tienes cuenta registrada como Usuario/Cliente. Se ha agregado el rol de Administrador a tu cuenta. Revisa tu email para activar este nuevo rol. Tus credenciales son las mismas.",
  "usuario": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "rolAgregado": true,
  "rolesExistentes": ["Usuario/Cliente"]
}
```

### **Error: Rol Ya Existe**
```json
{
  "error": "Ya tienes una cuenta de administrador. Inicia sesión.",
  "yaRegistrado": true,
  "rolExistente": "administrador"
}
```

---

## 🎨 Frontend - Mensajes Mejorados

### **Cliente - Cuenta Nueva**
```
✅ ¡Cuenta creada exitosamente!

📧 Hemos enviado un email de verificación a juan@email.com

Por favor, revisa tu bandeja de entrada (y spam) y haz clic en el enlace para activar tu cuenta.
```

### **Cliente - Rol Agregado**
```
🎉 ¡Cuenta Detectada!

Hemos detectado que tus credenciales ya están registradas como: Administrador.

✅ Se ha agregado el rol de Usuario/Cliente a tu cuenta.

📧 Revisa tu email para activar este nuevo rol.

🔑 Tus credenciales son las mismas, solo debes verificar tu email y luego iniciar sesión como Usuario/Cliente.
```

---

## 🧪 Testing

### **Test 1: Registro Normal de Cliente**
```bash
POST http://localhost:4000/api/auth/register-client
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "nombre_usuario": "juanp",
  "correo": "juan@email.com",
  "contrasena": "123456",
  "telefono": "1234567890",
  "dni": "12345678"
}

✅ Resultado esperado:
- Email enviado con asunto "Verifica tu cuenta de Usuario/Cliente"
- Badge: "Usuario/Cliente"
- Estado: pendiente_verificacion
```

### **Test 2: Registro Normal de Admin**
```bash
POST http://localhost:4000/api/auth/register-admin
{
  "nombre": "María",
  "apellido": "García",
  "nombre_usuario": "mariag",
  "correo": "maria@email.com",
  "contrasena": "admin123",
  "telefono": "0987654321",
  "dni": "87654321"
}

✅ Resultado esperado:
- Email enviado con asunto "Verifica tu cuenta de Administrador"
- Badge: "Administrador"
- Estado: pendiente_verificacion
```

### **Test 3: Usuario Existente que se Registra como Admin**
```bash
# Primero registrar como cliente
POST http://localhost:4000/api/auth/register-client
{ ...credenciales... }

# Verificar email
POST http://localhost:4000/api/auth/verify-email
{ "token": "..." }

# Luego registrar como admin con MISMAS credenciales
POST http://localhost:4000/api/auth/register-admin
{ ...mismas credenciales... }

✅ Resultado esperado:
- Email especial "Nuevo rol de Administrador agregado"
- Muestra roles existentes: ["Usuario/Cliente"]
- Nuevo rol: "Administrador"
- rolAgregado: true en la respuesta
```

### **Test 4: Credenciales Existentes con Contraseña Diferente**
```bash
POST http://localhost:4000/api/auth/register-admin
{
  "correo": "juan@email.com",  // Ya existe
  "contrasena": "otraPassword"  // Diferente a la original
}

❌ Resultado esperado:
- Error 400
- "Ya existe una cuenta con ese usuario o correo. Si es tu cuenta, inicia sesión."
```

---

## 🔐 Seguridad

### **Validaciones Implementadas**
- ✅ Contraseña hasheada con bcrypt (10 rounds)
- ✅ Token de verificación de 64 caracteres hexadecimales (crypto.randomBytes)
- ✅ Expiración de token a las 24 horas
- ✅ Verificación de contraseña antes de agregar rol
- ✅ No se puede agregar un rol que ya existe
- ✅ Estado `pendiente_verificacion` impide acceso a funcionalidades protegidas

---

## 📚 Archivos Modificados

### Backend
1. ✅ `backend/src/controllers/authController.js`
   - `registerClient` - Agregada detección de roles existentes
   - `registerAdmin` - Agregada verificación de email y detección de roles

2. ✅ `backend/src/config/email.js`
   - `sendVerificationEmail` - Ahora acepta parámetro `roleTipo`
   - `sendRoleAddedEmail` - Nueva función para roles agregados

### Frontend
3. ✅ `frontend/src/components/ClientRegister.vue`
   - Mensajes personalizados según si es cuenta nueva o rol agregado

4. ✅ `frontend/src/components/AdminRegister.vue`
   - Mensajes personalizados según si es cuenta nueva o rol agregado

---

## 🚀 Próximos Pasos (Opcional)

1. **Dashboard de Roles**: Vista donde el usuario pueda ver todos sus roles activos
2. **Selector de Rol en Login**: Permitir elegir con qué rol quiere iniciar sesión
3. **Cambio de Rol Sin Re-login**: Cambiar de rol sin cerrar sesión
4. **Gestión de Permisos**: Definir qué puede hacer cada rol específicamente
5. **Notificaciones**: Sistema de notificaciones cuando se agrega un nuevo rol

---

¡Sistema de verificación multi-rol completado! 🎉

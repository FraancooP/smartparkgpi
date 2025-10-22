# 🐳 Guía para Levantar el Entorno con Docker

## 📋 Pre-requisitos

1. ✅ Tener **Docker Desktop** instalado y corriendo
2. ✅ Tener **Node.js** instalado (para el backend)
3. ✅ Puerto **3307** libre (MySQL)
4. ✅ Puerto **8080** libre (phpMyAdmin)
5. ✅ Puerto **3000** libre (Backend API)

---

## 🚀 Paso a Paso

### **1. Levantar contenedores de Docker**

Abre PowerShell en la carpeta raíz del proyecto (`SmartPark/`) y ejecuta:

```powershell
# Ver si Docker está corriendo
docker --version

# Levantar los servicios (MySQL + phpMyAdmin)
docker-compose up -d

# Verificar que los contenedores están corriendo
docker ps
```

**Deberías ver:**
```
CONTAINER ID   IMAGE                    STATUS        PORTS
abc123...      mysql:8.0                Up 10 sec     0.0.0.0:3307->3306/tcp
def456...      phpmyadmin/phpmyadmin    Up 10 sec     0.0.0.0:8080->80/tcp
```

### **2. Verificar que MySQL está funcionando**

```powershell
# Ver logs de MySQL
docker logs smartpark_mysql

# Deberías ver al final:
# "ready for connections. Version: '8.0.x'"
```

### **3. Acceder a phpMyAdmin (opcional)**

Abre tu navegador en: `http://localhost:8080`

**Credenciales:**
- **Servidor:** `mysql`
- **Usuario:** `smartpark_user`
- **Contraseña:** `smartpark_password`

### **4. Configurar el Backend**

```powershell
# Ir a la carpeta backend
cd backend

# Instalar dependencias (si no lo hiciste antes)
npm install

# Crear archivo .env copiando el ejemplo
copy .env.example .env

# Editar .env si es necesario (ya debería estar configurado correctamente)
```

**Verifica que tu `.env` tenga:**
```env
DB_HOST=localhost
DB_PORT=3307
DB_NAME=smartpark_db
DB_USER=smartpark_user
DB_PASSWORD=smartpark_password
JWT_SECRET=tu_secreto_super_seguro
PORT=3000
NODE_ENV=development
```

### **5. Iniciar el Backend**

```powershell
# Desde la carpeta backend/
npm run dev

# O si usas npm start:
npm start
```

**Deberías ver:**
```
✅ Conexión a MySQL con Sequelize establecida correctamente
✅ Modelos sincronizados correctamente
🚀 Servidor corriendo en http://localhost:3000
```

### **6. Probar que todo funciona**

Abre Postman o tu navegador en:
```
http://localhost:3000/api/health
```

**Respuesta esperada:**
```json
{
  "status": "OK",
  "message": "SmartPark API funcionando correctamente",
  "timestamp": "2025-10-15T..."
}
```

---

## 🔄 Comandos Útiles de Docker

### Ver contenedores corriendo
```powershell
docker ps
```

### Ver todos los contenedores (incluso detenidos)
```powershell
docker ps -a
```

### Detener los contenedores
```powershell
docker-compose down
```

### Detener y eliminar TODOS los datos (⚠️ CUIDADO)
```powershell
docker-compose down -v
```

### Ver logs de un contenedor
```powershell
# MySQL
docker logs smartpark_mysql

# phpMyAdmin
docker logs smartpark_phpmyadmin

# Ver logs en tiempo real (Ctrl+C para salir)
docker logs -f smartpark_mysql
```

### Reiniciar un contenedor
```powershell
docker restart smartpark_mysql
```

### Entrar a MySQL desde la terminal
```powershell
docker exec -it smartpark_mysql mysql -u smartpark_user -p
# Cuando pida password, escribe: smartpark_password

# Dentro de MySQL:
USE smartpark_db;
SHOW TABLES;
SELECT * FROM usuarios;
exit;
```

### Ver el tamaño de los contenedores
```powershell
docker system df
```

### Limpiar recursos no usados
```powershell
docker system prune
```

---

## 🧪 Flujo Completo de Inicio

```powershell
# 1. Levantar Docker
docker-compose up -d

# 2. Esperar 10 segundos
Start-Sleep -Seconds 10

# 3. Verificar MySQL
docker logs smartpark_mysql | Select-String "ready for connections"

# 4. Ir al backend
cd backend

# 5. Iniciar servidor
npm run dev
```

---

## ❌ Solución de Problemas

### Error: "Port 3307 already in use"
```powershell
# Ver qué proceso usa el puerto 3307
netstat -ano | findstr :3307

# Matar el proceso (cambia PID por el número que te muestra)
taskkill /PID <PID> /F

# O cambiar el puerto en docker-compose.yml:
# ports:
#   - "3308:3306"  # Usa 3308 en vez de 3307
```

### Error: "Cannot connect to MySQL"
```powershell
# 1. Verificar que el contenedor está corriendo
docker ps | findstr mysql

# 2. Ver logs de error
docker logs smartpark_mysql

# 3. Reiniciar contenedor
docker restart smartpark_mysql

# 4. Si no funciona, recrear desde cero
docker-compose down -v
docker-compose up -d
```

### Error: "Sequelize connection refused"
```powershell
# 1. Esperar más tiempo (MySQL tarda en iniciar)
Start-Sleep -Seconds 15

# 2. Verificar .env del backend
cat backend\.env

# 3. Probar conexión manualmente
docker exec -it smartpark_mysql mysql -u smartpark_user -p
```

### Backend no inicia
```powershell
# 1. Verificar que Node.js está instalado
node --version
npm --version

# 2. Reinstalar dependencias
cd backend
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install

# 3. Verificar que bcrypt se instaló correctamente
npm list bcrypt
```

---

## 📊 Verificar Estado de las Tablas

Una vez que el backend esté corriendo y haya sincronizado los modelos:

```sql
-- Entrar a MySQL
docker exec -it smartpark_mysql mysql -u smartpark_user -p

-- Usar la base de datos
USE smartpark_db;

-- Ver todas las tablas
SHOW TABLES;

-- Ver estructura de tabla usuarios
DESCRIBE usuarios;

-- Ver estructura de tabla roles
DESCRIBE roles;

-- Verificar datos
SELECT * FROM usuarios;
SELECT * FROM roles;
```

**Tablas esperadas:**
```
+----------------------+
| Tables_in_smartpark_db|
+----------------------+
| usuarios             |
| roles                |
| estacionamientos     |
| lugares              |
| reservas             |
| pagos                |
| ocupaciones          |
| vehiculos            |
+----------------------+
```

---

## ✅ Checklist de Inicio

- [ ] Docker Desktop está corriendo
- [ ] `docker-compose up -d` ejecutado sin errores
- [ ] MySQL contenedor corriendo: `docker ps | findstr mysql`
- [ ] phpMyAdmin accesible en `http://localhost:8080`
- [ ] Backend `.env` configurado correctamente
- [ ] Backend dependencias instaladas: `npm install`
- [ ] Backend corriendo: `npm run dev`
- [ ] Health check responde: `http://localhost:3000/api/health`
- [ ] Postman listo con la colección importada

---

## 🎯 ¡Listo para Testear!

Una vez completados todos los pasos, ve a la **GUIA_TESTEO_POSTMAN.md** y empieza a probar los endpoints.

**Primera prueba recomendada:**
```http
POST http://localhost:3000/api/auth/register-client
{
  "nombre": "Test",
  "apellido": "User",
  "nombre_usuario": "testuser",
  "correo": "test@example.com",
  "contrasena": "123456"
}
```

Si obtienes una respuesta con `token`, ¡TODO ESTÁ FUNCIONANDO! 🎉

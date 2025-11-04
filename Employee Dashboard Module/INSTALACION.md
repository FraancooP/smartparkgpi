# 📦 Instalación del Módulo de Empleado

## ⚡ Inicio Rápido (3 pasos)

```powershell
# 1. Navegar al módulo
cd "Employee Dashboard Module"

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

✅ El módulo estará disponible en: **http://localhost:5173**

---

## 🔧 Instalación Detallada

### Prerequisitos

Asegúrate de tener instalado:
- **Node.js** v18 o superior
- **npm** v9 o superior

Verifica las versiones:
```powershell
node --version
npm --version
```

### Paso 1: Navegar al Módulo

```powershell
# Desde la raíz del proyecto
cd "c:\Users\joaqu\OneDrive\Escritorio\ProyectoGPI-SmartParking\Employee Dashboard Module"
```

### Paso 2: Instalar Dependencias

```powershell
npm install
```

Esto instalará todas las dependencias necesarias:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Radix UI primitives
- Lucide React icons
- Y más...

**Tiempo estimado**: 2-3 minutos (depende de tu conexión)

### Paso 3: Configurar Variables de Entorno (Opcional)

```powershell
# Copiar el archivo de ejemplo
Copy-Item .env.example .env

# Editar si necesitas cambiar algo
# Por defecto usa datos mock, lo cual está perfecto para empezar
```

### Paso 4: Iniciar el Servidor de Desarrollo

```powershell
npm run dev
```

Verás algo como:
```
  VITE v6.3.5  ready in 2531 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Paso 5: Abrir en el Navegador

El navegador debería abrirse automáticamente. Si no:
1. Abre tu navegador
2. Ve a: **http://localhost:5173**

---

## 🧪 Probar el Módulo

### Login con Usuario de Prueba

Ingresa estas credenciales:
- **Usuario**: `emp001`
- **Contraseña**: `123456`

### Explorar las Funcionalidades

1. **Ver el grid** de 50 espacios de estacionamiento
2. **Click en espacios** para cambiar estados
3. **Ir a "Validar Reserva"** e ingresar código: `4567`
4. **Ver "Reservas Pendientes"** y asignar un espacio
5. **Revisar "Estadísticas"** del día

---

## 📦 Dependencias Principales

Las siguientes librerías se instalarán automáticamente:

### Core
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "vite": "6.3.5"
}
```

### UI Components
```json
{
  "@radix-ui/react-*": "múltiples versiones",
  "lucide-react": "^0.487.0",
  "tailwind-merge": "*",
  "class-variance-authority": "^0.7.1"
}
```

### Dev Dependencies
```json
{
  "@vitejs/plugin-react-swc": "^3.10.2",
  "@types/node": "^20.10.0"
}
```

---

## 🐛 Solución de Problemas

### Error: `npm install` falla

**Problema**: Error al instalar dependencias

**Solución**:
```powershell
# Limpiar caché de npm
npm cache clean --force

# Intentar de nuevo
npm install
```

### Error: Puerto 5173 en uso

**Problema**: El puerto ya está siendo usado

**Solución 1**: Cerrar otras aplicaciones Vite
```powershell
# Ver procesos en puerto 5173
netstat -ano | findstr :5173

# Matar el proceso (reemplazar PID con el número que aparece)
taskkill /PID <PID> /F
```

**Solución 2**: Cambiar el puerto en `vite.config.ts`
```typescript
server: {
  port: 5174, // Cambiar a otro puerto
  open: true,
}
```

### Error: Módulos TypeScript no encontrados

**Problema**: Errores de tipo en la consola

**Solución**: Esto es normal hasta que instales las dependencias
```powershell
# Asegúrate de instalar todo
npm install

# Si persiste, reinstala
rm -rf node_modules
npm install
```

### Error: No se conecta al backend

**Problema**: No carga datos del backend

**Solución**: Verifica que estés en modo mock
```javascript
// En src/config/api.js
useMockData: true  // Debe ser true para pruebas
```

---

## 🔄 Scripts Disponibles

```powershell
# Desarrollo (con hot reload)
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

---

## 📂 Estructura Después de la Instalación

```
Employee Dashboard Module/
├── node_modules/          ✅ Instalado
├── src/
│   ├── components/        ✅ Listos
│   ├── services/          ✅ Listos
│   ├── config/            ✅ Listos
│   └── ...
├── package.json           ✅ Configurado
├── vite.config.ts         ✅ Configurado
├── .env                   ⚠️ Crear si necesitas personalizar
└── README_EMPLOYEE.md     ✅ Documentación
```

---

## ✅ Checklist de Instalación

Antes de empezar a desarrollar, verifica:

- [ ] Node.js v18+ instalado
- [ ] npm v9+ instalado
- [ ] `npm install` ejecutado exitosamente
- [ ] `npm run dev` funcionando
- [ ] Navegador abre http://localhost:5173
- [ ] Login funciona con `emp001` / `123456`
- [ ] Grid de espacios se muestra correctamente
- [ ] Puedes cambiar estados de espacios
- [ ] Validación de reservas funciona con código `4567`

---

## 🚀 ¡Listo!

Tu módulo de empleado está instalado y funcionando.

**Próximos pasos**:
1. Lee el **README_EMPLOYEE.md** para documentación completa
2. Lee la **GUIA_RAPIDA.md** para funcionalidades
3. Explora el **ESTADO_PROYECTO.md** para ver qué está hecho
4. Empieza a **probar las funcionalidades**

---

## 📞 ¿Necesitas Ayuda?

### Documentación Disponible
- `README_EMPLOYEE.md` - Documentación completa del módulo
- `GUIA_RAPIDA.md` - Guía de uso rápido
- `ESTADO_PROYECTO.md` - Estado actual del proyecto
- `.env.example` - Ejemplo de configuración

### Verificación de Salud del Sistema
```powershell
# Ver versión de Node
node --version

# Ver versión de npm
npm --version

# Listar dependencias instaladas
npm list --depth=0

# Verificar errores
npm doctor
```

---

**¡Todo listo para empezar a trabajar!** 🎉

# 👷 Employee Dashboard Module - SmartPark

## ⚡ Inicio Ultra Rápido

```powershell
npm install
npm run dev
```

**Usuario**: `emp001` | **Contraseña**: `123456`  
**URL**: http://localhost:5173

---

## 📚 Documentación

Este módulo tiene **documentación completa**. Lee según lo que necesites:

| Necesitas... | Lee este archivo | Tiempo |
|-------------|------------------|--------|
| 🚀 **Empezar YA** | [`GUIA_RAPIDA.md`](GUIA_RAPIDA.md) | 3 min |
| 📊 **Visión General** | [`RESUMEN_EJECUTIVO.md`](RESUMEN_EJECUTIVO.md) | 5 min |
| 📦 **Instalar** | [`INSTALACION.md`](INSTALACION.md) | 10 min |
| 📚 **Todo sobre el módulo** | [`README_EMPLOYEE.md`](README_EMPLOYEE.md) | 20 min |
| 📈 **Estado del proyecto** | [`ESTADO_PROYECTO.md`](ESTADO_PROYECTO.md) | 10 min |
| 🔌 **Conectar backend** | [`MOCK_VS_BACKEND.md`](MOCK_VS_BACKEND.md) | 15 min |
| 🗂️ **Ver todo** | [`INDICE.md`](INDICE.md) | 5 min |

---

## ✨ ¿Qué es esto?

**Dashboard de Empleados** para gestionar espacios de estacionamiento en tiempo real.

### Funcionalidades
- ✅ Login de empleados
- ✅ Gestión de 50 espacios (libre/ocupado/reservado)
- ✅ Validación de reservas (código numérico o QR)
- ✅ Asignación de lugares a reservas
- ✅ Estadísticas en tiempo real
- ✅ Temporizador de sesión

### Estado
- 🟢 **100% funcional** con datos de prueba (mock data)
- 🟢 **Preparado** para conectar con backend
- 🟢 **Documentación completa** (6 archivos)

---

## 🎯 Para Empezar

### 1. Instalar
```powershell
npm install
```

### 2. Iniciar
```powershell
npm run dev
```

### 3. Probar
- Abre: http://localhost:5173
- Usuario: `emp001`
- Contraseña: `123456`

---

## 🎮 Datos de Prueba

### Usuarios
- `emp001` / `123456` - Carlos Rodríguez
- `emp002` / `123456` - María García

### Códigos de Reserva Válidos
- `4567` - Juan Pérez (ABC-123)
- `8901` - Ana López (XYZ-789)
- `2345` - Pedro García (DEF-456)

### Espacios
- 50 espacios (A01 a A50)
- Estados: libre, ocupado, reservado

---

## 🏗️ Estructura

```
Employee Dashboard Module/
├── src/
│   ├── components/           # Componentes React
│   ├── services/            # API services (mock + backend)
│   │   ├── employeeService.js  # 10 funciones listas
│   │   └── mockData.js         # Datos de prueba
│   └── config/
│       └── api.js           # Configuración de la API
├── GUIA_RAPIDA.md          # ⭐ Empieza aquí
├── RESUMEN_EJECUTIVO.md    # Visión general
├── README_EMPLOYEE.md      # Documentación completa
├── INSTALACION.md          # Guía de instalación
├── ESTADO_PROYECTO.md      # Estado actual
├── MOCK_VS_BACKEND.md      # Integración backend
└── INDICE.md               # Índice de documentación
```

---

## 🔧 Tecnologías

- **React 18** + TypeScript
- **Vite** (Build tool)
- **Tailwind CSS** (Estilos)
- **shadcn/ui** (Componentes)
- **Radix UI** (Primitivas)

---

## 🔌 Backend

### Modo Actual: Mock Data
```javascript
// src/config/api.js
useMockData: true  // Datos de prueba locales
```

### Para Conectar Backend:
```javascript
// src/config/api.js
useMockData: false  // Conectar con API real
```

**Lee [`MOCK_VS_BACKEND.md`](MOCK_VS_BACKEND.md) para detalles completos**

---

## 📊 Lo Que Hace

| Función | Estado |
|---------|--------|
| Login | ✅ |
| Ver espacios | ✅ |
| Cambiar estados | ✅ |
| Filtrar espacios | ✅ |
| Validar reservas | ✅ |
| Asignar lugares | ✅ |
| Estadísticas | ✅ |
| Temporizador | ✅ |
| Logout | ✅ |

---

## 🚀 Comandos

```powershell
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview
```

---

## 📱 Pantallas

1. **Login** - Autenticación de empleados
2. **Estacionamiento** - Grid de 50 espacios
3. **Validar Reserva** - Por código o QR
4. **Reservas Pendientes** - Asignación de lugares
5. **Estadísticas** - Dashboard en tiempo real

---

## 💡 Tips Rápidos

- **Click en espacios** para cambiar estado
- **Usa filtros** para buscar rápido
- **Códigos válidos**: 4567, 8901, 2345
- **Reiniciar** limpia todos los datos
- **Datos mock** no persisten entre recargas

---

## 📖 Documentación Completa

Este README es solo un resumen. Para información detallada:

1. 🚀 [`GUIA_RAPIDA.md`](GUIA_RAPIDA.md) - Tutorial rápido
2. 📊 [`RESUMEN_EJECUTIVO.md`](RESUMEN_EJECUTIVO.md) - Visión general
3. 📚 [`README_EMPLOYEE.md`](README_EMPLOYEE.md) - Documentación técnica
4. 🗂️ [`INDICE.md`](INDICE.md) - Índice completo

---

## 🎯 Próximos Pasos

1. ✅ Instalar dependencias (`npm install`)
2. ✅ Iniciar servidor (`npm run dev`)
3. ✅ Probar con usuarios de prueba
4. ✅ Explorar funcionalidades
5. ✅ Leer documentación completa
6. 🔄 Conectar con backend (cuando esté listo)

---

## ⚠️ Notas Importantes

- **Datos mock**: Se borran al recargar (por diseño)
- **Puerto**: Usa 5173 (no conflicto con backend:3000)
- **Errores TS**: Normales hasta `npm install`
- **Backend**: Preparado, solo cambiar config

---

## 🐛 Problemas?

Lee [`INSTALACION.md`](INSTALACION.md) para solución de problemas comunes.

---

## ✨ Estado

```
✅ Funcional 100% (con mock data)
✅ UI completa y responsive
✅ Documentación completa
✅ Listo para desarrollo
✅ Preparado para backend
```

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2025  
**Estado**: ✅ Production Ready (mock mode)

---

## 📞 Links Rápidos

- [Guía Rápida](GUIA_RAPIDA.md) - Empieza aquí
- [Documentación Completa](README_EMPLOYEE.md) - Todo el detalle
- [Estado del Proyecto](ESTADO_PROYECTO.md) - Qué está hecho
- [Índice](INDICE.md) - Navega la documentación

---

**¡Listo para usar!** 🎉
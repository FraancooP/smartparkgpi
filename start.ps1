# Script para iniciar SmartPark completo
Write-Host "🚀 Iniciando SmartPark..." -ForegroundColor Green

# 1. Verificar Docker
Write-Host "`n📦 Verificando Docker..." -ForegroundColor Cyan
$dockerVersion = docker --version
if ($?) {
    Write-Host "✅ Docker encontrado: $dockerVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Docker no está instalado o no está en PATH" -ForegroundColor Red
    exit 1
}

# 2. Levantar contenedores
Write-Host "`n🐳 Levantando contenedores..." -ForegroundColor Cyan
docker-compose up -d

if ($?) {
    Write-Host "✅ Contenedores iniciados" -ForegroundColor Green
} else {
    Write-Host "❌ Error al iniciar contenedores" -ForegroundColor Red
    exit 1
}

# 3. Esperar a que MySQL esté listo
Write-Host "`n⏳ Esperando a que MySQL esté listo..." -ForegroundColor Cyan
$maxAttempts = 30
$attempt = 0
$ready = $false

while (-not $ready -and $attempt -lt $maxAttempts) {
    Start-Sleep -Seconds 2
    $attempt++
    
    $logs = docker logs smartpark_mysql 2>&1 | Select-String "ready for connections"
    
    if ($logs) {
        $ready = $true
        Write-Host "✅ MySQL está listo" -ForegroundColor Green
    } else {
        Write-Host "   Intento $attempt/$maxAttempts..." -ForegroundColor Yellow
    }
}

if (-not $ready) {
    Write-Host "❌ MySQL no se inició correctamente" -ForegroundColor Red
    Write-Host "Ver logs con: docker logs smartpark_mysql" -ForegroundColor Yellow
    exit 1
}

# 4. Verificar archivo .env
Write-Host "`n⚙️  Verificando configuración del backend..." -ForegroundColor Cyan
if (Test-Path "backend\.env") {
    Write-Host "✅ Archivo .env encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Archivo .env no encontrado, copiando desde .env.example" -ForegroundColor Yellow
    if (Test-Path "backend\.env.example") {
        Copy-Item "backend\.env.example" "backend\.env"
        Write-Host "✅ Archivo .env creado" -ForegroundColor Green
    } else {
        Write-Host "❌ No se encontró .env.example" -ForegroundColor Red
        exit 1
    }
}

# 5. Verificar node_modules
Write-Host "`n📚 Verificando dependencias..." -ForegroundColor Cyan
if (Test-Path "backend\node_modules") {
    Write-Host "✅ Dependencias ya instaladas" -ForegroundColor Green
} else {
    Write-Host "⚠️  Instalando dependencias..." -ForegroundColor Yellow
    Push-Location backend
    npm install
    Pop-Location
    
    if ($?) {
        Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
    } else {
        Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
        exit 1
    }
}

# 6. Mostrar información
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎉 SmartPark está listo!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Write-Host "`n📍 Servicios disponibles:" -ForegroundColor White
Write-Host "   🗄️  MySQL:       localhost:3307" -ForegroundColor Cyan
Write-Host "   🌐 phpMyAdmin:  http://localhost:8080" -ForegroundColor Cyan
Write-Host "      Usuario: smartpark_user" -ForegroundColor Gray
Write-Host "      Password: smartpark_password" -ForegroundColor Gray

Write-Host "`n🚀 Para iniciar el backend:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor Yellow

Write-Host "`n📖 Guías disponibles:" -ForegroundColor White
Write-Host "   - GUIA_DOCKER.md - Comandos Docker útiles" -ForegroundColor Gray
Write-Host "   - GUIA_TESTEO_POSTMAN.md - Testing de API" -ForegroundColor Gray

Write-Host "`n✋ Para detener todo:" -ForegroundColor White
Write-Host "   docker-compose down" -ForegroundColor Yellow

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

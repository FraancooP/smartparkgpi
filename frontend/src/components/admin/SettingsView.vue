<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 p-8">
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Header -->
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-bold text-slate-800">Configuración</h1>
        <p class="text-slate-600">Personaliza tu experiencia y gestiona la configuración del sistema</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Notificaciones -->
        <Card class="shadow-xl border-0 bg-white">
          <CardHeader class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div class="flex items-center gap-3">
              <Bell class="w-6 h-6" />
              <h2 class="text-xl font-bold">Notificaciones</h2>
            </div>
          </CardHeader>
          <CardContent class="p-6 space-y-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <Label class="font-medium">Notificaciones por Email</Label>
                  <p class="text-sm text-slate-500">Recibir alertas importantes por correo</p>
                </div>
                <Checkbox id="email-notif" defaultChecked />
              </div>

              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <Label class="font-medium">Alertas de Ocupación</Label>
                  <p class="text-sm text-slate-500">Notificar cuando se alcance el 90% de ocupación</p>
                </div>
                <Checkbox id="occupancy-alert" defaultChecked />
              </div>

              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <Label class="font-medium">Reportes Semanales</Label>
                  <p class="text-sm text-slate-500">Resumen semanal de actividad</p>
                </div>
                <Checkbox id="weekly-report" />
              </div>

              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <Label class="font-medium">Notificaciones Push</Label>
                  <p class="text-sm text-slate-500">Alertas en tiempo real en el navegador</p>
                </div>
                <Checkbox id="push-notif" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Seguridad -->
        <Card class="shadow-xl border-0 bg-white">
          <CardHeader class="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
            <div class="flex items-center gap-3">
              <Shield class="w-6 h-6" />
              <h2 class="text-xl font-bold">Seguridad</h2>
            </div>
          </CardHeader>
          <CardContent class="p-6 space-y-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <Label class="font-medium">Autenticación de Dos Factores</Label>
                  <p class="text-sm text-slate-500">Seguridad adicional para tu cuenta</p>
                </div>
                <span class="px-3 py-1 text-xs border border-orange-300 text-orange-600 rounded-md">
                  Configurar
                </span>
              </div>

              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <Label class="font-medium">Sesiones Activas</Label>
                  <p class="text-sm text-slate-500">Gestionar dispositivos conectados</p>
                </div>
                <Button variant="outline" size="sm">
                  Ver Sesiones
                </Button>
              </div>

              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <Label class="font-medium">Cambiar Contraseña</Label>
                  <p class="text-sm text-slate-500">Actualizar credenciales de acceso</p>
                </div>
                <Button variant="outline" size="sm">
                  Cambiar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Apariencia -->
        <Card class="shadow-xl border-0 bg-white">
          <CardHeader class="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
            <div class="flex items-center gap-3">
              <Palette class="w-6 h-6" />
              <h2 class="text-xl font-bold">Apariencia</h2>
            </div>
          </CardHeader>
          <CardContent class="p-6 space-y-6">
            <div class="space-y-4">
              <div class="space-y-2">
                <Label>Tema</Label>
                <select class="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm">
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>

              <div class="space-y-2">
                <Label>Tamaño de Fuente</Label>
                <select class="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm">
                  <option value="small">Pequeña</option>
                  <option value="medium" selected>Mediana</option>
                  <option value="large">Grande</option>
                </select>
              </div>

              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <Label class="font-medium">Animaciones</Label>
                  <p class="text-sm text-slate-500">Efectos visuales y transiciones</p>
                </div>
                <Checkbox id="animations" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Sistema -->
        <Card class="shadow-xl border-0 bg-white">
          <CardHeader class="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
            <div class="flex items-center gap-3">
              <Globe class="w-6 h-6" />
              <h2 class="text-xl font-bold">Sistema</h2>
            </div>
          </CardHeader>
          <CardContent class="p-6 space-y-6">
            <div class="space-y-4">
              <div class="space-y-2">
                <Label>Idioma</Label>
                <select class="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm">
                  <option value="es" selected>Español</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>

              <div class="space-y-2">
                <Label>Zona Horaria</Label>
                <select class="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm">
                  <option value="america-argentina" selected>America/Argentina/Buenos_Aires</option>
                  <option value="america-sao_paulo">America/Sao_Paulo</option>
                  <option value="america-new_york">America/New_York</option>
                </select>
              </div>

              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <Label class="font-medium">Actualizaciones Automáticas</Label>
                  <p class="text-sm text-slate-500">Instalar actualizaciones automáticamente</p>
                </div>
                <Checkbox id="auto-update" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Sección de Datos y Respaldo -->
      <Card class="shadow-xl border-0 bg-white">
        <CardHeader>
          <div class="flex items-center gap-3 text-slate-800">
            <Download class="w-6 h-6" />
            <h2 class="text-xl font-bold">Datos y Respaldo</h2>
          </div>
        </CardHeader>
        <CardContent class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h4 class="font-semibold text-slate-700">Exportar Datos</h4>
              <p class="text-sm text-slate-500">
                Descarga una copia de toda tu información de estacionamientos, empleados y transacciones.
              </p>
              <Button variant="outline" class="w-full">
                <Download class="w-4 h-4 mr-2" />
                Exportar Datos
              </Button>
            </div>

            <div class="space-y-4">
              <h4 class="font-semibold text-slate-700">Respaldo Automático</h4>
              <p class="text-sm text-slate-500">
                Configura respaldos automáticos de tu información en la nube.
              </p>
              <div class="flex items-center justify-between">
                <span class="text-sm">Respaldo activado</span>
                <Checkbox id="auto-backup" defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Zona Peligrosa -->
      <Card class="shadow-xl border-2 border-red-200 bg-white">
        <CardHeader class="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
          <div class="flex items-center gap-3">
            <AlertTriangle class="w-6 h-6" />
            <h2 class="text-xl font-bold">Zona Peligrosa</h2>
          </div>
        </CardHeader>
        <CardContent class="p-6">
          <div class="space-y-4">
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <Label class="text-red-700 font-semibold">Eliminar Cuenta</Label>
                <p class="text-sm text-slate-500">
                  Esta acción eliminará permanentemente tu cuenta y todos los datos asociados. 
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <Button class="ml-4 bg-red-600 hover:bg-red-700 text-white">
                <Trash2 class="w-4 h-4 mr-2" />
                Eliminar Cuenta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Botón de Guardar Cambios -->
      <div class="flex justify-center">
        <Button class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3 text-white">
          <Settings class="w-4 h-4 mr-2" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Bell, Shield, Palette, Globe, Download, Trash2, AlertTriangle, Settings } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Label from '@/components/ui/Label.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'
</script>

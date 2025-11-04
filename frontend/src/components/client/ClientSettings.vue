<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-y-auto pb-20">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div class="flex items-center justify-between p-4">
        <button
          @click="$emit('close')"
          class="hover:bg-slate-100 rounded-lg px-3 py-2 transition"
        >
          <ArrowLeft class="h-5 w-5" />
        </button>
        <h1 class="text-xl font-semibold">Configuración</h1>
        <div class="w-10" />
      </div>
    </div>

    <div class="p-4 space-y-6">
      <!-- Cuenta y Privacidad -->
      <Card class="bg-white/90 border-slate-200">
        <CardHeader class="pb-3">
          <h2 class="flex items-center gap-2 text-lg font-semibold">
            <Shield class="h-5 w-5 text-blue-500" />
            Cuenta y Privacidad
          </h2>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <p class="font-medium">Verificación en dos pasos</p>
              <p class="text-sm text-slate-600">
                Protege tu cuenta con autenticación adicional
              </p>
            </div>
            <button class="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition">
              Configurar
            </button>
          </div>
          
          <div class="h-px bg-slate-200"></div>
          
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <p class="font-medium">Acceso a ubicación</p>
              <p class="text-sm text-slate-600">
                Para encontrar estacionamientos cercanos
              </p>
            </div>
            <Checkbox id="location" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <!-- Notificaciones -->
      <Card class="bg-white/90 border-slate-200">
        <CardHeader class="pb-3">
          <h2 class="flex items-center gap-2 text-lg font-semibold">
            <Bell class="h-5 w-5 text-green-500" />
            Notificaciones
          </h2>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <p class="font-medium">Notificaciones push</p>
              <p class="text-sm text-slate-600">
                Recibe alertas de reservas y ofertas
              </p>
            </div>
            <Checkbox id="push" defaultChecked />
          </div>
          
          <div class="h-px bg-slate-200"></div>
          
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <p class="font-medium">Efectos de sonido</p>
              <p class="text-sm text-slate-600">
                Sonidos de confirmación y alertas
              </p>
            </div>
            <Checkbox id="sound" defaultChecked />
          </div>
          
          <div class="h-px bg-slate-200"></div>
          
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <p class="font-medium">Recordatorios de tiempo</p>
              <p class="text-sm text-slate-600">
                Te avisamos antes de que expire tu reserva
              </p>
            </div>
            <button class="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition">
              15 min antes
            </button>
          </div>
        </CardContent>
      </Card>

      <!-- Apariencia -->
      <Card class="bg-white/90 border-slate-200">
        <CardHeader class="pb-3">
          <h2 class="flex items-center gap-2 text-lg font-semibold">
            <Palette class="h-5 w-5 text-purple-500" />
            Apariencia
          </h2>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <p class="font-medium">Modo oscuro</p>
              <p class="text-sm text-slate-600">
                Tema oscuro para mayor comodidad visual
              </p>
            </div>
            <div class="flex items-center gap-2">
              <Sun class="h-4 w-4 text-slate-400" />
              <Checkbox id="darkmode" />
              <Moon class="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Cerrar Sesión -->
      <button class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg">
        <LogOut class="h-5 w-5" />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Shield, Bell, Palette, Sun, Moon, LogOut } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Checkbox from '@/components/ui/Checkbox.vue'

defineEmits(['close'])
</script>

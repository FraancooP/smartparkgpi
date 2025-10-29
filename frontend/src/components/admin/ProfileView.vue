<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-8">
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Header -->
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-bold text-slate-800">Mi Perfil</h1>
        <p class="text-slate-600">Gestiona tu información personal y configuración de cuenta</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Información del Usuario -->
        <Card class="lg:col-span-2 shadow-xl border-0 bg-white text-black">
          <CardHeader class="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <div class="flex items-center gap-3">
              <User class="w-6 h-6" />
              <h2 class="text-xl font-bold">Información Personal</h2>
            </div>
          </CardHeader>
          <CardContent class="p-8 space-y-6 text-black">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="firstName" class="text-black">Nombre</Label>
                <Input
                  id="firstName"
                  :value="userInfo.nombre"
                  class="border-purple-200 focus:border-purple-400 text-black"
                  readonly
                />
              </div>
              <div class="space-y-2">
                <Label for="lastName" class="text-black">Apellido</Label>
                <Input
                  id="lastName"
                  :value="userInfo.apellido"
                  class="border-purple-200 focus:border-purple-400 text-black"
                  readonly
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="email" class="text-black">Email</Label>
              <div class="relative">
                <Mail class="w-4 h-4 absolute left-3 top-3 text-purple-500" />
                <Input
                  id="email"
                  type="email"
                  :value="userInfo.correo"
                  class="pl-10 border-purple-200 focus:border-purple-400 text-black"
                  readonly
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="phone" class="text-black">Teléfono</Label>
              <div class="relative">
                <Phone class="w-4 h-4 absolute left-3 top-3 text-purple-500" />
                <Input
                  id="phone"
                  :value="userInfo.telefono || 'No especificado'"
                  class="pl-10 border-purple-200 focus:border-purple-400 text-black"
                  readonly
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="address" class="text-black">Dirección</Label>
              <div class="relative">
                <MapPin class="w-4 h-4 absolute left-3 top-3 text-purple-500" />
                <Input
                  id="address"
                  :value="userInfo.direccion || 'No especificada'"
                  class="pl-10 border-purple-200 focus:border-purple-400 text-black"
                  readonly
                />
              </div>
            </div>

            <div class="flex justify-end">
              <Button class="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                <Edit class="w-4 h-4 mr-2" />
                Actualizar Información
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Tarjeta de Perfil -->
        <div class="space-y-6">
          <Card class="shadow-xl border-0 bg-white">
            <CardContent class="p-8 text-center space-y-6">
              <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center text-purple-700 text-2xl font-bold border-4 border-purple-200">
                {{ initials }}
              </div>
              
              <div>
                <h3 class="text-xl font-semibold text-slate-800">{{ userInfo.nombre }} {{ userInfo.apellido }}</h3>
                <p class="text-slate-600">Administrador</p>
              </div>

              <div class="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                Cuenta Activa
              </div>

              <div class="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Calendar class="w-4 h-4" />
                Miembro desde Enero 2024
              </div>
            </CardContent>
          </Card>

          <!-- Estadísticas rápidas -->
          <Card class="shadow-xl border-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <CardContent class="p-6">
              <div class="space-y-4">
                <h4 class="text-center font-semibold">Resumen de Actividad</h4>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span>Estacionamientos</span>
                    <span class="font-bold text-lg">3</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Plazas Totales</span>
                    <span class="font-bold text-lg">405</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Empleados</span>
                    <span class="font-bold text-lg">12</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { User, Mail, Phone, MapPin, Calendar, Edit } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'

// Obtener datos del usuario desde localStorage
const userInfo = computed(() => {
  const stored = localStorage.getItem('user')
  if (stored) {
    return JSON.parse(stored)
  }
  return {
    nombre: 'Admin',
    apellido: 'Principal',
    nombre_usuario: 'admin',
    correo: 'admin@smartpark.com',
    telefono: '',
    direccion: '',
    estado: 'activo'
  }
})

const initials = computed(() => {
  return `${userInfo.value.nombre[0]}${userInfo.value.apellido[0]}`.toUpperCase()
})
</script>

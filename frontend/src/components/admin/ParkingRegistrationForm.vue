<template>
  <div class="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen overflow-y-auto">
    <Card class="shadow-2xl border-0">
      <CardHeader class="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
        <h2 class="text-center text-2xl font-bold">Registrar Nuevo Estacionamiento</h2>
      </CardHeader>
      <CardContent class="p-8">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">Información Básica</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="name" class="text-slate-700">Nombre del Estacionamiento</Label>
                <Input id="name" v-model="formData.name" placeholder="Ej: Estacionamiento Centro" class="border-blue-200 focus:border-blue-400 text-slate-900 placeholder:text-slate-400" required />
              </div>
              <div class="space-y-2">
                <Label for="license" class="text-slate-700">Matrícula</Label>
                <Input id="license" v-model="formData.license" placeholder="Ej: EST-2024-001" class="border-blue-200 focus:border-blue-400 text-slate-900 placeholder:text-slate-400" required />
              </div>
            </div>
            <div class="space-y-2">
              <Label for="location" class="text-slate-700">Ubicación</Label>
              <textarea id="location" v-model="formData.location" placeholder="Dirección completa del estacionamiento" class="flex min-h-[80px] w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2" required />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="lat" class="text-slate-700">Latitud</Label>
                <Input id="lat" v-model="formData.lat" type="number" step="0.0001" placeholder="Ej: -31.4201" class="border-blue-200 focus:border-blue-400 text-slate-900 placeholder:text-slate-400" required />
              </div>
              <div class="space-y-2">
                <Label for="lng" class="text-slate-700">Longitud</Label>
                <Input id="lng" v-model="formData.lng" type="number" step="0.0001" placeholder="Ej: -64.1888" class="border-blue-200 focus:border-blue-400 text-slate-900 placeholder:text-slate-400" required />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="spaces-auto" class="text-slate-700">🚗 Plazas para Autos</Label>
                <Input id="spaces-auto" v-model="formData.spacesAuto" type="number" min="0" placeholder="Ej: 40" class="border-blue-200 focus:border-blue-400 text-slate-900 placeholder:text-slate-400" required />
              </div>
              <div class="space-y-2">
                <Label for="spaces-moto" class="text-slate-700">🏍️ Plazas para Motos</Label>
                <Input id="spaces-moto" v-model="formData.spacesMoto" type="number" min="0" placeholder="Ej: 10" class="border-blue-200 focus:border-blue-400 text-slate-900 placeholder:text-slate-400" required />
              </div>
            </div>
            <div class="text-sm text-slate-600 bg-blue-50 p-3 rounded-md">
              <strong>Total de plazas:</strong> {{ totalSpaces }} ({{ formData.spacesAuto || 0 }} autos + {{ formData.spacesMoto || 0 }} motos)
            </div>
          </div>
          <div class="border-t border-blue-200"></div>
```
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">Tarifas por Hora (ARS)</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label class="text-slate-700">Tarifa Motos</Label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input v-model="formData.rates.moto" type="number" placeholder="Ej: 200" class="pl-8 border-green-200 focus:border-green-400 text-slate-900 placeholder:text-slate-400" required />
                </div>
              </div>
              <div class="space-y-2">
                <Label class="text-slate-700">Tarifa Autos</Label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input v-model="formData.rates.auto" type="number" placeholder="Ej: 400" class="pl-8 border-green-200 focus:border-green-400 text-slate-900 placeholder:text-slate-400" required />
                </div>
              </div>
            </div>
          </div>
          <div class="border-t border-blue-200"></div>
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-blue-800">Empleados</h3>
              <Button type="button" @click="addEmployee" class="bg-green-600 hover:bg-green-700 text-white"><Plus class="w-4 h-4 mr-2" />Agregar Empleado</Button>
            </div>
            <p v-if="formData.employees.length === 0" class="text-center text-gray-500 py-8">No hay empleados agregados</p>
            <div v-else class="space-y-4">
              <Card v-for="(employee, index) in formData.employees" :key="employee.id" class="bg-green-50 border-green-200">
                <CardContent class="p-4">
                  <div class="flex justify-between items-start mb-4">
                    <h4 class="font-semibold text-green-800">Empleado {{ index + 1 }}</h4>
                    <Button type="button" @click="removeEmployee(employee.id)" class="bg-red-500 hover:bg-red-600 text-white h-8 px-3"><Trash2 class="w-4 h-4" /></Button>
                  </div>
                  <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <Label class="text-slate-700">Nombre</Label>
                        <Input v-model="employee.nombre" placeholder="Nombre" class="border-green-200 focus:border-green-400 text-slate-900 placeholder:text-slate-400" required />
                      </div>
                      <div class="space-y-2">
                        <Label class="text-slate-700">Apellido</Label>
                        <Input v-model="employee.apellido" placeholder="Apellido" class="border-green-200 focus:border-green-400 text-slate-900 placeholder:text-slate-400" required />
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <Label class="text-slate-700">DNI</Label>
                        <Input v-model="employee.dni" placeholder="DNI" class="border-green-200 focus:border-green-400 text-slate-900 placeholder:text-slate-400" required />
                      </div>
                      <div class="space-y-2">
                        <Label class="text-slate-700">Teléfono</Label>
                        <Input v-model="employee.telefono" placeholder="Teléfono" class="border-green-200 focus:border-green-400 text-slate-900 placeholder:text-slate-400" required />
                      </div>
                    </div>
                    <div class="bg-blue-50 p-4 rounded-lg space-y-4 border border-blue-200">
                      <h5 class="font-semibold text-blue-800 text-sm">Credenciales de Acceso</h5>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                          <Label class="text-slate-700">Usuario</Label>
                          <Input v-model="employee.nombre_usuario" placeholder="Usuario" class="border-blue-200 focus:border-blue-400 text-slate-900 placeholder:text-slate-400" required />
                        </div>
                        <div class="space-y-2">
                          <Label class="text-slate-700">Email</Label>
                          <Input v-model="employee.correo" type="email" placeholder="email@ejemplo.com" class="border-blue-200 focus:border-blue-400 text-slate-900 placeholder:text-slate-400" required />
                        </div>
                      </div>
                      <div class="space-y-2">
                        <Label class="text-slate-700">Contraseña</Label>
                        <div class="relative">
                          <Input v-model="employee.contrasena" :type="employee.showPassword ? 'text' : 'password'" placeholder="Contraseña" class="pr-10 border-blue-200 focus:border-blue-400 text-slate-900 placeholder:text-slate-400" required />
                          <button type="button" @click="employee.showPassword = !employee.showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"><Eye v-if="!employee.showPassword" class="w-4 h-4" /><EyeOff v-else class="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                    <div class="space-y-2">
                      <Label class="text-slate-700">Dirección</Label>
                      <Input v-model="employee.direccion" placeholder="Dirección" class="border-green-200 focus:border-green-400 text-slate-900 placeholder:text-slate-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div class="flex gap-4 pt-6">
            <Button type="button" @click="$emit('cancel')" class="flex-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">Cancelar</Button>
            <Button type="submit" class="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">Registrar Estacionamiento</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { Plus, Trash2, Eye, EyeOff } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { createParking } from '@/services/parkingService'
const emit = defineEmits(['submit', 'cancel', 'success'])
const formData = ref({ name: '', location: '', lat: '', lng: '', spacesAuto: 0, spacesMoto: 0, license: '', rates: { moto: '', auto: '' }, employees: [] })

// Computed para total de plazas
const totalSpaces = computed(() => {
  return (parseInt(formData.value.spacesAuto) || 0) + (parseInt(formData.value.spacesMoto) || 0)
})

const addEmployee = () => { formData.value.employees.push({ id: Date.now().toString(), nombre: '', apellido: '', nombre_usuario: '', correo: '', contrasena: '', direccion: '', telefono: '', dni: '', showPassword: false }) }
const removeEmployee = (id) => { formData.value.employees = formData.value.employees.filter(emp => emp.id !== id) }
const handleSubmit = async () => {
  try {
    if (!formData.value.name || !formData.value.lat || !formData.value.lng) return alert('Completa todos los campos obligatorios')
    if (totalSpaces.value === 0) return alert('Debe haber al menos 1 plaza (auto o moto)')
    if (formData.value.employees.length === 0) return alert('Agrega al menos un empleado')
    const parkingData = { nombre: formData.value.name, informacion: formData.value.location, lat: parseFloat(formData.value.lat), lng: parseFloat(formData.value.lng), cantidad_lugares_auto: parseInt(formData.value.spacesAuto) || 0, cantidad_lugares_moto: parseInt(formData.value.spacesMoto) || 0, matricula: formData.value.license, tarifa_moto: parseFloat(formData.value.rates.moto), tarifa_auto: parseFloat(formData.value.rates.auto), empleados: formData.value.employees.map(e => ({ nombre: e.nombre, apellido: e.apellido, nombre_usuario: e.nombre_usuario, correo: e.correo, contrasena: e.contrasena, direccion: e.direccion || '', telefono: e.telefono, dni: e.dni })) }
    await createParking(parkingData)
    alert(`Estacionamiento creado exitosamente`)
    formData.value = { name: '', location: '', lat: '', lng: '', spacesAuto: 0, spacesMoto: 0, license: '', rates: { moto: '', auto: '' }, employees: [] }
    emit('success')
  } catch (error) { alert(`Error: ${error.response?.data?.error || 'Intenta de nuevo'}`) }
}
</script>

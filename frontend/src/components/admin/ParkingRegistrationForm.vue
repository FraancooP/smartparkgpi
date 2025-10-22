<template>
  <div class="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen overflow-y-auto">
    <Card class="shadow-2xl border-0">
      <CardHeader class="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
        <h2 class="text-center text-2xl font-bold">Registrar Nuevo Estacionamiento</h2>
      </CardHeader>

      <CardContent class="p-8">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Información Básica -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">
              Información Básica
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="name">Nombre del Estacionamiento</Label>
                <Input
                  id="name"
                  v-model="formData.name"
                  placeholder="Ej: Estacionamiento Centro"
                  class="border-blue-200 focus:border-blue-400"
                  required
                />
              </div>

              <div class="space-y-2">
                <Label for="license">Matrícula</Label>
                <Input
                  id="license"
                  v-model="formData.license"
                  placeholder="Ej: EST-2024-001"
                  class="border-blue-200 focus:border-blue-400"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="location">Ubicación</Label>
              <textarea
                id="location"
                v-model="formData.location"
                placeholder="Dirección completa del estacionamiento"
                class="flex min-h-[80px] w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                required
              />
            </div>

            <div class="space-y-2">
              <Label for="spaces">Cantidad de Plazas</Label>
              <Input
                id="spaces"
                v-model="formData.spaces"
                type="number"
                placeholder="Ej: 50"
                class="border-blue-200 focus:border-blue-400"
                required
              />
            </div>
          </div>

          <div class="border-t border-blue-200"></div>

          <!-- Imágenes -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">
              Imágenes (mínimo 3)
            </h3>

            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <label
                  for="image-upload"
                  class="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium border border-green-300 bg-white text-green-700 hover:bg-green-50 h-10 px-4 py-2"
                >
                  <Upload class="w-4 h-4 mr-2" />
                  Seleccionar Imágenes
                </label>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleImageUpload"
                  class="hidden"
                />
                <span class="text-sm text-slate-600">{{ formData.images.length }} imagen(es) seleccionada(s)</span>
              </div>

              <div v-if="formData.images.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  v-for="(image, index) in formData.images"
                  :key="index"
                  class="relative group"
                >
                  <img
                    :src="image"
                    :alt="`Imagen ${index + 1}`"
                    class="w-full h-32 object-cover rounded-lg border-2 border-green-200"
                  />
                  <button
                    type="button"
                    @click="removeImage(index)"
                    class="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-blue-200"></div>

          <!-- Tarifas -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">
              Tarifas por Hora
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="rate-moto">Tarifa Moto (por hora)</Label>
                <div class="relative">
                  <span class="absolute left-3 top-3 text-green-600 font-medium">$</span>
                  <Input
                    id="rate-moto"
                    v-model="formData.rates.moto"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    class="pl-8 border-green-200 focus:border-green-400"
                    required
                  />
                </div>
              </div>

              <div class="space-y-2">
                <Label for="rate-auto">Tarifa Auto (por hora)</Label>
                <div class="relative">
                  <span class="absolute left-3 top-3 text-green-600 font-medium">$</span>
                  <Input
                    id="rate-auto"
                    v-model="formData.rates.auto"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    class="pl-8 border-green-200 focus:border-green-400"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-blue-200"></div>

          <!-- Empleados -->
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">
                Empleados
              </h3>
              <Button
                type="button"
                @click="addEmployee"
                class="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus class="w-4 h-4 mr-2" />
                Agregar Empleado
              </Button>
            </div>

            <p v-if="formData.employees.length === 0" class="text-center text-gray-500 py-8">
              No hay empleados agregados. Los empleados tendrán acceso con rol de empleado.
            </p>

            <div v-else class="space-y-4">
              <Card
                v-for="(employee, index) in formData.employees"
                :key="employee.id"
                class="bg-green-50 border-green-200"
              >
                <CardContent class="p-4">
                  <div class="space-y-4">
                    <!-- Datos personales del empleado -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <Label>Nombre</Label>
                        <Input
                          v-model="employee.nombre"
                          placeholder="Nombre del empleado"
                          class="border-green-200 focus:border-green-400"
                          required
                        />
                      </div>
                      <div class="space-y-2">
                        <Label>Apellido</Label>
                        <Input
                          v-model="employee.apellido"
                          placeholder="Apellido del empleado"
                          class="border-green-200 focus:border-green-400"
                          required
                        />
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <Label>DNI</Label>
                        <Input
                          v-model="employee.dni"
                          placeholder="Número de documento"
                          class="border-green-200 focus:border-green-400"
                          required
                        />
                      </div>
                      <div class="space-y-2">
                        <Label>Teléfono</Label>
                        <Input
                          v-model="employee.telefono"
                          placeholder="Número de teléfono"
                          class="border-green-200 focus:border-green-400"
                          required
                        />
                      </div>
                    </div>

                    <div class="space-y-2">
                      <Label>Email</Label>
                      <Input
                        v-model="employee.correo"
                        type="email"
                        placeholder="email@ejemplo.com"
                        class="border-green-200 focus:border-green-400"
                        required
                      />
                    </div>

                    <div class="space-y-2">
                      <Label>Dirección</Label>
                      <Input
                        v-model="employee.direccion"
                        placeholder="Dirección del empleado"
                        class="border-green-200 focus:border-green-400"
                      />
                    </div>

                    <!-- Credenciales de acceso -->
                    <div class="border-t border-green-300 pt-4">
                      <p class="text-sm text-green-700 font-medium mb-3">Credenciales de Acceso</p>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                          <Label>Nombre de Usuario</Label>
                          <Input
                            v-model="employee.nombre_usuario"
                            placeholder="usuario123"
                            class="border-green-200 focus:border-green-400"
                            required
                          />
                        </div>
                        <div class="space-y-2">
                          <Label>Contraseña</Label>
                          <div class="relative">
                            <Input
                              :type="employee.showPassword ? 'text' : 'password'"
                              v-model="employee.contrasena"
                              placeholder="••••••••"
                              class="pr-12 border-green-200 focus:border-green-400"
                              required
                            />
                            <button
                              type="button"
                              @click="employee.showPassword = !employee.showPassword"
                              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              <Eye v-if="!employee.showPassword" class="w-4 h-4" />
                              <EyeOff v-else class="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Botón eliminar -->
                    <div class="flex justify-end pt-2">
                      <button
                        type="button"
                        @click="removeEmployee(employee.id)"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 h-9 px-4"
                      >
                        <Trash2 class="w-4 h-4 mr-2" />
                        Eliminar Empleado
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="flex gap-4 pt-6">
            <Button
              type="button"
              @click="$emit('cancel')"
              class="flex-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              class="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
            >
              Registrar Estacionamiento
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Trash2, Upload, Eye, EyeOff } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'

defineEmits(['submit', 'cancel'])

const formData = ref({
  name: '',
  location: '',
  spaces: '',
  license: '',
  images: [],
  rates: {
    moto: '',
    auto: ''
  },
  employees: []
})

const addEmployee = () => {
  const newEmployee = {
    id: Date.now().toString(),
    // Datos personales (modelo Usuario)
    nombre: '',
    apellido: '',
    nombre_usuario: '',
    correo: '',
    contrasena: '',
    direccion: '',
    telefono: '',
    dni: '',
    showPassword: false
  }
  formData.value.employees.push(newEmployee)
}

const removeEmployee = (id) => {
  formData.value.employees = formData.value.employees.filter(emp => emp.id !== id)
}

const handleImageUpload = (event) => {
  const files = event.target.files
  if (files) {
    // En producción, aquí subirías las imágenes al servidor
    // Por ahora creamos URLs temporales
    Array.from(files).forEach((file, index) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (formData.value.images.length < 5) {
          formData.value.images.push(e.target.result)
        }
      }
      reader.readAsDataURL(file)
    })
  }
}

const removeImage = (index) => {
  formData.value.images.splice(index, 1)
}

const handleSubmit = () => {
  // Validar que haya al menos 3 imágenes
  if (formData.value.images.length < 3) {
    alert('Debes subir al menos 3 imágenes del estacionamiento')
    return
  }

  console.log('Datos del formulario:', formData.value)
  
  // Aquí se enviará al backend
  // Por ahora solo emitimos el evento
  // El componente padre manejará el envío al backend
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <!-- Back Button -->
      <Button 
        variant="ghost" 
        @click="$emit('back')"
        class="mb-6 text-slate-400 hover:text-white hover:bg-slate-800"
      >
        <ArrowLeft class="w-4 h-4 mr-2" />
        Volver
      </Button>

      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-3">
          <Users class="w-8 h-8 text-blue-400 mr-2" />
          <h1 class="text-4xl text-white">
            Smart<span class="text-blue-400">Park</span>
          </h1>
        </div>
        <p class="text-slate-400">Portal de Usuarios</p>
      </div>

      <!-- Register Card -->
      <Card class="bg-slate-800 border-slate-700 shadow-2xl">
        <CardHeader class="space-y-1 pb-4">
          <h2 class="text-2xl text-center text-white">
            Registro
          </h2>
          <p class="text-slate-400 text-center text-sm">
            Crea tu cuenta en SmartPark
          </p>
        </CardHeader>
        
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Name Fields -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="firstName" class="text-slate-300">
                  Nombre
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Tu nombre"
                  v-model="formData.firstName"
                  class="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label for="lastName" class="text-slate-300">
                  Apellido
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Tu apellido"
                  v-model="formData.lastName"
                  class="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>

            <!-- DNI Field -->
            <div class="space-y-2">
              <Label for="dni" class="text-slate-300">
                DNI
              </Label>
              <Input
                id="dni"
                type="text"
                placeholder="Número de documento"
                v-model="formData.dni"
                class="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                required
              />
            </div>

            <!-- Phone Field -->
            <div class="space-y-2">
              <Label for="phone" class="text-slate-300">
                Teléfono
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Número de teléfono"
                v-model="formData.phone"
                class="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                required
              />
            </div>

            <!-- Email Field -->
            <div class="space-y-2">
              <Label for="email" class="text-slate-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                v-model="formData.email"
                class="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                required
              />
            </div>

            <!-- Username Field -->
            <div class="space-y-2">
              <Label for="username" class="text-slate-300">
                Usuario
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Nombre de usuario"
                v-model="formData.username"
                class="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                required
              />
            </div>

            <!-- Password Field -->
            <div class="space-y-2">
              <Label for="password" class="text-slate-300">
                Contraseña
              </Label>
              <div class="relative">
                <Input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Crea una contraseña"
                  v-model="formData.password"
                  class="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 pr-10"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <Eye v-if="!showPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Confirm Password Field -->
            <div class="space-y-2">
              <Label for="confirmPassword" class="text-slate-300">
                Repetir Contraseña
              </Label>
              <div class="relative">
                <Input
                  id="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirma tu contraseña"
                  v-model="formData.confirmPassword"
                  class="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 pr-10"
                  required
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <Eye v-if="!showConfirmPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Register Button -->
            <Button 
              type="submit" 
              class="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Crear Cuenta
            </Button>

            <!-- Login Link -->
            <div class="text-center pt-4 border-t border-slate-700">
              <p class="text-slate-400 text-sm">
                ¿Ya tienes cuenta?
                <button
                  type="button"
                  @click="$emit('login')"
                  class="text-blue-400 hover:text-blue-300 underline ml-1"
                >
                  Iniciar Sesión
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      <!-- Footer -->
      <div class="text-center mt-8">
        <p class="text-slate-500 text-sm">
          © 2025 SmartPark. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { Eye, EyeOff, ArrowLeft, Users } from 'lucide-vue-next'

defineEmits(['back', 'register', 'login'])

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const formData = ref({
  firstName: '',
  lastName: '',
  dni: '',
  phone: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
})

const handleSubmit = () => {
  if (formData.value.password !== formData.value.confirmPassword) {
    alert('Las contraseñas no coinciden')
    return
  }
  console.log('Client register:', formData.value)
  // Aquí se conectará con el backend
}
</script>

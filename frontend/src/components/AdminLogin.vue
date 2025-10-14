<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center px-4">
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
          <Shield class="w-8 h-8 text-red-400 mr-2" />
          <h1 class="text-4xl text-white">
            Smart<span class="text-red-400">Park</span>
          </h1>
        </div>
        <p class="text-slate-400">Panel de Administración</p>
      </div>

      <!-- Login Card -->
      <Card class="bg-slate-800 border-slate-700 shadow-2xl">
        <CardHeader class="space-y-1 pb-4">
          <h2 class="text-2xl text-center text-white">
            Iniciar Sesión - Admin
          </h2>
          <p class="text-slate-400 text-center text-sm">
            Accede al panel de administración
          </p>
        </CardHeader>
        
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Username/Email Field -->
            <div class="space-y-2">
              <Label for="username" class="text-slate-300">
                Usuario o Email
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Ingresa tu usuario o email"
                v-model="formData.username"
                class="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/20"
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
                  placeholder="Ingresa tu contraseña"
                  v-model="formData.password"
                  class="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/20 pr-10"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <Eye v-if="!showPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  v-model:checked="rememberMe"
                  class="border-slate-600"
                />
                <Label
                  for="remember"
                  class="text-sm text-slate-400 cursor-pointer"
                >
                  Recordarme
                </Label>
              </div>
              <button
                type="button"
                @click="$emit('forgotPassword')"
                class="text-sm text-red-400 hover:text-red-300 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <!-- Login Button -->
            <Button
              type="submit"
              class="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Iniciar Sesión
            </Button>

            <!-- Divider -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t border-slate-700" />
              </div>
              <div class="relative flex justify-center text-xs uppercase">
                <span class="bg-slate-800 px-2 text-slate-400">
                  o
                </span>
              </div>
            </div>

            <!-- Register Link -->
            <div class="text-center">
              <p class="text-sm text-slate-400">
                ¿No tienes una cuenta?
                <button
                  type="button"
                  @click="$emit('register')"
                  class="text-red-400 hover:text-red-300 hover:underline font-medium"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
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
import Checkbox from '@/components/ui/Checkbox.vue'
import { Eye, EyeOff, ArrowLeft, Shield } from 'lucide-vue-next'

defineEmits(['back', 'login', 'forgotPassword', 'register'])

const showPassword = ref(false)
const rememberMe = ref(false)
const formData = ref({
  username: '',
  password: ''
})

const handleSubmit = () => {
  console.log('Admin login:', formData.value)
  // Aquí se conectará con el backend
}
</script>

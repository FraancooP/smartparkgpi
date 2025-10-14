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
        Volver al login
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

      <!-- Forgot Password Card -->
      <Card class="bg-slate-800 border-slate-700 shadow-2xl">
        <CardHeader class="space-y-1 pb-4">
          <div class="flex justify-center mb-4">
            <div class="p-3 bg-red-900/30 rounded-full">
              <Mail class="w-8 h-8 text-red-400" />
            </div>
          </div>
          <h2 class="text-2xl text-center text-white">
            Recuperar Contraseña
          </h2>
          <p class="text-slate-400 text-center text-sm">
            Ingresa tu email de administrador para recibir las instrucciones
          </p>
        </CardHeader>
        
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Email Field -->
            <div class="space-y-2">
              <Label for="email" class="text-slate-300">
                Email de Administrador
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@smartpark.com"
                v-model="email"
                class="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/20"
                required
              />
            </div>

            <!-- Info Text -->
            <div class="bg-red-900/20 border border-red-800/30 rounded-lg p-4">
              <p class="text-slate-300 text-sm">
                Te enviaremos un enlace de recuperación a tu email de administrador registrado.
              </p>
            </div>

            <!-- Submit Button -->
            <Button 
              type="submit" 
              class="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Enviar Instrucciones
            </Button>

            <!-- Back to Login Link -->
            <div class="text-center pt-4 border-t border-slate-700">
              <p class="text-slate-400 text-sm">
                ¿Recordaste tu contraseña?
                <button
                  type="button"
                  @click="$emit('back')"
                  class="text-red-400 hover:text-red-300 underline ml-1"
                >
                  Volver al login
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      <!-- Footer -->
      <div class="text-center mt-8">
        <p class="text-slate-500 text-sm">
          © 2025 SmartPark Admin. Todos los derechos reservados.
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
import { ArrowLeft, Shield, Mail } from 'lucide-vue-next'

defineEmits(['back', 'submit'])

const email = ref('')

const handleSubmit = () => {
  console.log('Admin forgot password:', email.value)
  // Aquí se conectará con el backend
}
</script>

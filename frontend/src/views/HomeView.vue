<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center px-4">
    <div class="w-full max-w-4xl">
      <!-- Logo -->
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-4">
          Smart<span class="text-blue-400">Park</span>
        </h1>
        <p class="text-slate-400 text-lg">Sistema de Gestión de Estacionamiento</p>
      </div>

      <!-- Selection Cards -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Admin Card -->
        <Card 
          class="bg-slate-800 border-slate-700 shadow-2xl hover:border-red-500/50 transition-all cursor-pointer group"
          @click="handleSelection('admin')"
        >
          <CardContent class="p-8">
            <div class="text-center space-y-6">
              <div class="flex justify-center">
                <div class="p-6 bg-red-500/10 rounded-full group-hover:bg-red-500/20 transition-colors">
                  <Shield class="w-16 h-16 text-red-400" />
                </div>
              </div>
              
              <div>
                <h2 class="text-2xl font-bold text-white mb-2">
                  Panel de Administración
                </h2>
                <p class="text-slate-400">
                  Acceso para administradores del sistema
                </p>
              </div>

              <Button 
                class="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Acceder como Admin
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Client Card -->
        <Card 
          class="bg-slate-800 border-slate-700 shadow-2xl hover:border-blue-500/50 transition-all cursor-pointer group"
          @click="handleSelection('client')"
        >
          <CardContent class="p-8">
            <div class="text-center space-y-6">
              <div class="flex justify-center">
                <div class="p-6 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
                  <Users class="w-16 h-16 text-blue-400" />
                </div>
              </div>
              
              <div>
                <h2 class="text-2xl font-bold text-white mb-2">
                  Portal de Usuarios
                </h2>
                <p class="text-slate-400">
                  Acceso para clientes del estacionamiento
                </p>
              </div>

              <Button 
                class="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Acceder como Usuario
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Footer -->
      <div class="text-center mt-12">
        <p class="text-slate-500 text-sm">
          © 2025 SmartPark. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import { Shield, Users } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleSelection = (option) => {
  if (option === 'admin') {
    router.push('/admin/login')
  } else {
    router.push('/client/login')
  }
}
</script>

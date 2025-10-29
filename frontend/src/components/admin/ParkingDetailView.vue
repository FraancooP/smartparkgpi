<template>
  <div class="h-full">
    <!-- Header con navegación -->
    <div class="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button class="flex items-center text-gray-600 hover:text-gray-800" @click="$router.back()">
              <ChevronLeft class="w-5 h-5 mr-1" />
              <span class="text-sm font-medium">Volver al Dashboard</span>
            </button>
          </div>
          <div class="flex items-center space-x-3">
            <Button @click="showEditDialog = true" variant="outline" class="flex items-center">
              <Edit2 class="w-4 h-4 mr-2" />
              Editar Información
            </Button>
            <Button @click="showDeleteDialog = true" variant="destructive" class="flex items-center">
              <Trash2 class="w-4 h-4 mr-2" />
              Eliminar Estacionamiento
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Información del estacionamiento -->
    <div class="bg-gray-100 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ parking.name }}</h1>
        <p class="mt-1 text-sm text-gray-600">{{ parking.location }}</p>
      </div>
    </div>

    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card class="bg-gradient-to-r from-[hsl(var(--info))] to-[hsl(var(--info)_/_0.8)] text-white">
          <CardContent class="flex items-center justify-between p-6">
            <div>
              <p class="text-sm font-medium text-white/90">Plazas Ocupadas</p>
              <h3 class="text-2xl font-bold mt-2">{{ parking.occupiedSpaces }}/{{ parking.spaces }}</h3>
            </div>
            <div class="bg-white/20 p-3 rounded-lg">
              <Car class="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card class="bg-gradient-to-r from-[hsl(var(--success))] to-[hsl(var(--success)_/_0.8)] text-white">
          <CardContent class="flex items-center justify-between p-6">
            <div>
              <p class="text-sm font-medium text-white/90">Tasa de Ocupación</p>
              <h3 class="text-2xl font-bold mt-2">{{ Math.round((parking.occupiedSpaces / parking.spaces) * 100) }}%</h3>
            </div>
            <div class="bg-white/20 p-3 rounded-lg">
              <TrendingUp class="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card class="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary)_/_0.8)] text-white">
          <CardContent class="flex items-center justify-between p-6">
            <div>
              <p class="text-sm font-medium text-white/90">Ingresos del Mes</p>
              <h3 class="text-2xl font-bold mt-2">{{ formatCurrency(parking.revenue) }}</h3>
            </div>
            <div class="bg-white/20 p-3 rounded-lg">
              <DollarSign class="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card class="bg-gradient-to-r from-[hsl(var(--warning))] to-[hsl(var(--warning)_/_0.8)] text-white">
          <CardContent class="flex items-center justify-between p-6">
            <div>
              <p class="text-sm font-medium text-white/90">Empleados</p>
              <h3 class="text-2xl font-bold mt-2">{{ parking.employees }}</h3>
            </div>
            <div class="bg-white/20 p-3 rounded-lg">
              <Users class="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card class="p-6">
          <CardHeader class="px-0 pt-0">
            <CardTitle class="text-lg font-semibold text-gray-900">Ocupación Semanal</CardTitle>
          </CardHeader>
          <CardContent class="px-0 pb-0">
            <div class="h-[300px]">
              <BarChart :data="weeklyOccupancyData" />
            </div>
          </CardContent>
        </Card>

        <Card class="p-6">
          <CardHeader class="px-0 pt-0">
            <CardTitle class="text-lg font-semibold text-gray-900">Distribución por Tipo</CardTitle>
          </CardHeader>
          <CardContent class="px-0 pb-0">
            <div class="h-[300px]">
              <PieChart :data="occupancyTypeData" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card class="p-6 mb-8">
        <CardHeader class="px-0 pt-0">
          <CardTitle class="text-lg font-semibold text-gray-900">Ingresos Mensuales</CardTitle>
        </CardHeader>
        <CardContent class="px-0 pb-0">
          <div class="h-[300px]">
            <LineChart :data="monthlyRevenueData" />
          </div>
        </CardContent>
      </Card>

      <Tabs class="col-span-2" defaultValue="statistics">
        <TabsList>
          <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
          <TabsTrigger value="spaces">Espacios</TabsTrigger>
          <TabsTrigger value="employees">Empleados</TabsTrigger>
        </TabsList>

        <TabsContent value="statistics">
          <div class="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ocupación por Hora</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart :data="hourlyOccupancy" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ingresos por Día</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart :data="dailyRevenue" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="spaces">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between">
              <CardTitle>Gestión de Espacios</CardTitle>
              <Button @click="showSpacesDialog = true">
                <i class="fas fa-plus mr-2"></i> Agregar Espacio
              </Button>
            </CardHeader>
            <CardContent>
              <!-- Tabla de espacios -->
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between">
              <CardTitle>Gestión de Empleados</CardTitle>
              <Button @click="showEmployeesDialog = true">
                <i class="fas fa-plus mr-2"></i> Agregar Empleado
              </Button>
            </CardHeader>
            <CardContent>
              <!-- Tabla de empleados -->
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>

    <EditParkingInfoDialog
      v-if="showEditDialog"
      :parking="parking"
      @close="showEditDialog = false"
      @update="updateParking"
    />

    <ManageEmployeesDialog
      v-if="showEmployeesDialog"
      :parking-id="parking.id"
      @close="showEmployeesDialog = false"
    />

    <ManageSpacesDialog
      v-if="showSpacesDialog"
      :parking-id="parking.id"
      @close="showSpacesDialog = false"
    />

    <DeleteParkingDialog
      v-if="showDeleteDialog"
      :parking-id="parking.id"
      @close="showDeleteDialog = false"
      @delete="deleteParking"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Car, TrendingUp, DollarSign, Users, ChevronLeft, Edit2, Trash2 } from 'lucide-vue-next'
import Card from '../ui/Card.vue'
import CardHeader from '../ui/CardHeader.vue'
import CardTitle from '../ui/CardTitle.vue'
import CardContent from '../ui/CardContent.vue'
import Button from '../ui/Button.vue'
import Tabs from '../ui/Tabs.vue'
import TabsList from '../ui/TabsList.vue'
import TabsTrigger from '../ui/TabsTrigger.vue'
import TabsContent from '../ui/TabsContent.vue'
import LineChart from '../ui/LineChart.vue'
import BarChart from '../ui/BarChart.vue'
import PieChart from '../ui/PieChart.vue'

import EditParkingInfoDialog from './EditParkingInfoDialog.vue'
import ManageEmployeesDialog from './ManageEmployeesDialog.vue'
import ManageSpacesDialog from './ManageSpacesDialog.vue'
import DeleteParkingDialog from './DeleteParkingDialog.vue'

export default {
  name: 'ParkingDetailView',
  
  components: {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    LineChart,
    BarChart,
    PieChart,
    EditParkingInfoDialog,
    ManageEmployeesDialog,
    ManageSpacesDialog,
    DeleteParkingDialog,
  },

  setup() {
    const parking = ref({
      id: '1',
      name: 'Estacionamiento Centro',
      image: '/parking-image.jpg',
      location: 'Av. Corrientes 1234, CABA',
      spaces: 120,
      occupiedSpaces: 98,
      employees: 4,
      revenue: 67000,
    });

    const weeklyOccupancyData = ref({
      labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
      datasets: [
        {
          label: 'Ocupación',
          data: [65, 80, 75, 90, 95, 40, 35],
          backgroundColor: '#3b82f6',
        }
      ]
    });

    const occupancyTypeData = ref({
      labels: ['Autos', 'Motos'],
      datasets: [
        {
          data: [70, 30],
          backgroundColor: ['#3b82f6', '#22c55e'],
        }
      ]
    });

    const monthlyRevenueData = ref({
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Ingresos Mensuales',
          data: [45000, 48000, 52000, 49000, 67000, 65000],
          borderColor: '#8b5cf6',
          tension: 0.3,
          fill: false
        }
      ]
    });

    const showEditDialog = ref(false);
    const showEmployeesDialog = ref(false);
    const showSpacesDialog = ref(false);
    const showDeleteDialog = ref(false);
    
    const hourlyOccupancy = ref([]);
    const dailyRevenue = ref([]);

    onMounted(() => {
      hourlyOccupancy.value = [
        { hour: '08:00', value: 10 },
        { hour: '09:00', value: 15 },
        { hour: '10:00', value: 20 },
        { hour: '11:00', value: 25 },
        { hour: '12:00', value: 30 },
      ];

      dailyRevenue.value = [
        { day: 'Lunes', value: 5000 },
        { day: 'Martes', value: 6000 },
        { day: 'Miércoles', value: 4500 },
        { day: 'Jueves', value: 7000 },
        { day: 'Viernes', value: 8000 },
      ];
    });

    const updateParking = (updatedData) => {
      Object.assign(parking.value, updatedData);
      showEditDialog.value = false;
    };

    const deleteParking = () => {
      showDeleteDialog.value = false;
      // Implementar redirección o eliminación aquí
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
      }).format(value);
    };

    return {
      parking,
      weeklyOccupancyData,
      occupancyTypeData,
      monthlyRevenueData,
      showEditDialog,
      showEmployeesDialog,
      showSpacesDialog,
      showDeleteDialog,
      updateParking,
      deleteParking,
      formatCurrency,
      hourlyOccupancy,
      dailyRevenue,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>

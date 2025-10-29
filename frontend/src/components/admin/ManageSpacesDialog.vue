<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-4xl">
      <h2 class="text-xl font-bold mb-4">Gestión de Espacios</h2>

      <div class="mb-6">
        <Button @click="showAddForm = true" v-if="!showAddForm">
          <i class="fas fa-plus mr-2"></i> Agregar Espacio
        </Button>

        <form v-if="showAddForm" @submit.prevent="handleAddSpace" class="border p-4 rounded-lg mb-4">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium mb-1">Número/Identificador</label>
              <input
                v-model="newSpace.identifier"
                type="text"
                class="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Tipo</label>
              <select
                v-model="newSpace.type"
                class="w-full p-2 border rounded"
                required
              >
                <option value="car">Auto</option>
                <option value="motorcycle">Moto</option>
                <option value="disabled">Discapacitados</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Estado</label>
              <select
                v-model="newSpace.status"
                class="w-full p-2 border rounded"
                required
              >
                <option value="available">Disponible</option>
                <option value="occupied">Ocupado</option>
                <option value="maintenance">En Mantenimiento</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Ubicación/Sector</label>
              <input
                v-model="newSpace.sector"
                type="text"
                class="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <Button variant="outline" type="button" @click="showAddForm = false">
              Cancelar
            </Button>
            <Button type="submit">
              Agregar
            </Button>
          </div>
        </form>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-3 text-left">Número/ID</th>
              <th class="p-3 text-left">Tipo</th>
              <th class="p-3 text-left">Estado</th>
              <th class="p-3 text-left">Sector</th>
              <th class="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="space in spaces" :key="space.id" class="border-b">
              <td class="p-3">{{ space.identifier }}</td>
              <td class="p-3">{{ formatType(space.type) }}</td>
              <td class="p-3">
                <Badge :variant="getStatusVariant(space.status)">
                  {{ formatStatus(space.status) }}
                </Badge>
              </td>
              <td class="p-3">{{ space.sector }}</td>
              <td class="p-3">
                <div class="flex space-x-2">
                  <Button variant="outline" size="sm" @click="editSpace(space)">
                    <i class="fas fa-edit"></i>
                  </Button>
                  <Button variant="destructive" size="sm" @click="deleteSpace(space.id)">
                    <i class="fas fa-trash"></i>
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 flex justify-end">
        <Button variant="outline" @click="$emit('close')">
          Cerrar
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Button from '../ui/Button.vue';
import Badge from '../ui/Badge.vue';

export default {
  name: 'ManageSpacesDialog',
  
  components: {
    Button,
    Badge,
  },

  props: {
    parkingId: {
      type: String,
      required: true,
    },
  },

  emits: ['close'],

  setup(props) {
    const spaces = ref([]);
    const showAddForm = ref(false);
    const newSpace = ref({
      identifier: '',
      type: 'car',
      status: 'available',
      sector: '',
    });

    const loadSpaces = async () => {
      try {
        // Aquí implementaremos la llamada a la API
        // const response = await fetch(`/api/parkings/${props.parkingId}/spaces`);
        // spaces.value = await response.json();
      } catch (error) {
        console.error('Error al cargar espacios:', error);
      }
    };

    const handleAddSpace = async () => {
      try {
        // Aquí implementaremos la llamada a la API
        // const response = await fetch(`/api/parkings/${props.parkingId}/spaces`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(newSpace.value),
        // });
        // const addedSpace = await response.json();
        // spaces.value.push(addedSpace);
        
        showAddForm.value = false;
        newSpace.value = {
          identifier: '',
          type: 'car',
          status: 'available',
          sector: '',
        };
      } catch (error) {
        console.error('Error al agregar espacio:', error);
      }
    };

    const editSpace = (space) => {
      // Implementar edición
    };

    const deleteSpace = async (spaceId) => {
      if (!confirm('¿Está seguro de eliminar este espacio?')) return;

      try {
        // Aquí implementaremos la llamada a la API
        // await fetch(`/api/parkings/${props.parkingId}/spaces/${spaceId}`, {
        //   method: 'DELETE',
        // });
        spaces.value = spaces.value.filter(s => s.id !== spaceId);
      } catch (error) {
        console.error('Error al eliminar espacio:', error);
      }
    };

    const formatType = (type) => {
      const types = {
        car: 'Auto',
        motorcycle: 'Moto',
        disabled: 'Discapacitados',
      };
      return types[type] || type;
    };

    const formatStatus = (status) => {
      const statuses = {
        available: 'Disponible',
        occupied: 'Ocupado',
        maintenance: 'En Mantenimiento',
      };
      return statuses[status] || status;
    };

    const getStatusVariant = (status) => {
      const variants = {
        available: 'success',
        occupied: 'warning',
        maintenance: 'destructive',
      };
      return variants[status] || 'default';
    };

    onMounted(loadSpaces);

    return {
      spaces,
      showAddForm,
      newSpace,
      handleAddSpace,
      editSpace,
      deleteSpace,
      formatType,
      formatStatus,
      getStatusVariant,
    };
  },
};
</script>
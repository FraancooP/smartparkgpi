<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-4xl">
      <h2 class="text-xl font-bold mb-4">Gestión de Empleados</h2>

      <div class="mb-6">
        <Button @click="showAddForm = true" v-if="!showAddForm">
          <i class="fas fa-plus mr-2"></i> Agregar Empleado
        </Button>

        <form v-if="showAddForm" @submit.prevent="handleAddEmployee" class="border p-4 rounded-lg mb-4">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nombre</label>
              <input
                v-model="newEmployee.name"
                type="text"
                class="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <input
                v-model="newEmployee.email"
                type="email"
                class="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Teléfono</label>
              <input
                v-model="newEmployee.phone"
                type="tel"
                class="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Rol</label>
              <select
                v-model="newEmployee.role"
                class="w-full p-2 border rounded"
                required
              >
                <option value="attendant">Atendente</option>
                <option value="supervisor">Supervisor</option>
                <option value="manager">Gerente</option>
              </select>
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
              <th class="p-3 text-left">Nombre</th>
              <th class="p-3 text-left">Email</th>
              <th class="p-3 text-left">Teléfono</th>
              <th class="p-3 text-left">Rol</th>
              <th class="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.id" class="border-b">
              <td class="p-3">{{ employee.name }}</td>
              <td class="p-3">{{ employee.email }}</td>
              <td class="p-3">{{ employee.phone }}</td>
              <td class="p-3">{{ formatRole(employee.role) }}</td>
              <td class="p-3">
                <div class="flex space-x-2">
                  <Button variant="outline" size="sm" @click="editEmployee(employee)">
                    <i class="fas fa-edit"></i>
                  </Button>
                  <Button variant="destructive" size="sm" @click="deleteEmployee(employee.id)">
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

export default {
  name: 'ManageEmployeesDialog',
  
  components: {
    Button,
  },

  props: {
    parkingId: {
      type: String,
      required: true,
    },
  },

  emits: ['close'],

  setup(props) {
    const employees = ref([]);
    const showAddForm = ref(false);
    const newEmployee = ref({
      name: '',
      email: '',
      phone: '',
      role: 'attendant',
    });

    const loadEmployees = async () => {
      try {
        // Aquí implementaremos la llamada a la API
        // const response = await fetch(`/api/parkings/${props.parkingId}/employees`);
        // employees.value = await response.json();
      } catch (error) {
        console.error('Error al cargar empleados:', error);
      }
    };

    const handleAddEmployee = async () => {
      try {
        // Aquí implementaremos la llamada a la API
        // const response = await fetch(`/api/parkings/${props.parkingId}/employees`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(newEmployee.value),
        // });
        // const addedEmployee = await response.json();
        // employees.value.push(addedEmployee);
        
        showAddForm.value = false;
        newEmployee.value = {
          name: '',
          email: '',
          phone: '',
          role: 'attendant',
        };
      } catch (error) {
        console.error('Error al agregar empleado:', error);
      }
    };

    const editEmployee = (employee) => {
      // Implementar edición
    };

    const deleteEmployee = async (employeeId) => {
      if (!confirm('¿Está seguro de eliminar este empleado?')) return;

      try {
        // Aquí implementaremos la llamada a la API
        // await fetch(`/api/parkings/${props.parkingId}/employees/${employeeId}`, {
        //   method: 'DELETE',
        // });
        employees.value = employees.value.filter(e => e.id !== employeeId);
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
      }
    };

    const formatRole = (role) => {
      const roles = {
        attendant: 'Atendente',
        supervisor: 'Supervisor',
        manager: 'Gerente',
      };
      return roles[role] || role;
    };

    onMounted(loadEmployees);

    return {
      employees,
      showAddForm,
      newEmployee,
      handleAddEmployee,
      editEmployee,
      deleteEmployee,
      formatRole,
    };
  },
};
</script>
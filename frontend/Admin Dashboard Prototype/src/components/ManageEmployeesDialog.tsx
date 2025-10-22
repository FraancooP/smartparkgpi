import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Plus, Trash2, Eye, EyeOff, User, Mail, Phone } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Employee {
  id: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  name: string;
  active: boolean;
  showPassword: boolean;
}

interface ManageEmployeesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parkingId: string;
}

export function ManageEmployeesDialog({ 
  open, 
  onOpenChange, 
  parkingId 
}: ManageEmployeesDialogProps) {
  // Datos simulados de empleados
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      username: 'jperez',
      password: 'pass123',
      email: 'juan.perez@email.com',
      phone: '+54 11 1234-5678',
      name: 'Juan Pérez',
      active: true,
      showPassword: false
    },
    {
      id: '2',
      username: 'mgonzalez',
      password: 'secure456',
      email: 'maria.gonzalez@email.com',
      phone: '+54 11 8765-4321',
      name: 'María González',
      active: true,
      showPassword: false
    },
    {
      id: '3',
      username: 'crodriguez',
      password: 'mypass789',
      email: 'carlos.rodriguez@email.com',
      phone: '+54 11 5555-6666',
      name: 'Carlos Rodríguez',
      active: false,
      showPassword: false
    }
  ]);

  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id' | 'showPassword'>>({
    username: '',
    password: '',
    email: '',
    phone: '',
    name: '',
    active: true
  });

  const [showNewEmployeeForm, setShowNewEmployeeForm] = useState(false);

  const addEmployee = () => {
    if (!newEmployee.username || !newEmployee.password || !newEmployee.name) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    const employee: Employee = {
      ...newEmployee,
      id: Date.now().toString(),
      showPassword: false
    };

    setEmployees(prev => [...prev, employee]);
    setNewEmployee({
      username: '',
      password: '',
      email: '',
      phone: '',
      name: '',
      active: true
    });
    setShowNewEmployeeForm(false);

    toast.success("Empleado agregado correctamente", {
      description: `${employee.name} ha sido añadido al equipo.`
    });
  };

  const removeEmployee = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    
    toast.success("Empleado eliminado", {
      description: `${employee?.name} ha sido removido del equipo.`
    });
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, active: !emp.active } : emp
    ));
    
    const employee = employees.find(emp => emp.id === id);
    const newStatus = !employee?.active;
    
    toast.success(`Empleado ${newStatus ? 'activado' : 'desactivado'}`, {
      description: `${employee?.name} ahora está ${newStatus ? 'activo' : 'inactivo'}.`
    });
  };

  const togglePasswordVisibility = (id: string) => {
    setEmployees(prev => prev.map(emp =>
      emp.id === id ? { ...emp, showPassword: !emp.showPassword } : emp
    ));
  };

  const activeEmployees = employees.filter(emp => emp.active).length;
  const inactiveEmployees = employees.filter(emp => !emp.active).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-800 flex items-center gap-2">
            <User className="w-6 h-6 text-purple-600" />
            Gestión de Empleados
          </DialogTitle>
          <DialogDescription>
            Administra los empleados del estacionamiento, agrega nuevos usuarios y gestiona sus credenciales.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl text-blue-600">{employees.length}</div>
              <p className="text-sm text-blue-700">Total Empleados</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl text-green-600">{activeEmployees}</div>
              <p className="text-sm text-green-700">Activos</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl text-red-600">{inactiveEmployees}</div>
              <p className="text-sm text-red-700">Inactivos</p>
            </div>
          </div>

          <Separator />

          {/* Botón para agregar empleado */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg text-slate-800">Lista de Empleados</h3>
            <Button
              onClick={() => setShowNewEmployeeForm(!showNewEmployeeForm)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Empleado
            </Button>
          </div>

          {/* Formulario para nuevo empleado */}
          {showNewEmployeeForm && (
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-6 space-y-4">
                <h4 className="text-purple-800">Nuevo Empleado</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-name">Nombre Completo *</Label>
                    <Input
                      id="new-name"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Juan Pérez"
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-username">Usuario *</Label>
                    <Input
                      id="new-username"
                      value={newEmployee.username}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="jperez"
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Contraseña *</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newEmployee.password}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-email">Email</Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="juan.perez@email.com"
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="new-phone">Teléfono</Label>
                    <Input
                      id="new-phone"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+54 11 1234-5678"
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={addEmployee}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Agregar Empleado
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewEmployeeForm(false)}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de empleados existentes */}
          <div className="space-y-4">
            {employees.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No hay empleados registrados
              </div>
            ) : (
              employees.map((employee) => (
                <Card key={employee.id} className={`border-2 ${employee.active ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-slate-800">{employee.name}</h4>
                            <Badge variant={employee.active ? "default" : "secondary"}>
                              {employee.active ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600">@{employee.username}</p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Mail className="w-3 h-3" />
                            {employee.email || "No especificado"}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Phone className="w-3 h-3" />
                            {employee.phone || "No especificado"}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-500">Contraseña</Label>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-slate-100 px-2 py-1 rounded">
                              {employee.showPassword ? employee.password : "••••••••"}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-auto"
                              onClick={() => togglePasswordVisibility(employee.id)}
                            >
                              {employee.showPassword ? (
                                <EyeOff className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleEmployeeStatus(employee.id)}
                            className={employee.active ? "border-red-200 text-red-700 hover:bg-red-50" : "border-green-200 text-green-700 hover:bg-green-50"}
                          >
                            {employee.active ? "Desactivar" : "Activar"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeEmployee(employee.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Botón de cerrar */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
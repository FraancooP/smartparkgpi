import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Plus, Trash2, Upload, Eye, EyeOff } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Employee {
  id: string;
  username: string;
  password: string;
  showPassword: boolean;
}

interface ParkingData {
  name: string;
  location: string;
  spaces: string;
  license: string;
  images: string[];
  paymentMethod: string;
  mercadoPagoData: {
    email: string;
    accessToken: string;
    publicKey: string;
  };
  rates: {
    moto: string;
    auto: string;
  };
  employees: Employee[];
}

interface ParkingRegistrationFormProps {
  onSubmit: (data: ParkingData) => void;
  onCancel: () => void;
}

export function ParkingRegistrationForm({ onSubmit, onCancel }: ParkingRegistrationFormProps) {
  const [formData, setFormData] = useState<ParkingData>({
    name: '',
    location: '',
    spaces: '',
    license: '',
    images: [],
    paymentMethod: '',
    mercadoPagoData: {
      email: '',
      accessToken: '',
      publicKey: ''
    },
    rates: {
      moto: '',
      auto: ''
    },
    employees: []
  });

  const addEmployee = () => {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      username: '',
      password: '',
      showPassword: false
    };
    setFormData(prev => ({
      ...prev,
      employees: [...prev.employees, newEmployee]
    }));
  };

  const removeEmployee = (id: string) => {
    setFormData(prev => ({
      ...prev,
      employees: prev.employees.filter(emp => emp.id !== id)
    }));
  };

  const updateEmployee = (id: string, field: keyof Employee, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      employees: prev.employees.map(emp =>
        emp.id === id ? { ...emp, [field]: value } : emp
      )
    }));
  };

  const togglePasswordVisibility = (id: string) => {
    setFormData(prev => ({
      ...prev,
      employees: prev.employees.map(emp =>
        emp.id === id ? { ...emp, showPassword: !emp.showPassword } : emp
      )
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // En un caso real, aquí subirías las imágenes a un servidor
      // Por ahora simulamos URLs
      const newImages = Array.from(files).map((file, index) => 
        `https://images.unsplash.com/photo-1558457738-f199ff9dbf82?w=400&h=300&fit=crop&auto=format&q=80&${index}`
      );
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 5) // Máximo 5 imágenes
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      <Card className="shadow-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
          <CardTitle className="text-center text-2xl">Registrar Nuevo Estacionamiento</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información Básica */}
            <div className="space-y-6">
              <h3 className="text-lg text-blue-800 border-b border-blue-200 pb-2">Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Estacionamiento</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Estacionamiento Centro"
                    className="border-blue-200 focus:border-blue-400"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="license">Matrícula</Label>
                  <Input
                    id="license"
                    value={formData.license}
                    onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))}
                    placeholder="Ej: EST-2024-001"
                    className="border-blue-200 focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Textarea
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Dirección completa del estacionamiento"
                  className="border-blue-200 focus:border-blue-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spaces">Cantidad de Plazas</Label>
                <Input
                  id="spaces"
                  type="number"
                  value={formData.spaces}
                  onChange={(e) => setFormData(prev => ({ ...prev, spaces: e.target.value }))}
                  placeholder="Ej: 50"
                  className="border-blue-200 focus:border-blue-400"
                  required
                />
              </div>
            </div>

            <Separator className="bg-blue-200" />

            {/* Imágenes */}
            <div className="space-y-6">
              <h3 className="text-lg text-blue-800 border-b border-blue-200 pb-2">Imágenes (mínimo 3)</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Imágenes
                  </Button>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer text-sm text-blue-600">
                    Seleccionar archivos
                  </label>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <ImageWithFallback
                          src={image}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-green-200"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-blue-200" />

            {/* Métodos de Pago */}
            <div className="space-y-6">
              <h3 className="text-lg text-blue-800 border-b border-blue-200 pb-2">Métodos de Pago</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Método de Pago</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Seleccionar método de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                      <SelectItem value="otros" disabled>Otros métodos (Próximamente)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.paymentMethod === 'mercadopago' && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-base text-blue-800">Datos de Mercado Pago</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="mp-email">Email de la cuenta</Label>
                        <Input
                          id="mp-email"
                          type="email"
                          value={formData.mercadoPagoData.email}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            mercadoPagoData: { ...prev.mercadoPagoData, email: e.target.value }
                          }))}
                          placeholder="email@mercadopago.com"
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mp-access-token">Access Token</Label>
                        <Input
                          id="mp-access-token"
                          value={formData.mercadoPagoData.accessToken}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            mercadoPagoData: { ...prev.mercadoPagoData, accessToken: e.target.value }
                          }))}
                          placeholder="APP_USR-..."
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mp-public-key">Public Key</Label>
                        <Input
                          id="mp-public-key"
                          value={formData.mercadoPagoData.publicKey}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            mercadoPagoData: { ...prev.mercadoPagoData, publicKey: e.target.value }
                          }))}
                          placeholder="APP_USR-..."
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <Separator className="bg-blue-200" />

            {/* Tarifas */}
            <div className="space-y-6">
              <h3 className="text-lg text-blue-800 border-b border-blue-200 pb-2">Tarifas por Hora</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="rate-moto">Tarifa Moto (por hora)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-green-600">$</span>
                    <Input
                      id="rate-moto"
                      type="number"
                      step="0.01"
                      value={formData.rates.moto}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rates: { ...prev.rates, moto: e.target.value }
                      }))}
                      placeholder="0.00"
                      className="pl-8 border-green-200 focus:border-green-400"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rate-auto">Tarifa Auto (por hora)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-green-600">$</span>
                    <Input
                      id="rate-auto"
                      type="number"
                      step="0.01"
                      value={formData.rates.auto}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rates: { ...prev.rates, auto: e.target.value }
                      }))}
                      placeholder="0.00"
                      className="pl-8 border-green-200 focus:border-green-400"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-blue-200" />

            {/* Empleados */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg text-blue-800 border-b border-blue-200 pb-2">Empleados</h3>
                <Button
                  type="button"
                  onClick={addEmployee}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Empleado
                </Button>
              </div>

              {formData.employees.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay empleados agregados</p>
              ) : (
                <div className="space-y-4">
                  {formData.employees.map((employee) => (
                    <Card key={employee.id} className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Nombre de Usuario</Label>
                              <Input
                                value={employee.username}
                                onChange={(e) => updateEmployee(employee.id, 'username', e.target.value)}
                                placeholder="usuario123"
                                className="border-green-200 focus:border-green-400"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Contraseña</Label>
                              <div className="relative">
                                <Input
                                  type={employee.showPassword ? "text" : "password"}
                                  value={employee.password}
                                  onChange={(e) => updateEmployee(employee.id, 'password', e.target.value)}
                                  placeholder="••••••••"
                                  className="pr-12 border-green-200 focus:border-green-400"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto"
                                  onClick={() => togglePasswordVisibility(employee.id)}
                                >
                                  {employee.showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeEmployee(employee.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                Registrar Estacionamiento
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
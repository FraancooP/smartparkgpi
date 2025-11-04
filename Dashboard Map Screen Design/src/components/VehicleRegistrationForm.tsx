import { useState } from 'react';
import { Car, Bike, ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';

interface VehicleRegistrationFormProps {
  vehicleType: 'auto' | 'moto';
  onCancel: () => void;
  onRegister: (vehicleData: {
    name: string;
    plate: string;
    model: string;
    image?: string;
  }) => void;
}

export function VehicleRegistrationForm({ 
  vehicleType, 
  onCancel, 
  onRegister 
}: VehicleRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    plate: '',
    model: '',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.plate && formData.model) {
      onRegister(formData);
    }
  };

  const isFormValid = formData.name && formData.plate && formData.model;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className={`bg-gradient-to-r ${
        vehicleType === 'auto' 
          ? 'from-blue-500 to-blue-600' 
          : 'from-green-500 to-green-600'
      } text-white p-6 pb-8`}>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-white hover:bg-white/20 rounded-lg px-3 py-2 flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
          <h1 className="text-xl font-semibold">
            Registrar {vehicleType === 'auto' ? 'Auto' : 'Moto'}
          </h1>
          <div className="w-20"></div> {/* Spacer para centrar el título */}
        </div>
      </div>

      {/* Formulario */}
      <div className="p-6 -mt-4">
        <Card className="p-6 bg-gradient-to-br from-muted/30 to-muted/10 border-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Ícono del vehículo */}
            <div className="flex justify-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                vehicleType === 'auto' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {vehicleType === 'auto' ? (
                  <Car className={`h-8 w-8 ${
                    vehicleType === 'auto' ? 'text-blue-600' : 'text-green-600'
                  }`} />
                ) : (
                  <Bike className={`h-8 w-8 ${
                    vehicleType === 'auto' ? 'text-blue-600' : 'text-green-600'
                  }`} />
                )}
              </div>
            </div>

            {/* Campo Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del {vehicleType === 'auto' ? 'auto' : 'moto'}</Label>
              <Input
                id="name"
                type="text"
                placeholder={`Ej: Mi ${vehicleType === 'auto' ? 'Auto' : 'Moto'}`}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="h-12"
                required
              />
            </div>

            {/* Campo Patente */}
            <div className="space-y-2">
              <Label htmlFor="plate">Patente</Label>
              <Input
                id="plate"
                type="text"
                placeholder="ABC 123"
                value={formData.plate}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  plate: e.target.value.toUpperCase() 
                }))}
                className="h-12 font-mono"
                required
              />
            </div>

            {/* Campo Modelo */}
            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                type="text"
                placeholder={vehicleType === 'auto' ? 'Ej: Toyota Corolla 2020' : 'Ej: Honda Wave 110'}
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                className="h-12"
                required
              />
            </div>

            {/* Campo Imagen (Opcional) */}
            <div className="space-y-3">
              <Label>Imagen (Opcional)</Label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8">
                  <div className="text-center space-y-3">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Subí una foto de tu {vehicleType === 'auto' ? 'auto' : 'moto'}
                      </p>
                      <label htmlFor="image" className="cursor-pointer">
                        <span className={`text-sm font-medium ${
                          vehicleType === 'auto' ? 'text-blue-600' : 'text-green-600'
                        } hover:underline`}>
                          Seleccionar archivo
                        </span>
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl border-2"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={removeImage}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex flex-col space-y-3 pt-4">
              <Button
                type="submit"
                disabled={!isFormValid}
                className={`h-14 text-white ${
                  vehicleType === 'auto'
                    ? 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300'
                    : 'bg-green-500 hover:bg-green-600 disabled:bg-green-300'
                } rounded-xl transition-all duration-200`}
              >
                Registrar {vehicleType === 'auto' ? 'Auto' : 'Moto'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="h-12 rounded-xl border-2"
              >
                Cancelar
              </Button>
            </div>

          </form>
        </Card>

        {/* Información adicional */}
        <div className={`mt-6 p-4 rounded-xl border-2 ${
          vehicleType === 'auto' 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-green-50 border-green-200'
        }`}>
          <h3 className={`font-medium ${
            vehicleType === 'auto' ? 'text-blue-800' : 'text-green-800'
          }`}>
            Consejos para registrar tu {vehicleType === 'auto' ? 'auto' : 'moto'}
          </h3>
          <ul className={`text-sm mt-2 space-y-1 ${
            vehicleType === 'auto' ? 'text-blue-700' : 'text-green-700'
          }`}>
            <li>• Usá un nombre que te ayude a identificar el vehículo</li>
            <li>• Verificá que la patente esté correcta</li>
            <li>• La imagen te ayudará a identificar tu vehículo más fácil</li>
            <li>• Todos los datos pueden modificarse después</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
import { Car, Bike, Plus, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useState } from 'react';
import { VehicleRegistrationForm } from './VehicleRegistrationForm';

interface Vehicle {
  id: string;
  type: 'auto' | 'moto';
  name: string;
  plate: string;
  model: string;
  image?: string;
}

interface VehicleManagementProps {
  onClose: () => void;
}

export function VehicleManagement({ onClose }: VehicleManagementProps) {
  // Datos simulados de vehículos registrados
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: '1', type: 'auto', name: 'Mi Auto', plate: 'ABC 123', model: 'Toyota Corolla 2020' },
    { id: '2', type: 'auto', name: 'Auto Familiar', plate: 'XYZ 789', model: 'Honda Civic 2019' },
    { id: '3', type: 'moto', name: 'Mi Moto', plate: 'MOT 456', model: 'Honda Wave 110' },
    { id: '4', type: 'auto', name: 'Auto Trabajo', plate: 'DEF 456', model: 'Ford Focus 2021' }
  ]);

  const [selectedFilter, setSelectedFilter] = useState<'auto' | 'moto'>('auto');
  const [showRegistrationForm, setShowRegistrationForm] = useState<'auto' | 'moto' | null>(null);
  const filteredVehicles = vehicles.filter(v => v.type === selectedFilter);

  const handleRegisterVehicle = (vehicleData: {
    name: string;
    plate: string;
    model: string;
    image?: string;
  }) => {
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      type: showRegistrationForm!,
      ...vehicleData
    };
    
    setVehicles(prev => [...prev, newVehicle]);
    setShowRegistrationForm(null);
    
    // Cambiar al filtro del vehículo recién registrado
    setSelectedFilter(showRegistrationForm!);
  };

  const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => (
    <Card className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 border-2 hover:border-primary/30 transition-all duration-200 hover:shadow-md min-w-40 max-w-48">
      <div className="space-y-3">
        {/* Imagen del vehículo si existe */}
        {vehicle.image && (
          <div className="w-full h-24 rounded-lg overflow-hidden">
            <img 
              src={vehicle.image} 
              alt={vehicle.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          {vehicle.type === 'auto' ? (
            <Car className="h-6 w-6 text-primary" />
          ) : (
            <Bike className="h-6 w-6 text-primary" />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-primary/10"
            onClick={() => console.log('Configurar vehículo', vehicle.id)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-1">
          <p className="font-medium">{vehicle.name}</p>
          <p className="text-sm text-muted-foreground font-mono">{vehicle.plate}</p>
          <p className="text-xs text-muted-foreground">{vehicle.model}</p>
        </div>
      </div>
    </Card>
  );

  // Si estamos mostrando el formulario de registro
  if (showRegistrationForm) {
    return (
      <VehicleRegistrationForm
        vehicleType={showRegistrationForm}
        onCancel={() => setShowRegistrationForm(null)}
        onRegister={handleRegisterVehicle}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-white p-6 pb-8">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg px-3 py-2"
          >
            ← Volver
          </Button>
          <h1 className="text-xl font-semibold">Mis Vehículos</h1>
          <div className="w-16"></div> {/* Spacer para centrar el título */}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 space-y-8 -mt-4">
        {/* Filtros centralizados */}
        <div className="flex justify-center">
          <div className="flex bg-muted/50 rounded-2xl p-2 space-x-2">
            <Button
              variant={selectedFilter === 'auto' ? 'default' : 'ghost'}
              className={`h-14 px-8 rounded-xl flex items-center space-x-3 transition-all duration-200 ${
                selectedFilter === 'auto' 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md' 
                  : 'hover:bg-blue-50 text-blue-600'
              }`}
              onClick={() => setSelectedFilter('auto')}
            >
              <Car className="h-6 w-6" />
              <div className="text-left">
                <div className="font-medium">Autos</div>
                <div className="text-xs opacity-80">
                  {vehicles.filter(v => v.type === 'auto').length} registrado{vehicles.filter(v => v.type === 'auto').length !== 1 ? 's' : ''}
                </div>
              </div>
            </Button>
            
            <Button
              variant={selectedFilter === 'moto' ? 'default' : 'ghost'}
              className={`h-14 px-8 rounded-xl flex items-center space-x-3 transition-all duration-200 ${
                selectedFilter === 'moto' 
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-md' 
                  : 'hover:bg-green-50 text-green-600'
              }`}
              onClick={() => setSelectedFilter('moto')}
            >
              <Bike className="h-6 w-6" />
              <div className="text-left">
                <div className="font-medium">Motos</div>
                <div className="text-xs opacity-80">
                  {vehicles.filter(v => v.type === 'moto').length} registrado{vehicles.filter(v => v.type === 'moto').length !== 1 ? 's' : ''}
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Sección de vehículos filtrados */}
        <div className="space-y-6">
          {/* Título de la sección actual */}
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {selectedFilter === 'auto' ? 'Mis Autos' : 'Mis Motos'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredVehicles.length} vehículo{filteredVehicles.length !== 1 ? 's' : ''} registrado{filteredVehicles.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Botón registrar vehículo */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              className={`h-14 px-6 border-2 border-dashed rounded-xl flex items-center space-x-3 transition-all duration-200 ${
                selectedFilter === 'auto' 
                  ? 'border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400' 
                  : 'border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400'
              }`}
              onClick={() => setShowRegistrationForm(selectedFilter)}
            >
              <Plus className="h-5 w-5" />
              <span>Registrar {selectedFilter === 'auto' ? 'un auto' : 'una moto'}</span>
            </Button>
          </div>

          {/* Grid de vehículos */}
          {filteredVehicles.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}

          {/* Mensaje cuando no hay vehículos */}
          {filteredVehicles.length === 0 && (
            <div className="text-center py-8">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                selectedFilter === 'auto' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {selectedFilter === 'auto' ? (
                  <Car className={`h-8 w-8 ${selectedFilter === 'auto' ? 'text-blue-600' : 'text-green-600'}`} />
                ) : (
                  <Bike className={`h-8 w-8 ${selectedFilter === 'auto' ? 'text-blue-600' : 'text-green-600'}`} />
                )}
              </div>
              <h3 className="font-medium mb-2">No tenés {selectedFilter === 'auto' ? 'autos' : 'motos'} registrados</h3>
              <p className="text-sm text-muted-foreground">
                Registrá {selectedFilter === 'auto' ? 'tu primer auto' : 'tu primera moto'} para comenzar a hacer reservas
              </p>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="space-y-2">
            <h3 className="font-medium text-amber-800">Información importante</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Podés registrar hasta 5 vehículos por cuenta</li>
              <li>• Los datos del vehículo son necesarios para las reservas</li>
              <li>• Mantené actualizada la información de tus vehículos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";

interface Parking {
  id: string;
  name: string;
  image: string;
  location: string;
  spaces: number;
  occupiedSpaces: number;
  rates: {
    moto: number;
    auto: number;
  };
  employees: number;
  revenue: number;
}

interface EditParkingInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parking: Parking;
  onSave: (updatedParking: Parking) => void;
}

export function EditParkingInfoDialog({ 
  open, 
  onOpenChange, 
  parking, 
  onSave 
}: EditParkingInfoDialogProps) {
  const [formData, setFormData] = useState({
    name: parking.name,
    location: parking.location,
    rates: {
      moto: parking.rates.moto.toString(),
      auto: parking.rates.auto.toString()
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedParking = {
      ...parking,
      name: formData.name,
      location: formData.location,
      rates: {
        moto: parseFloat(formData.rates.moto),
        auto: parseFloat(formData.rates.auto)
      }
    };

    onSave(updatedParking);
    onOpenChange(false);
    
    toast.success("Información actualizada correctamente", {
      description: "Los cambios han sido guardados exitosamente."
    });
  };

  const handleCancel = () => {
    // Resetear formulario
    setFormData({
      name: parking.name,
      location: parking.location,
      rates: {
        moto: parking.rates.moto.toString(),
        auto: parking.rates.auto.toString()
      }
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-800 flex items-center gap-2">
            Editar Información del Estacionamiento
          </DialogTitle>
          <DialogDescription>
            Modifica la información básica y las tarifas del estacionamiento.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg text-blue-800 border-b border-blue-200 pb-2">
              Información Básica
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Estacionamiento</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="border-blue-200 focus:border-blue-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Textarea
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="border-blue-200 focus:border-blue-400"
                rows={3}
                required
              />
            </div>
          </div>

          <Separator className="bg-blue-200" />

          {/* Tarifas */}
          <div className="space-y-4">
            <h3 className="text-lg text-green-800 border-b border-green-200 pb-2">
              Tarifas por Hora
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rate-moto">Tarifa Moto (por hora)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-green-600">$</span>
                  <Input
                    id="rate-moto"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.rates.moto}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      rates: { ...prev.rates, moto: e.target.value }
                    }))}
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
                    min="0"
                    value={formData.rates.auto}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      rates: { ...prev.rates, auto: e.target.value }
                    }))}
                    className="pl-8 border-green-200 focus:border-green-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Vista previa de ingresos */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-green-800 mb-2">Vista Previa de Ingresos Estimados</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg text-green-600">
                    ${((parseFloat(formData.rates.auto) || 0) * 8 + (parseFloat(formData.rates.moto) || 0) * 8).toLocaleString()}
                  </div>
                  <p className="text-green-700">Por día</p>
                </div>
                <div className="text-center">
                  <div className="text-lg text-green-600">
                    ${(((parseFloat(formData.rates.auto) || 0) * 8 + (parseFloat(formData.rates.moto) || 0) * 8) * 7).toLocaleString()}
                  </div>
                  <p className="text-green-700">Por semana</p>
                </div>
                <div className="text-center">
                  <div className="text-lg text-green-600">
                    ${(((parseFloat(formData.rates.auto) || 0) * 8 + (parseFloat(formData.rates.moto) || 0) * 8) * 30).toLocaleString()}
                  </div>
                  <p className="text-green-700">Por mes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
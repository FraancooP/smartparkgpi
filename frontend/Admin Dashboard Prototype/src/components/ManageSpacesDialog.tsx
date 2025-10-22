import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Slider } from "./ui/slider";
import { Car, Plus, Minus, AlertTriangle } from "lucide-react";
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

interface ManageSpacesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parking: Parking;
  onSave: (updatedParking: Parking) => void;
}

export function ManageSpacesDialog({ 
  open, 
  onOpenChange, 
  parking, 
  onSave 
}: ManageSpacesDialogProps) {
  const [newTotalSpaces, setNewTotalSpaces] = useState(parking.spaces);
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const currentOccupancyRate = Math.round((parking.occupiedSpaces / parking.spaces) * 100);
  const newOccupancyRate = Math.round((parking.occupiedSpaces / newTotalSpaces) * 100);
  const spacesDifference = newTotalSpaces - parking.spaces;
  const newAvailableSpaces = newTotalSpaces - parking.occupiedSpaces;

  const handleSave = () => {
    if (newTotalSpaces < parking.occupiedSpaces) {
      toast.error("Error: No se puede reducir por debajo de las plazas ocupadas", {
        description: `Actualmente hay ${parking.occupiedSpaces} plazas ocupadas. Primero deben liberarse algunas plazas.`
      });
      return;
    }

    if (!adjustmentReason.trim() && spacesDifference !== 0) {
      toast.error("Por favor indica el motivo del ajuste");
      return;
    }

    const updatedParking = {
      ...parking,
      spaces: newTotalSpaces
    };

    onSave(updatedParking);
    onOpenChange(false);

    const changeType = spacesDifference > 0 ? 'aumentado' : 'reducido';
    const changeAmount = Math.abs(spacesDifference);
    
    toast.success(`Plazas ${changeType} correctamente`, {
      description: `Se ${changeType === 'aumentado' ? 'agregaron' : 'removieron'} ${changeAmount} plazas. Nueva capacidad: ${newTotalSpaces} plazas.`
    });
  };

  const handleCancel = () => {
    setNewTotalSpaces(parking.spaces);
    setAdjustmentReason('');
    onOpenChange(false);
  };

  const incrementSpaces = (amount: number) => {
    setNewTotalSpaces(prev => Math.max(parking.occupiedSpaces, prev + amount));
  };

  const handleSliderChange = (value: number[]) => {
    setNewTotalSpaces(Math.max(parking.occupiedSpaces, value[0]));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-800 flex items-center gap-2">
            <Car className="w-6 h-6 text-orange-600" />
            Gestión de Plazas de Estacionamiento
          </DialogTitle>
          <DialogDescription>
            Ajusta el número de plazas disponibles en el estacionamiento y revisa el impacto en la ocupación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado Actual */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-blue-600">{parking.spaces}</div>
                <p className="text-sm text-blue-700">Plazas Actuales</p>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-red-600">{parking.occupiedSpaces}</div>
                <p className="text-sm text-red-700">Ocupadas</p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-green-600">{parking.spaces - parking.occupiedSpaces}</div>
                <p className="text-sm text-green-700">Disponibles</p>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl text-purple-600">{currentOccupancyRate}%</div>
                <p className="text-sm text-purple-700">Ocupación</p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Ajuste de Plazas */}
          <div className="space-y-6">
            <h3 className="text-lg text-orange-800 border-b border-orange-200 pb-2">
              Ajustar Número de Plazas
            </h3>

            {/* Controles de Ajuste */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => incrementSpaces(-10)}
                  disabled={newTotalSpaces - 10 < parking.occupiedSpaces}
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  <Minus className="w-4 h-4 mr-1" />
                  10
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => incrementSpaces(-5)}
                  disabled={newTotalSpaces - 5 < parking.occupiedSpaces}
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  <Minus className="w-4 h-4 mr-1" />
                  5
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => incrementSpaces(-1)}
                  disabled={newTotalSpaces - 1 < parking.occupiedSpaces}
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  <Minus className="w-4 h-4 mr-1" />
                  1
                </Button>

                <div className="flex-1 text-center">
                  <div className="text-2xl text-slate-800">{newTotalSpaces}</div>
                  <p className="text-sm text-slate-600">Nuevas plazas totales</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => incrementSpaces(1)}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  1
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => incrementSpaces(5)}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  5
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => incrementSpaces(10)}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  10
                </Button>
              </div>

              {/* Slider para ajuste fino */}
              <div className="space-y-2">
                <Label>Ajuste fino</Label>
                <Slider
                  value={[newTotalSpaces]}
                  onValueChange={handleSliderChange}
                  min={parking.occupiedSpaces}
                  max={parking.spaces + 100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Mínimo: {parking.occupiedSpaces}</span>
                  <span>Máximo: {parking.spaces + 100}</span>
                </div>
              </div>

              {/* Input directo */}
              <div className="space-y-2">
                <Label htmlFor="direct-input">Número exacto de plazas</Label>
                <Input
                  id="direct-input"
                  type="number"
                  min={parking.occupiedSpaces}
                  value={newTotalSpaces}
                  onChange={(e) => setNewTotalSpaces(Math.max(parking.occupiedSpaces, parseInt(e.target.value) || 0))}
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
            </div>

            {/* Advertencia si se está reduciendo */}
            {newTotalSpaces < parking.spaces && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="text-amber-800 mb-1">Reducción de Plazas</h4>
                    <p className="text-sm text-amber-700">
                      Estás reduciendo el número de plazas de {parking.spaces} a {newTotalSpaces}. 
                      Asegúrate de que esto no afecte la capacidad operativa del estacionamiento.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Motivo del ajuste */}
            {spacesDifference !== 0 && (
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo del ajuste *</Label>
                <Input
                  id="reason"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="Ej: Ampliación del estacionamiento, remodelación, etc."
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Vista Previa del Cambio */}
          <div className="space-y-4">
            <h3 className="text-lg text-slate-800">Vista Previa del Cambio</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <h4 className="text-blue-800 mb-3">Estado Actual</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Plazas totales:</span>
                      <span className="text-blue-600">{parking.spaces}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plazas ocupadas:</span>
                      <span className="text-blue-600">{parking.occupiedSpaces}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plazas disponibles:</span>
                      <span className="text-blue-600">{parking.spaces - parking.occupiedSpaces}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tasa de ocupación:</span>
                      <span className="text-blue-600">{currentOccupancyRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <h4 className="text-green-800 mb-3">Nuevo Estado</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Plazas totales:</span>
                      <span className="text-green-600">{newTotalSpaces}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plazas ocupadas:</span>
                      <span className="text-green-600">{parking.occupiedSpaces}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plazas disponibles:</span>
                      <span className="text-green-600">{newAvailableSpaces}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tasa de ocupación:</span>
                      <span className="text-green-600">{newOccupancyRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumen del cambio */}
            {spacesDifference !== 0 && (
              <Card className={`border-2 ${spacesDifference > 0 ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                <CardContent className="p-4 text-center">
                  <h4 className={`text-lg ${spacesDifference > 0 ? 'text-green-800' : 'text-red-800'}`}>
                    {spacesDifference > 0 ? 'Incremento' : 'Reducción'}: {Math.abs(spacesDifference)} plazas
                  </h4>
                  <p className={`text-sm ${spacesDifference > 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {spacesDifference > 0 
                      ? `Se agregarán ${spacesDifference} plazas adicionales` 
                      : `Se removerán ${Math.abs(spacesDifference)} plazas`
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={spacesDifference !== 0 && !adjustmentReason.trim()}
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              {spacesDifference === 0 ? 'Cerrar' : 'Aplicar Cambios'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
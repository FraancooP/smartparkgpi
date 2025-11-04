import { X, AlertTriangle, Car, CreditCard, Smartphone, Check } from 'lucide-react';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { ReservationConfirmationModal } from './ReservationConfirmationModal';
import { useState } from 'react';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  parkingName: string;
  pricePerHour: number;
}

export function ReservationModal({ isOpen, onClose, onBack, parkingName, pricePerHour }: ReservationModalProps) {
  const [selectedVehicle, setSelectedVehicle] = useState('1');
  const [selectedPayment, setSelectedPayment] = useState('mercadopago');
  const [showConfirmation, setShowConfirmation] = useState(true); // Simular confirmación automática
  const [reservationCode, setReservationCode] = useState('287461953'); // Código de ejemplo

  if (!isOpen) return null;

  // Generar código de reserva de 9 dígitos
  const generateReservationCode = () => {
    return Math.random().toString().slice(2, 11);
  };

  const handleReservation = () => {
    const code = generateReservationCode();
    setReservationCode(code);
    setShowConfirmation(true);
  };

  const vehicles = [
    { id: '1', type: 'Auto', plate: 'ABC 123' },
    { id: '2', type: 'Auto', plate: 'XYZ 789' }
  ];

  const reservationFee = Math.round(pricePerHour * 0.3); // 30% del precio por hora como tarifa de reserva

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay con blur */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary to-primary/90 p-6 text-white">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            onClick={onBack}
            className="absolute top-4 left-4 text-white hover:bg-white/20 rounded-lg px-2 py-1 text-sm"
          >
            ← Volver
          </Button>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Realizar Reserva</h2>
            <p className="text-white/80 text-sm mt-1">{parkingName}</p>
          </div>
        </div>
        
        {/* Contenido */}
        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Alerta de información */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-amber-800">
                  <span className="font-medium">Realizar una reserva implica abonar un monto extra</span> para que se te guarde un cupo. La reserva tiene un tiempo de tolerancia de <span className="font-medium">20 minutos</span>. Incumplido este tiempo, se te descontará un <span className="font-medium">40% del monto total</span>.
                </p>
              </div>
            </div>
          </div>
          
          {/* Seleccionar vehículo */}
          <div className="space-y-3">
            <h3 className="font-medium">Selecciona un vehículo</h3>
            <RadioGroup value={selectedVehicle} onValueChange={setSelectedVehicle}>
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center space-x-3 p-3 border rounded-xl hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={vehicle.id} id={vehicle.id} />
                  <Car className="h-5 w-5 text-muted-foreground" />
                  <Label htmlFor={vehicle.id} className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span>{vehicle.type}</span>
                      <span className="text-sm text-muted-foreground font-mono">{vehicle.plate}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          {/* Seleccionar método de pago */}
          <div className="space-y-3">
            <h3 className="font-medium">Selecciona método de pago</h3>
            <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
              <div className="flex items-center space-x-3 p-3 border rounded-xl hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="mercadopago" id="mercadopago" />
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <Smartphone className="h-4 w-4 text-white" />
                  </div>
                  <Label htmlFor="mercadopago" className="cursor-pointer flex-1">
                    <div>
                      <div className="font-medium">Mercado Pago</div>
                      <div className="text-xs text-muted-foreground">Tarjeta virtual</div>
                    </div>
                  </Label>
                  {selectedPayment === 'mercadopago' && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-xl hover:bg-muted/50 transition-colors opacity-50">
                <RadioGroupItem value="creditcard" id="creditcard" disabled />
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-8 h-8 bg-gray-400 rounded flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <Label htmlFor="creditcard" className="cursor-not-allowed flex-1">
                    <div>
                      <div className="font-medium">Tarjeta de Crédito</div>
                      <div className="text-xs text-muted-foreground">Próximamente</div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          {/* Resumen de costos */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tarifa de reserva:</span>
              <span className="font-medium">${reservationFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Precio por hora:</span>
              <span className="font-medium">${pricePerHour}</span>
            </div>
            <div className="border-t border-border/50 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-medium">Total a pagar ahora:</span>
                <span className="font-semibold text-primary">${reservationFee}</span>
              </div>
            </div>
          </div>
          
          {/* Botón de solicitar reserva */}
          <Button 
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl"
            onClick={handleReservation}
          >
            Solicitar Reserva
          </Button>
          
          {/* Información adicional */}
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>La reserva será confirmada instantáneamente</p>
            <p>Recibirás un código QR para acceder al estacionamiento</p>
          </div>
        </div>
      </div>
      
      {/* Modal de confirmación */}
      <ReservationConfirmationModal
        isOpen={showConfirmation}
        onClose={onClose}
        parkingName={parkingName}
        reservationCode={reservationCode}
      />
    </div>
  );
}
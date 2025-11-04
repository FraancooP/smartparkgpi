import { X, Clock, MapPin as MapPinIcon, Star, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ReservationModal } from './ReservationModal';
import { ScheduledReservationModal } from './ScheduledReservationModal';
import { useState } from 'react';

interface ParkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  parkingData: {
    id: number;
    name: string;
    image: string;
    color: 'red' | 'green' | 'yellow';
    availableSpots: number;
    totalSpots: number;
    pricePerHour: number;
    openTime: string;
    closeTime: string;
    rating: number;
    distance: string;
  };
}

export function ParkingModal({ isOpen, onClose, parkingData }: ParkingModalProps) {
  const [showReservation, setShowReservation] = useState(false);
  const [showScheduledReservation, setShowScheduledReservation] = useState(true); // Simular reserva programada
  
  if (!isOpen) return null;

  const availabilityText = {
    red: 'Lleno',
    yellow: 'Casi lleno',
    green: 'Disponible'
  };

  const colorClasses = {
    red: 'border-red-800 bg-red-800',
    green: 'border-green-800 bg-green-800', 
    yellow: 'border-yellow-700 bg-yellow-700'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay con blur */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header con imagen */}
        <div className="relative h-48 overflow-hidden">
          <ImageWithFallback
            src={parkingData.image}
            alt={parkingData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          
          {/* Botón cerrar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Rating y distancia */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-3">
            <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-xs">{parkingData.rating}</span>
            </div>
            <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
              <MapPinIcon className="h-3 w-3 mr-1" />
              <span className="text-xs">{parkingData.distance}</span>
            </div>
          </div>
        </div>
        
        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Nombre y disponibilidad */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">{parkingData.name}</h2>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${colorClasses[parkingData.color]}`} />
                <span className="text-sm text-muted-foreground">
                  {parkingData.availableSpots} de {parkingData.totalSpots} lugares disponibles
                </span>
              </div>
              <Badge 
                variant={parkingData.color === 'green' ? 'default' : 'secondary'}
                className={parkingData.color === 'green' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
              >
                {availabilityText[parkingData.color]}
              </Badge>
            </div>
          </div>
          
          {/* Horarios y precio */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                Horarios
              </div>
              <p className="text-sm">
                Abierto desde <br />
                <span className="font-medium">
                  {parkingData.openTime === '24h' ? '24 horas' : `${parkingData.openTime} - ${parkingData.closeTime}`}
                </span>
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Precio por hora</p>
              <p className="text-lg font-semibold text-primary">
                ${parkingData.pricePerHour}
              </p>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="h-12 bg-primary hover:bg-primary/90 text-white rounded-xl"
                onClick={() => setShowReservation(true)}
              >
                Reserva ahora
              </Button>
              
              <Button 
                variant="outline"
                className="h-12 border-2 border-primary text-primary hover:bg-primary/10 rounded-xl flex items-center justify-center space-x-2"
                onClick={() => setShowScheduledReservation(true)}
              >
                <Calendar className="h-4 w-4" />
                <span>Programar</span>
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full h-12 border-2 rounded-xl hover:bg-muted/50"
              onClick={() => console.log('Navegar')}
            >
              Como llegar
            </Button>
          </div>
          
          {/* Información adicional */}
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Actualizado hace 2 min</span>
              <span>24/7 disponible</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de reserva inmediata */}
      <ReservationModal
        isOpen={showReservation}
        onClose={onClose}
        onBack={() => setShowReservation(false)}
        parkingName={parkingData.name}
        pricePerHour={parkingData.pricePerHour}
      />
      
      {/* Modal de reserva programada */}
      <ScheduledReservationModal
        isOpen={showScheduledReservation}
        onClose={onClose}
        onBack={() => setShowScheduledReservation(false)}
        parkingName={parkingData.name}
        pricePerHour={parkingData.pricePerHour}
      />
    </div>
  );
}
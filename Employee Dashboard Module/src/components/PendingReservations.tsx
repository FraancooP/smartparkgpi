import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Calendar, Clock, Car, User, MapPin, CheckCircle } from 'lucide-react';

interface PendingReservationsProps {
  reservations: any[];
  availableSpots: any[];
  onAssignSpot: (reservationId: string, spotId: number) => void;
}

export function PendingReservations({ reservations, availableSpots, onAssignSpot }: PendingReservationsProps) {
  const [selectedSpot, setSelectedSpot] = useState({});
  const [assigningReservation, setAssigningReservation] = useState(null);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getTimeUntilArrival = (arrivalTime: Date) => {
    const now = new Date();
    const diffMs = arrivalTime.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 0) {
      return 'Retrasado';
    } else if (diffMinutes === 0) {
      return 'Llegando ahora';
    } else {
      return `${diffMinutes} min`;
    }
  };

  const handleAssignSpot = (reservationId: string) => {
    const spotId = selectedSpot[reservationId];
    if (spotId) {
      onAssignSpot(reservationId, parseInt(spotId));
      setSelectedSpot(prev => ({ ...prev, [reservationId]: '' }));
      setAssigningReservation(null);
    }
  };

  const isOverdue = (arrivalTime: Date) => {
    return new Date() > arrivalTime;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Reservas Pendientes ({reservations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reservations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No hay reservas pendientes por asignar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <Card key={reservation.id} className={`transition-all ${
                  isOverdue(reservation.arrivalTime) ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-600" />
                            <span className="font-medium">{reservation.customerName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">{reservation.vehiclePlate}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(reservation.arrivalTime)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(reservation.arrivalTime)}
                          </div>
                          <div>
                            Duración: {reservation.duration} min
                          </div>
                          <div>
                            Código: <span className="font-mono font-medium">{reservation.code}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={isOverdue(reservation.arrivalTime) ? "destructive" : "secondary"}
                            className={isOverdue(reservation.arrivalTime) ? "" : "bg-blue-100 text-blue-800"}
                          >
                            {isOverdue(reservation.arrivalTime) ? 'Retrasado' : getTimeUntilArrival(reservation.arrivalTime)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              disabled={availableSpots.length === 0}
                              onClick={() => setAssigningReservation(reservation)}
                            >
                              <MapPin className="h-4 w-4 mr-1" />
                              Asignar Espacio
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Asignar Espacio de Estacionamiento</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-2">Detalles de la Reserva</h4>
                                <div className="space-y-1 text-sm">
                                  <p><strong>Cliente:</strong> {reservation.customerName}</p>
                                  <p><strong>Vehículo:</strong> {reservation.vehiclePlate}</p>
                                  <p><strong>Código:</strong> {reservation.code}</p>
                                  <p><strong>Duración:</strong> {reservation.duration} minutos</p>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Seleccionar Espacio Disponible:</label>
                                <Select 
                                  value={selectedSpot[reservation.id] || ''} 
                                  onValueChange={(value) => setSelectedSpot(prev => ({ ...prev, [reservation.id]: value }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Escolha un espacio libre" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableSpots.map((spot) => (
                                      <SelectItem key={spot.id} value={spot.id.toString()}>
                                        {spot.name} - Libre
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="flex gap-2 pt-4">
                                <Button 
                                  onClick={() => handleAssignSpot(reservation.id)}
                                  disabled={!selectedSpot[reservation.id]}
                                  className="flex-1"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Confirmar Asignación
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {availableSpots.length === 0 && reservations.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ No hay espacios libres disponibles para asignar las reservas pendientes.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800">Total Pendientes</h3>
              <p className="text-2xl font-bold text-blue-600">{reservations.length}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium text-red-800">Retrasadas</h3>
              <p className="text-2xl font-bold text-red-600">
                {reservations.filter(r => isOverdue(r.arrivalTime)).length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">Espacios Disponibles</h3>
              <p className="text-2xl font-bold text-green-600">{availableSpots.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
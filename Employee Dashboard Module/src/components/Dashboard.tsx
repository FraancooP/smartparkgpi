import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ParkingGrid } from './ParkingGrid';
import { ReservationValidator } from './ReservationValidator';
import { PendingReservations } from './PendingReservations';
import { SessionTimer } from './SessionTimer';
import { LogOut, Car, Clock, QrCode, Calendar } from 'lucide-react';
import { getPlaces, getPendingReservations, updatePlaceStatus, assignPlaceToReservation } from '../services/employeeService';

interface DashboardProps {
  employee: any;
  onLogout: () => void;
}

export function Dashboard({ employee, onLogout }: DashboardProps) {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [pendingReservations, setPendingReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Cargar lugares del estacionamiento
      const placesResponse = await getPlaces(employee.estacionamiento_asignado || 1);
      if (placesResponse.success) {
        // Convertir los datos del backend al formato esperado por el componente
        const formattedSpots = placesResponse.data.map(lugar => ({
          id: lugar.id,
          name: lugar.numero_lugar,
          status: lugar.estado === 'disponible' ? 'libre' : 
                  lugar.estado === 'ocupado' ? 'ocupado' : 'reservado',
          occupiedSince: lugar.estado === 'ocupado' ? new Date(lugar.actualizado_en) : null,
          toleranceEnd: lugar.estado === 'reservado' ? new Date(Date.now() + 15 * 60 * 1000) : null,
        }));
        setParkingSpots(formattedSpots);
      }

      // Cargar reservas pendientes
      const reservationsResponse = await getPendingReservations();
      if (reservationsResponse.success) {
        // Convertir los datos del backend al formato esperado
        const formattedReservations = reservationsResponse.data.map(reserva => ({
          id: reserva.id,
          customerName: reserva.usuario.nombre,
          vehiclePlate: reserva.vehiculo.placa,
          arrivalTime: new Date(`${reserva.fecha}T${reserva.hora}`),
          duration: 120, // Por defecto 2 horas, se puede calcular según el tipo
          code: reserva.codigo_numerico,
        }));
        setPendingReservations(formattedReservations);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignSpot = async (reservationId: string, spotId: number) => {
    try {
      // Asignar lugar a la reserva usando el servicio
      const response = await assignPlaceToReservation(reservationId, spotId);
      
      if (response.success) {
        // Actualizar estado local
        setParkingSpots(prev => prev.map(spot => 
          spot.id === spotId 
            ? { ...spot, status: 'ocupado', occupiedSince: new Date() }
            : spot
        ));

        // Remover de reservas pendientes
        setPendingReservations(prev => prev.filter(res => res.id !== reservationId));
      }
    } catch (error) {
      console.error('Error assigning spot:', error);
    }
  };

  const handleValidateReservation = (code: string) => {
    const reservation = pendingReservations.find(res => res.code === code);
    if (reservation) {
      return {
        isValid: true,
        reservation,
      };
    }
    return { isValid: false };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold">SmartPark</h1>
                <p className="text-sm text-gray-600">Bienvenido, {employee.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <SessionTimer />
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="parking" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="parking" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Estacionamiento
            </TabsTrigger>
            <TabsTrigger value="validate" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Validar Reserva
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Reservas Pendientes
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Estadísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="parking">
            <ParkingGrid 
              spots={parkingSpots}
              onSpotUpdate={setParkingSpots}
            />
          </TabsContent>

          <TabsContent value="validate">
            <ReservationValidator onValidate={handleValidateReservation} />
          </TabsContent>

          <TabsContent value="reservations">
            <PendingReservations 
              reservations={pendingReservations}
              availableSpots={parkingSpots.filter(spot => spot.status === 'libre')}
              onAssignSpot={handleAssignSpot}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas del Día</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800">Espacios Libres</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {parkingSpots.filter(spot => spot.status === 'libre').length}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-medium text-red-800">Espacios Ocupados</h3>
                    <p className="text-2xl font-bold text-red-600">
                      {parkingSpots.filter(spot => spot.status === 'ocupado').length}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-medium text-yellow-800">Espacios Reservados</h3>
                    <p className="text-2xl font-bold text-yellow-600">
                      {parkingSpots.filter(spot => spot.status === 'reservado').length}
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800">Reservas Pendientes</h3>
                  <p className="text-2xl font-bold text-blue-600">{pendingReservations.length}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Car, 
  Bike,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Edit2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar } from './ui/avatar';

interface UserProfileProps {
  onClose: () => void;
}

interface Reservation {
  id: string;
  parkingName: string;
  date: string;
  time: string;
  duration: string;
  vehicle: string;
  cost: number;
  status: 'active' | 'completed' | 'cancelled';
  type: 'immediate' | 'scheduled';
}

export function UserProfile({ onClose }: UserProfileProps) {
  const [userData] = useState({
    name: "Juan Carlos López",
    email: "juan.lopez@email.com",
    phone: "+54 11 1234-5678",
    joinDate: "Marzo 2024",
    penaltyBalance: 0.0,
    completedReservations: 23,
    totalSpent: 4650.50
  });

  const [reservations] = useState<Reservation[]>([
    {
      id: "1",
      parkingName: "Estacionamiento Central Plaza",
      date: "2024-09-26",
      time: "14:30",
      duration: "2h 30min",
      vehicle: "Mi Auto (ABC 123)",
      cost: 375,
      status: "active",
      type: "immediate"
    },
    {
      id: "2",
      parkingName: "Parking Green Tower",
      date: "2024-09-28",
      time: "09:00",
      duration: "4h",
      vehicle: "Auto Familiar (XYZ 789)",
      cost: 480,
      status: "active",
      type: "scheduled"
    }
  ]);

  const [reservationHistory] = useState<Reservation[]>([
    {
      id: "3",
      parkingName: "Estacionamiento Avenida",
      date: "2024-09-25",
      time: "10:15",
      duration: "1h 45min",
      vehicle: "Mi Auto (ABC 123)",
      cost: 315,
      status: "completed",
      type: "immediate"
    },
    {
      id: "4",
      parkingName: "Parking Shopping Center",
      date: "2024-09-24",
      time: "16:00",
      duration: "3h",
      vehicle: "Mi Moto (MOT 456)",
      cost: 360,
      status: "completed",
      type: "scheduled"
    },
    {
      id: "5",
      parkingName: "Estacionamiento Central Plaza",
      date: "2024-09-23",
      time: "08:30",
      duration: "8h",
      vehicle: "Auto Trabajo (DEF 456)",
      cost: 960,
      status: "completed",
      type: "immediate"
    },
    {
      id: "6",
      parkingName: "Parking Green Tower",
      date: "2024-09-20",
      time: "19:00",
      duration: "2h",
      vehicle: "Mi Auto (ABC 123)",
      cost: 240,
      status: "cancelled",
      type: "scheduled"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      case 'cancelled': return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const ReservationCard = ({ reservation, showActions = false }: { reservation: Reservation, showActions?: boolean }) => (
    <Card className="p-4 bg-gradient-to-br from-muted/20 to-muted/5 border hover:shadow-md transition-all duration-200">
      <div className="space-y-3">
        {/* Header con nombre y estado */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="font-medium">{reservation.parkingName}</h4>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(reservation.date).toLocaleDateString('es-AR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
          <Badge className={`${getStatusColor(reservation.status)} flex items-center space-x-1`}>
            {getStatusIcon(reservation.status)}
            <span>{getStatusText(reservation.status)}</span>
          </Badge>
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{reservation.time} • {reservation.duration}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Car className="h-4 w-4" />
              <span>{reservation.vehicle}</span>
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="font-medium">${reservation.cost.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">
              {reservation.type === 'scheduled' ? 'Programada' : 'Inmediata'}
            </div>
          </div>
        </div>

        {/* Acciones para reservas activas */}
        {showActions && reservation.status === 'active' && (
          <div className="flex space-x-2 pt-2 border-t">
            <Button variant="outline" size="sm" className="flex-1">
              Ver detalles
            </Button>
            {reservation.type === 'scheduled' && (
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                Cancelar
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6 pb-8">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg px-3 py-2"
          >
            ← Volver
          </Button>
          <h1 className="text-xl font-semibold">Mi Perfil</h1>
          <div className="w-16"></div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 space-y-6 -mt-4">
        
        {/* Tarjeta de perfil principal */}
        <Card className="p-6 bg-gradient-to-br from-slate-50 to-white border-2">
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-slate-600" />
            </div>
            
            {/* Información del usuario */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{userData.name}</h2>
                  <p className="text-sm text-muted-foreground">Miembro desde {userData.joinDate}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{userData.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Estadísticas y saldo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Saldo de penalizaciones */}
          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-green-800">Saldo Penalizaciones</h3>
              </div>
              <p className="text-2xl font-semibold text-green-700">
                ${userData.penaltyBalance.toFixed(2)} ARS
              </p>
              <p className="text-xs text-green-600">¡Excelente! Sin penalizaciones</p>
            </div>
          </Card>

          {/* Reservas completadas */}
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-800">Reservas Completadas</h3>
              </div>
              <p className="text-2xl font-semibold text-blue-700">{userData.completedReservations}</p>
              <p className="text-xs text-blue-600">Total de estacionamientos</p>
            </div>
          </Card>

          {/* Total gastado */}
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                <h3 className="font-medium text-purple-800">Total Gastado</h3>
              </div>
              <p className="text-2xl font-semibold text-purple-700">
                ${userData.totalSpent.toFixed(2)}
              </p>
              <p className="text-xs text-purple-600">En estacionamientos</p>
            </div>
          </Card>
        </div>

        {/* Tabs para Reservas y Historial */}
        <Tabs defaultValue="reservations" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="reservations" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Reservas Activas ({reservations.length})</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Historial ({reservationHistory.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Reservas Activas */}
          <TabsContent value="reservations" className="space-y-4">
            {reservations.length > 0 ? (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <ReservationCard 
                    key={reservation.id} 
                    reservation={reservation} 
                    showActions={true}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">No tenés reservas activas</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Buscá un estacionamiento para hacer tu primera reserva
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Historial */}
          <TabsContent value="history" className="space-y-4">
            {reservationHistory.length > 0 ? (
              <div className="space-y-4">
                {reservationHistory.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">No tenés historial de reservas</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Aquí aparecerán tus reservas pasadas
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Información adicional */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium text-amber-800">Información de cuenta</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Las penalizaciones se aplican por no ocupar reservas confirmadas</li>
                <li>• Podés cancelar reservas programadas hasta 1 hora antes</li>
                <li>• Tu historial se mantiene por 12 meses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
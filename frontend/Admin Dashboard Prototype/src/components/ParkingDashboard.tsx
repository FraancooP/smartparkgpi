import { useState } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { ParkingCard } from "./ParkingCard";

interface Parking {
  id: string;
  name: string;
  image: string;
  location: string;
  spaces: number;
  occupiedSpaces: number;
}

interface ParkingDashboardProps {
  onRegisterClick: () => void;
  onParkingClick?: (parking: Parking) => void;
}

export function ParkingDashboard({ onRegisterClick, onParkingClick }: ParkingDashboardProps) {
  // Datos de ejemplo de estacionamientos
  const [parkings] = useState<Parking[]>([
    {
      id: '1',
      name: 'Estacionamiento Centro',
      image: 'https://images.unsplash.com/photo-1558457738-f199ff9dbf82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwbG90JTIwbW9kZXJufGVufDF8fHx8MTc1OTI3NjMxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      location: 'Av. Corrientes 1234, CABA',
      spaces: 120,
      occupiedSpaces: 98
    },
    {
      id: '2',
      name: 'Garaje Subterráneo Plaza',
      image: 'https://images.unsplash.com/photo-1679055324415-695962596868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcmdyb3VuZCUyMHBhcmtpbmclMjBnYXJhZ2V8ZW58MXx8fHwxNzU5Mjc2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      location: 'Av. Santa Fe 5678, CABA',
      spaces: 85,
      occupiedSpaces: 67
    },
    {
      id: '3',
      name: 'Parking Oficinas Norte',
      image: 'https://images.unsplash.com/photo-1739796714542-63f9b4681014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBwYXJraW5nJTIwc3RydWN0dXJlfGVufDF8fHx8MTc1OTI3NjMyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      location: 'Av. del Libertador 9012, Vicente López',
      spaces: 200,
      occupiedSpaces: 143
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Botón de Registro */}
        <div className="flex justify-center">
          <Button
            onClick={onRegisterClick}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-6 h-6 mr-3" />
            Registrar un Estacionamiento
          </Button>
        </div>

        {/* Título */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl text-slate-800">Mis Estacionamientos</h1>
          <p className="text-slate-600">Gestiona todos tus estacionamientos desde un solo lugar</p>
        </div>

        {/* Grid de Estacionamientos */}
        {parkings.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                <Plus className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl text-slate-700">No tienes estacionamientos registrados</h3>
              <p className="text-slate-500">
                Comienza registrando tu primer estacionamiento para empezar a gestionar tu negocio
              </p>
              <Button
                onClick={onRegisterClick}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Registrar mi primer estacionamiento
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {parkings.map((parking) => (
              <ParkingCard 
                key={parking.id} 
                parking={parking} 
                onClick={() => onParkingClick?.(parking)}
              />
            ))}
          </div>
        )}

        {/* Estadísticas rápidas */}
        {parkings.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="text-3xl text-blue-600">{parkings.length}</div>
                <div className="text-sm text-slate-600">Estacionamientos</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl text-green-600">
                  {parkings.reduce((total, parking) => total + parking.spaces, 0)}
                </div>
                <div className="text-sm text-slate-600">Plazas Totales</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl text-purple-600">
                  {Math.round(parkings.reduce((total, parking) => total + parking.spaces, 0) / parkings.length)}
                </div>
                <div className="text-sm text-slate-600">Promedio por Estacionamiento</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
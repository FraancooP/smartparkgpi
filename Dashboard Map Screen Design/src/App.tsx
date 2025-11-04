import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { FilterButtons } from './components/FilterButtons';
import { BottomNavBar } from './components/BottomNavBar';
import { MapBackground } from './components/MapBackground';
import { MapPin } from './components/MapPin';
import { ParkingModal } from './components/ParkingModal';
import { VehicleManagement } from './components/VehicleManagement';
import { UserProfile } from './components/UserProfile';
import { Settings } from './components/Settings';
import { QuickActions } from './components/QuickActions';

export default function App() {
  const [selectedParking, setSelectedParking] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<'map' | 'vehicles' | 'profile' | 'settings' | 'quickActions'>('map');

  // Datos de los estacionamientos
  const parkingData = {
    1: {
      id: 1,
      name: "Estacionamiento Central Plaza",
      image: "https://images.unsplash.com/photo-1514836876796-56c8ba8b2e3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwZ2FyYWdlJTIwbW9kZXJufGVufDF8fHx8MTc1ODczNzAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      color: 'red' as const,
      availableSpots: 2,
      totalSpots: 50,
      pricePerHour: 150,
      openTime: "06:00",
      closeTime: "23:00",
      rating: 4.2,
      distance: "50m"
    },
    2: {
      id: 2,
      name: "Parking Green Tower",
      image: "https://images.unsplash.com/photo-1514836876796-56c8ba8b2e3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwZ2FyYWdlJTIwbW9kZXJufGVufDF8fHx8MTc1ODczNzAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      color: 'green' as const,
      availableSpots: 35,
      totalSpots: 80,
      pricePerHour: 120,
      openTime: "24h",
      closeTime: "",
      rating: 4.7,
      distance: "120m"
    },
    3: {
      id: 3,
      name: "Estacionamiento Avenida",
      image: "https://images.unsplash.com/photo-1514836876796-56c8ba8b2e3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwZ2FyYWdlJTIwbW9kZXJufGVufDF8fHx8MTc1ODczNzAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      color: 'yellow' as const,
      availableSpots: 8,
      totalSpots: 40,
      pricePerHour: 180,
      openTime: "07:00",
      closeTime: "22:00",
      rating: 4.0,
      distance: "200m"
    },
    4: {
      id: 4,
      name: "Parking Shopping Center",
      image: "https://images.unsplash.com/photo-1514836876796-56c8ba8b2e3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwZ2FyYWdlJTIwbW9kZXJufGVufDF8fHx8MTc1ODczNzAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      color: 'red' as const,
      availableSpots: 1,
      totalSpots: 60,
      pricePerHour: 200,
      openTime: "08:00",
      closeTime: "24:00",
      rating: 4.5,
      distance: "80m"
    }
  };

  // Datos de los pins del mapa - posicionados cerca de las calles
  const mapPins = [
    {
      id: 1,
      imageUrl: "https://images.unsplash.com/photo-1539605480396-a61f99da1041?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwb3J0cmFpdCUyMHByb2ZpbGV8ZW58MXx8fHwxNzU4NzM2Mzc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      color: 'red' as const,
      position: { top: '22%', left: '32%' } // Cerca de calle horizontal superior
    },
    {
      id: 2,
      imageUrl: "https://images.unsplash.com/photo-1758521962822-588389e13887?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcml2ZXIlMjBtYW4lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU4NzM2Mzc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      color: 'green' as const,
      position: { top: '52%', left: '72%' } // Cerca de intersección
    },
    {
      id: 3,
      imageUrl: "https://images.unsplash.com/photo-1573497161161-c3e73707e25c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJ1c2luZXNzJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1ODczNjM3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      color: 'yellow' as const,
      position: { top: '47%', left: '42%' } // En la calle principal vertical
    },
    {
      id: 4,
      imageUrl: "https://images.unsplash.com/photo-1600770320021-fda891259970?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHBlcnNvbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzU4NjU1OTAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      color: 'red' as const,
      position: { top: '77%', left: '28%' } // Cerca de calle horizontal inferior
    }
  ];

  const handleNavigation = (view: 'map' | 'vehicles' | 'profile' | 'settings' | 'quickActions') => {
    setCurrentView(view);
    setSelectedParking(null); // Cerrar modal si está abierto
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Vista del mapa */}
      {currentView === 'map' && (
        <>
          {/* Fondo del mapa */}
          <MapBackground />
          
          {/* Pins del mapa */}
          {mapPins.map((pin) => (
            <MapPin
              key={pin.id}
              imageUrl={pin.imageUrl}
              color={pin.color}
              position={pin.position}
              onClick={() => setSelectedParking(pin.id)}
            />
          ))}
          
          {/* Modal de estacionamiento */}
          {selectedParking && (
            <ParkingModal
              isOpen={true}
              onClose={() => setSelectedParking(null)}
              parkingData={parkingData[selectedParking as keyof typeof parkingData]}
            />
          )}
          
          {/* Barra de búsqueda superior */}
          <SearchBar />
          
          {/* Filtros de vehículos */}
          <FilterButtons />
        </>
      )}
      
      {/* Vista de gestión de vehículos */}
      {currentView === 'vehicles' && (
        <VehicleManagement onClose={() => setCurrentView('map')} />
      )}
      
      {/* Vista de perfil */}
      {currentView === 'profile' && (
        <UserProfile onClose={() => setCurrentView('map')} />
      )}
      
      {/* Vista de configuración */}
      {currentView === 'settings' && (
        <Settings onClose={() => setCurrentView('map')} />
      )}
      
      {/* Vista de acciones rápidas */}
      {currentView === 'quickActions' && (
        <QuickActions onClose={() => setCurrentView('map')} />
      )}
      
      {/* Barra de navegación inferior - siempre visible */}
      <BottomNavBar currentView={currentView} onNavigate={handleNavigation} />
    </div>
  );
}
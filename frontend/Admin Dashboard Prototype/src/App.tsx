import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { ParkingDashboard } from "./components/ParkingDashboard";
import { ParkingRegistrationForm } from "./components/ParkingRegistrationForm";
import { ParkingDetailView } from "./components/ParkingDetailView";
import { ProfileView } from "./components/ProfileView";
import { SettingsView } from "./components/SettingsView";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./components/ui/dialog";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";

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

export default function App() {
  const [activeTab, setActiveTab] = useState('parking');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
  const [parkings, setParkings] = useState<Parking[]>([
    {
      id: '1',
      name: 'Estacionamiento Centro',
      image: 'https://images.unsplash.com/photo-1558457738-f199ff9dbf82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwbG90JTIwbW9kZXJufGVufDF8fHx8MTc1OTI3NjMxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      location: 'Av. Corrientes 1234, CABA',
      spaces: 120,
      occupiedSpaces: 98,
      rates: { moto: 150, auto: 300 },
      employees: 4,
      revenue: 67000
    },
    {
      id: '2',
      name: 'Garaje Subterráneo Plaza',
      image: 'https://images.unsplash.com/photo-1679055324415-695962596868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcmdyb3VuZCUyMHBhcmtpbmclMjBnYXJhZ2V8ZW58MXx8fHwxNzU5Mjc2MzIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      location: 'Av. Santa Fe 5678, CABA',
      spaces: 85,
      occupiedSpaces: 67,
      rates: { moto: 120, auto: 250 },
      employees: 3,
      revenue: 45000
    },
    {
      id: '3',
      name: 'Parking Oficinas Norte',
      image: 'https://images.unsplash.com/photo-1739796714542-63f9b4681014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBwYXJraW5nJTIwc3RydWN0dXJlfGVufDF8fHx8MTc1OTI3NjMyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      location: 'Av. del Libertador 9012, Vicente López',
      spaces: 200,
      occupiedSpaces: 143,
      rates: { moto: 180, auto: 350 },
      employees: 5,
      revenue: 89000
    }
  ]);

  const handleRegisterClick = () => {
    setShowRegistrationForm(true);
  };

  const handleParkingClick = (parking: any) => {
    // Convertir datos del dashboard al formato completo
    const fullParking: Parking = {
      ...parking,
      rates: { moto: 150, auto: 300 },
      employees: 4,
      revenue: 67000
    };
    setSelectedParking(fullParking);
  };

  const handleBackToDashboard = () => {
    setSelectedParking(null);
  };

  const handleUpdateParking = (updatedParking: Parking) => {
    setParkings(prev => prev.map(p => p.id === updatedParking.id ? updatedParking : p));
    setSelectedParking(updatedParking);
  };

  const handleDeleteParking = (parkingId: string) => {
    setParkings(prev => prev.filter(p => p.id !== parkingId));
    setSelectedParking(null);
  };

  const handleRegistrationSubmit = (data: any) => {
    console.log('Datos del estacionamiento:', data);
    
    // Crear nuevo estacionamiento
    const newParking: Parking = {
      id: Date.now().toString(),
      name: data.name,
      image: data.images[0] || 'https://images.unsplash.com/photo-1558457738-f199ff9dbf82?w=400',
      location: data.location,
      spaces: parseInt(data.spaces),
      occupiedSpaces: 0,
      rates: {
        moto: parseFloat(data.rates.moto),
        auto: parseFloat(data.rates.auto)
      },
      employees: data.employees.length,
      revenue: 0
    };

    setParkings(prev => [...prev, newParking]);
    
    toast.success("¡Estacionamiento registrado exitosamente!", {
      description: `${data.name} ha sido agregado a tu lista de estacionamientos.`
    });
    
    setShowRegistrationForm(false);
  };

  const handleRegistrationCancel = () => {
    setShowRegistrationForm(false);
  };

  const renderContent = () => {
    if (selectedParking) {
      return (
        <ParkingDetailView
          parking={selectedParking}
          onBack={handleBackToDashboard}
          onUpdate={handleUpdateParking}
          onDelete={handleDeleteParking}
        />
      );
    }

    switch (activeTab) {
      case 'profile':
        return <ProfileView />;
      case 'parking':
        return (
          <ParkingDashboard 
            onRegisterClick={handleRegisterClick}
            onParkingClick={handleParkingClick}
          />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <ParkingDashboard 
            onRegisterClick={handleRegisterClick}
            onParkingClick={handleParkingClick}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="relative">
        {renderContent()}
      </main>

      {/* Modal de Registro */}
      <Dialog open={showRegistrationForm} onOpenChange={setShowRegistrationForm}>
        <DialogContent className="max-w-none w-full h-full p-0 m-0 max-h-none overflow-auto">
          <DialogTitle className="sr-only">Registrar Nuevo Estacionamiento</DialogTitle>
          <DialogDescription className="sr-only">
            Formulario para registrar un nuevo estacionamiento con información básica, tarifas, empleados y configuración de pagos.
          </DialogDescription>
          <ParkingRegistrationForm
            onSubmit={handleRegistrationSubmit}
            onCancel={handleRegistrationCancel}
          />
        </DialogContent>
      </Dialog>

      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e2e8f0',
            color: '#334155',
          },
        }}
      />
    </div>
  );
}
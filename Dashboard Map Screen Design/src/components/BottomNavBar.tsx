import { MapPin, Car, Settings, User, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface BottomNavBarProps {
  currentView: 'map' | 'vehicles' | 'profile' | 'settings' | 'quickActions';
  onNavigate: (view: 'map' | 'vehicles' | 'profile' | 'settings' | 'quickActions') => void;
}

export function BottomNavBar({ currentView, onNavigate }: BottomNavBarProps) {
  return (
    <div className={`${currentView === 'map' ? 'absolute bottom-6' : 'fixed bottom-6'} left-1/2 transform -translate-x-1/2 z-20`}>
      <div className="bg-white/95 backdrop-blur-sm border border-border rounded-full shadow-lg px-6 py-3">
        <div className="flex items-center space-x-6">
          <Button 
            variant={currentView === 'vehicles' ? 'default' : 'ghost'}
            size="icon" 
            className={`rounded-full h-12 w-12 ${currentView === 'vehicles' ? 'bg-primary text-white' : ''}`}
            onClick={() => onNavigate('vehicles')}
          >
            <Car className="h-6 w-6" />
          </Button>
          
          <Button 
            variant={currentView === 'settings' ? 'default' : 'ghost'}
            size="icon" 
            className={`rounded-full h-12 w-12 ${currentView === 'settings' ? 'bg-primary text-white' : ''}`}
            onClick={() => onNavigate('settings')}
          >
            <Settings className="h-6 w-6" />
          </Button>
          
          {/* Botón central del mapa - más prominente */}
          <Button 
            variant="default" 
            size="icon" 
            className={`rounded-full h-14 w-14 shadow-lg ${currentView === 'map' ? 'bg-primary' : 'bg-primary/70'}`}
            onClick={() => onNavigate('map')}
          >
            <MapPin className="h-7 w-7" />
          </Button>
          
          <Button 
            variant={currentView === 'profile' ? 'default' : 'ghost'}
            size="icon" 
            className={`rounded-full h-12 w-12 ${currentView === 'profile' ? 'bg-primary text-white' : ''}`}
            onClick={() => onNavigate('profile')}
          >
            <User className="h-6 w-6" />
          </Button>
          
          <Button 
            variant={currentView === 'quickActions' ? 'default' : 'ghost'} 
            size="icon" 
            className={`rounded-full h-12 w-12 ${currentView === 'quickActions' ? 'bg-primary text-white' : ''}`}
            onClick={() => onNavigate('quickActions')}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
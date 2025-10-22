import { User, Car, Settings } from "lucide-react";
import { Button } from "./ui/button";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'profile', label: 'Mi Perfil', icon: User },
    { id: 'parking', label: 'Estacionamientos', icon: Car },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-green-50 border-b border-blue-100 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-2 p-6 h-auto transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg' 
                    : 'text-blue-700 hover:bg-blue-100 hover:text-blue-800'
                }`}
              >
                <Icon className="w-8 h-8" />
                <span className="text-sm">{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
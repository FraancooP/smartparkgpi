import React, { useState, useEffect } from 'react';
import { Clock, Timer } from 'lucide-react';

interface ParkingSpotProps {
  spot: {
    id: number;
    name: string;
    status: 'libre' | 'ocupado' | 'reservado';
    occupiedSince?: Date | null;
    toleranceEnd?: Date | null;
  };
  onClick: () => void;
}

export function ParkingSpot({ spot, onClick }: ParkingSpotProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = () => {
    switch (spot.status) {
      case 'libre':
        return 'border-green-500 bg-green-50 hover:bg-green-100';
      case 'ocupado':
        return 'border-red-500 bg-red-50 hover:bg-red-100';
      case 'reservado':
        return 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getOccupiedTime = () => {
    if (!spot.occupiedSince) return '';
    
    const diffMs = currentTime.getTime() - spot.occupiedSince.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const getToleranceTime = () => {
    if (!spot.toleranceEnd) return '';
    
    const diffMs = spot.toleranceEnd.getTime() - currentTime.getTime();
    
    if (diffMs <= 0) {
      return 'Expirado';
    }
    
    const minutes = Math.floor(diffMs / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch (spot.status) {
      case 'libre':
        return 'Libre';
      case 'ocupado':
        return 'Ocupado';
      case 'reservado':
        return 'Reservado';
      default:
        return '';
    }
  };

  const isToleranceExpired = spot.status === 'reservado' && spot.toleranceEnd && 
    spot.toleranceEnd.getTime() <= currentTime.getTime();

  return (
    <div
      className={`
        border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 
        min-h-24 flex flex-col justify-between text-center
        ${getStatusColor()}
        ${isToleranceExpired ? 'animate-pulse border-red-500 bg-red-100' : ''}
      `}
      onClick={onClick}
    >
      <div>
        <div className="font-semibold text-sm mb-1">{spot.name}</div>
        <div className="text-xs text-gray-600 mb-2">
          {getStatusText()}
        </div>
      </div>
      
      <div className="text-xs">
        {spot.status === 'ocupado' && spot.occupiedSince && (
          <div className="flex items-center justify-center gap-1 text-red-700">
            <Clock className="h-3 w-3" />
            {getOccupiedTime()}
          </div>
        )}
        
        {spot.status === 'reservado' && spot.toleranceEnd && (
          <div className={`flex items-center justify-center gap-1 ${
            isToleranceExpired ? 'text-red-700 font-semibold' : 'text-yellow-700'
          }`}>
            <Timer className="h-3 w-3" />
            {getToleranceTime()}
          </div>
        )}
      </div>
    </div>
  );
}
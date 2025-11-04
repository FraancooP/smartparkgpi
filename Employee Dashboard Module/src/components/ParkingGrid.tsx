import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ParkingSpot } from './ParkingSpot';
import { Filter, RotateCcw } from 'lucide-react';

interface ParkingGridProps {
  spots: any[];
  onSpotUpdate: (spots: any[]) => void;
}

export function ParkingGrid({ spots, onSpotUpdate }: ParkingGridProps) {
  const [filter, setFilter] = useState('todos');
  const [filteredSpots, setFilteredSpots] = useState(spots);

  useEffect(() => {
    let filtered = [...spots];
    
    switch (filter) {
      case 'libres':
        filtered = spots.filter(spot => spot.status === 'libre');
        break;
      case 'ocupados':
        filtered = spots.filter(spot => spot.status === 'ocupado');
        break;
      case 'reservados':
        filtered = spots.filter(spot => spot.status === 'reservado');
        break;
      default:
        filtered = spots;
    }
    
    setFilteredSpots(filtered);
  }, [spots, filter]);

  const handleSpotClick = (spotId: number) => {
    const updatedSpots = spots.map(spot => {
      if (spot.id === spotId) {
        let newStatus = spot.status;
        let occupiedSince = spot.occupiedSince;
        let toleranceEnd = spot.toleranceEnd;

        switch (spot.status) {
          case 'libre':
            newStatus = 'ocupado';
            occupiedSince = new Date();
            toleranceEnd = null;
            break;
          case 'ocupado':
            newStatus = 'libre';
            occupiedSince = null;
            toleranceEnd = null;
            break;
          case 'reservado':
            newStatus = 'ocupado';
            occupiedSince = new Date();
            toleranceEnd = null;
            break;
        }

        return {
          ...spot,
          status: newStatus,
          occupiedSince,
          toleranceEnd,
        };
      }
      return spot;
    });

    onSpotUpdate(updatedSpots);
  };

  const resetAllSpots = () => {
    const resetSpots = spots.map(spot => ({
      ...spot,
      status: 'libre',
      occupiedSince: null,
      toleranceEnd: null,
    }));
    onSpotUpdate(resetSpots);
  };

  const getStatusCounts = () => {
    const libre = spots.filter(spot => spot.status === 'libre').length;
    const ocupado = spots.filter(spot => spot.status === 'ocupado').length;
    const reservado = spots.filter(spot => spot.status === 'reservado').length;
    
    return { libre, ocupado, reservado };
  };

  const { libre, ocupado, reservado } = getStatusCounts();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Gestión de Estacionamiento</CardTitle>
          <Button 
            variant="outline" 
            onClick={resetAllSpots}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reiniciar Todo
          </Button>
        </div>
        
        {/* Status Summary */}
        <div className="flex gap-4 mt-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Libres: {libre}
          </Badge>
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Ocupados: {ocupado}
          </Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Reservados: {reservado}
          </Badge>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Filter className="h-4 w-4 text-gray-600" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los espacios</SelectItem>
              <SelectItem value="libres">Solo libres</SelectItem>
              <SelectItem value="ocupados">Solo ocupados</SelectItem>
              <SelectItem value="reservados">Solo reservados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
          {filteredSpots.map((spot) => (
            <ParkingSpot
              key={spot.id}
              spot={spot}
              onClick={() => handleSpotClick(spot.id)}
            />
          ))}
        </div>
        
        {filteredSpots.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay espacios que coincidan con el filtro seleccionado.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
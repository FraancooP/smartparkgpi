import { Car, Bike } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

export function FilterButtons() {
  const [selectedFilter, setSelectedFilter] = useState<'auto' | 'moto' | null>('auto');

  return (
    <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-20">
      <div className="flex space-x-3">
        <Button
          variant={selectedFilter === 'auto' ? 'default' : 'secondary'}
          onClick={() => setSelectedFilter(selectedFilter === 'auto' ? null : 'auto')}
          className="rounded-full h-10 px-6 bg-white/95 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Car className="h-4 w-4 mr-2" />
          Auto
        </Button>
        
        <Button
          variant={selectedFilter === 'moto' ? 'default' : 'secondary'}
          onClick={() => setSelectedFilter(selectedFilter === 'moto' ? null : 'moto')}
          className="rounded-full h-10 px-6 bg-white/95 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Bike className="h-4 w-4 mr-2" />
          Moto
        </Button>
      </div>
    </div>
  );
}
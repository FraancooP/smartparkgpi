import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ParkingCardProps {
  parking: {
    id: string;
    name: string;
    image: string;
    location: string;
    spaces: number;
    occupiedSpaces?: number;
  };
  onClick?: () => void;
}

export function ParkingCard({ parking, onClick }: ParkingCardProps) {
  const occupiedSpaces = parking.occupiedSpaces || Math.floor(Math.random() * parking.spaces);
  const availableSpaces = parking.spaces - occupiedSpaces;
  const occupancyRate = Math.round((occupiedSpaces / parking.spaces) * 100);

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white border-green-100 hover:border-green-300"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <ImageWithFallback
            src={parking.image}
            alt={parking.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span className={`text-sm ${occupancyRate > 80 ? 'text-red-600' : occupancyRate > 50 ? 'text-orange-600' : 'text-green-600'}`}>
              {occupancyRate}% ocupado
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="mb-2 text-slate-800 group-hover:text-green-700 transition-colors">
            {parking.name}
          </h3>
          <p className="text-sm text-slate-600 mb-2">{parking.location}</p>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">{parking.spaces} plazas totales</span>
            <span className={`${availableSpaces > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {availableSpaces} disponibles
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
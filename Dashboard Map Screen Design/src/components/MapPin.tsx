import { ImageWithFallback } from './figma/ImageWithFallback';

interface MapPinProps {
  imageUrl: string;
  color: 'red' | 'green' | 'yellow';
  position: { top: string; left: string };
  onClick?: () => void;
}

export function MapPin({ imageUrl, color, position, onClick }: MapPinProps) {
  const colorClasses = {
    red: 'border-red-800 shadow-red-800/30',
    green: 'border-green-800 shadow-green-800/30', 
    yellow: 'border-yellow-700 shadow-yellow-700/30'
  };

  return (
    <div 
      className="absolute z-10 transform -translate-x-1/2 -translate-y-full cursor-pointer"
      style={{ top: position.top, left: position.left }}
      onClick={onClick}
    >
      {/* Gota invertida */}
      <div className="relative hover:scale-110 transition-transform duration-200">
        {/* Contenedor de la imagen circular */}
        <div className={`w-12 h-12 rounded-full border-4 ${colorClasses[color]} shadow-lg overflow-hidden bg-white hover:shadow-xl`}>
          <ImageWithFallback
            src={imageUrl}
            alt="Pin de ubicación"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Punta de la gota */}
        <div className={`absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent ${color === 'red' ? 'border-t-red-800' : color === 'green' ? 'border-t-green-800' : 'border-t-yellow-700'}`}></div>
      </div>
    </div>
  );
}
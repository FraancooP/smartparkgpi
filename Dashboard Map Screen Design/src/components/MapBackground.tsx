export function MapBackground() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-200">
      {/* Simulación de un mapa más realista */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" viewBox="0 0 800 600">
          {/* Calles principales - más anchas */}
          <rect x="0" y="295" width="800" height="10" fill="#9ca3af" opacity="0.6" />
          <rect x="395" y="0" width="10" height="600" fill="#9ca3af" opacity="0.6" />
          
          {/* Calles secundarias */}
          <rect x="0" y="145" width="800" height="6" fill="#9ca3af" opacity="0.4" />
          <rect x="0" y="445" width="800" height="6" fill="#9ca3af" opacity="0.4" />
          <rect x="195" y="0" width="6" height="600" fill="#9ca3af" opacity="0.4" />
          <rect x="595" y="0" width="6" height="600" fill="#9ca3af" opacity="0.4" />
          
          {/* Líneas de carriles en las calles */}
          <line x1="0" y1="300" x2="800" y2="300" stroke="#fff" strokeWidth="1" strokeDasharray="8,6" opacity="0.8" />
          <line x1="400" y1="0" x2="400" y2="600" stroke="#fff" strokeWidth="1" strokeDasharray="8,6" opacity="0.8" />
          
          {/* Ruta punteada desde ubicación buscada hasta estacionamiento más cercano */}
          <path 
            d="M 150 180 Q 250 220 330 260" 
            stroke="#3b82f6" 
            strokeWidth="3" 
            strokeDasharray="8,4" 
            fill="none" 
            opacity="0.8"
          />
          
          {/* Edificios y bloques urbanos */}
          <rect x="50" y="50" width="120" height="80" fill="#cbd5e1" opacity="0.7" rx="2" />
          <rect x="230" y="160" width="140" height="120" fill="#cbd5e1" opacity="0.7" rx="2" />
          <rect x="430" y="40" width="130" height="90" fill="#cbd5e1" opacity="0.7" rx="2" />
          <rect x="630" y="160" width="120" height="110" fill="#cbd5e1" opacity="0.7" rx="2" />
          <rect x="50" y="320" width="120" height="100" fill="#cbd5e1" opacity="0.7" rx="2" />
          <rect x="230" y="460" width="140" height="90" fill="#cbd5e1" opacity="0.7" rx="2" />
          <rect x="450" y="340" width="130" height="80" fill="#cbd5e1" opacity="0.7" rx="2" />
          <rect x="630" y="340" width="110" height="120" fill="#cbd5e1" opacity="0.7" rx="2" />
          
          {/* Parques y áreas verdes */}
          <circle cx="120" cy="200" r="25" fill="#84cc16" opacity="0.3" />
          <circle cx="680" cy="120" r="30" fill="#84cc16" opacity="0.3" />
          <rect x="300" y="350" width="80" height="60" fill="#84cc16" opacity="0.3" rx="5" />
          
          {/* Intersecciones */}
          <circle cx="200" cy="150" r="4" fill="#6b7280" opacity="0.5" />
          <circle cx="200" cy="300" r="4" fill="#6b7280" opacity="0.5" />
          <circle cx="200" cy="450" r="4" fill="#6b7280" opacity="0.5" />
          <circle cx="400" cy="150" r="4" fill="#6b7280" opacity="0.5" />
          <circle cx="400" cy="450" r="4" fill="#6b7280" opacity="0.5" />
          <circle cx="600" cy="150" r="4" fill="#6b7280" opacity="0.5" />
          <circle cx="600" cy="300" r="4" fill="#6b7280" opacity="0.5" />
          <circle cx="600" cy="450" r="4" fill="#6b7280" opacity="0.5" />
        </svg>
      </div>
      
      {/* Ícono de ubicación buscada */}
      <div className="absolute" style={{ top: '30%', left: '18.75%', transform: 'translate(-50%, -50%)' }}>
        <div className="relative">
          {/* Pin de ubicación */}
          <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          {/* Círculo de pulso */}
          <div className="absolute inset-0 w-6 h-6 bg-blue-500/30 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 w-8 h-8 -m-1 bg-blue-500/20 rounded-full animate-ping"></div>
        </div>
        
        {/* Etiqueta de ubicación buscada */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
          Destino buscado
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-blue-500"></div>
        </div>
      </div>

      {/* Información de tiempo y distancia */}
      <div className="absolute" style={{ top: '40%', left: '35%' }}>
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200">
          <div className="text-xs text-gray-600 text-center">
            <div className="font-semibold text-blue-600">3 min caminando</div>
            <div className="text-gray-500">200m • Estacionamiento más cercano</div>
          </div>
        </div>
      </div>
      
      {/* Overlay con textura de mapa */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-300/10"></div>
      
      {/* Patrón sutil para simular textura de mapa */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #64748b 1px, transparent 0)`,
        backgroundSize: '20px 20px'
      }}></div>
    </div>
  );
}
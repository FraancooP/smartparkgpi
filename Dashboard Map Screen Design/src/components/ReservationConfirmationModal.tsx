import { X, AlertTriangle, Download, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

interface ReservationConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  parkingName: string;
  reservationCode: string;
}

export function ReservationConfirmationModal({ 
  isOpen, 
  onClose, 
  parkingName, 
  reservationCode 
}: ReservationConfirmationModalProps) {
  if (!isOpen) return null;

  // Generar código QR simple usando una API de QR
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${reservationCode}&bgcolor=ffffff&color=000000&margin=10`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay con blur */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-600 to-green-500 p-6 text-white">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-3 mt-4">
            <CheckCircle className="h-8 w-8" />
            <div>
              <h2 className="text-xl font-semibold">Reserva registrada</h2>
              <h2 className="text-xl font-semibold">exitosamente</h2>
              <p className="text-green-100 text-sm mt-1">{parkingName}</p>
            </div>
          </div>
        </div>
        
        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Alerta de tolerancia */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-amber-800 font-medium">
                  ¡Recordá que tenés una tolerancia de 20 minutos!
                </p>
              </div>
            </div>
          </div>
          
          {/* Código QR */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <img 
                src={qrCodeUrl}
                alt="Código QR de reserva"
                className="w-48 h-48 object-contain"
              />
            </div>
            
            {/* Código de 9 dígitos */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Código de reserva</p>
              <p className="text-2xl font-mono font-semibold tracking-wider bg-muted/30 px-4 py-2 rounded-lg">
                {reservationCode}
              </p>
            </div>
          </div>
          
          {/* Botón de descarga */}
          <Button 
            variant="outline"
            className="w-full h-12 border-2 rounded-xl hover:bg-muted/50 flex items-center justify-center space-x-2"
            onClick={() => {
              // Crear un enlace temporal para descargar el QR
              const link = document.createElement('a');
              link.href = qrCodeUrl;
              link.download = `reserva-${reservationCode}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download className="h-4 w-4" />
            <span>Descargar Código QR y código</span>
          </Button>
          
          {/* Información adicional */}
          <div className="space-y-3 pt-2 border-t border-border/50">
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 mb-2">Instrucciones:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Presentá este código QR al llegar</li>
                <li>• Guardá el código como respaldo</li>
                <li>• Llegá dentro de los 20 minutos de tolerancia</li>
              </ul>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Reserva confirmada</span>
              <span>{new Date().toLocaleTimeString('es-AR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
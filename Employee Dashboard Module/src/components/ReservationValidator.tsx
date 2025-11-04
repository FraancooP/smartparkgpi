import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { QrCode, Hash, Camera, CheckCircle, XCircle, Scan } from 'lucide-react';

interface ReservationValidatorProps {
  onValidate: (code: string) => { isValid: boolean; reservation?: any };
}

export function ReservationValidator({ onValidate }: ReservationValidatorProps) {
  const [numericCode, setNumericCode] = useState('');
  const [qrResult, setQrResult] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleNumericValidation = () => {
    if (!numericCode.trim()) return;
    
    const result = onValidate(numericCode.trim());
    setValidationResult(result);
    
    if (result.isValid) {
      setNumericCode('');
    }
  };

  const startQRScanning = async () => {
    try {
      setIsScanning(true);
      
      // Simulate QR camera access (in a real app, you'd use a QR library like react-qr-reader)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Simulate QR scan result for demo
      setTimeout(() => {
        simulateQRScan();
      }, 2000);
    }
  };

  const stopQRScanning = () => {
    setIsScanning(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const simulateQRScan = () => {
    // Simulate scanning a QR code with reservation code
    const mockQRCodes = ['4567', '8901', '2345', 'INVALID123'];
    const randomCode = mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)];
    
    setQrResult(randomCode);
    const result = onValidate(randomCode);
    setValidationResult(result);
    stopQRScanning();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Validador de Reservas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="numeric" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="numeric" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Código Numérico
              </TabsTrigger>
              <TabsTrigger value="qr" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                Código QR
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="numeric" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="numeric-code">Ingrese el código de reserva</Label>
                <div className="flex gap-2">
                  <Input
                    id="numeric-code"
                    value={numericCode}
                    onChange={(e) => setNumericCode(e.target.value)}
                    placeholder="Ej: 4567"
                    onKeyPress={(e) => e.key === 'Enter' && handleNumericValidation()}
                  />
                  <Button onClick={handleNumericValidation} disabled={!numericCode.trim()}>
                    Validar
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="qr" className="space-y-4">
              <div className="text-center space-y-4">
                {!isScanning ? (
                  <div>
                    <Button onClick={startQRScanning} className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Iniciar Escaneo QR
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      Toque el botón para activar la cámara y escanear un código QR
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 border-2 border-white opacity-50 rounded-lg">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-48 h-48 border-2 border-white rounded-lg flex items-center justify-center">
                            <Scan className="h-8 w-8 text-white animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={simulateQRScan} variant="outline">
                        Simular Escaneo
                      </Button>
                      <Button onClick={stopQRScanning} variant="outline">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
                
                {qrResult && (
                  <div className="text-sm text-gray-600">
                    Último código escaneado: <span className="font-mono">{qrResult}</span>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Validation Result */}
      {validationResult && (
        <Card>
          <CardContent className="pt-6">
            {validationResult.isValid ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Reserva Válida</span>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Cliente:</span> {validationResult.reservation.customerName}
                    </div>
                    <div>
                      <span className="font-medium">Placa:</span> {validationResult.reservation.vehiclePlate}
                    </div>
                    <div>
                      <span className="font-medium">Código:</span> {validationResult.reservation.code}
                    </div>
                    <div>
                      <span className="font-medium">Duración:</span> {validationResult.reservation.duration} min
                    </div>
                  </div>
                  <div className="pt-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Reserva Confirmada
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Código Inválido</span>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-700">
                    El código ingresado no corresponde a ninguna reserva válida.
                    Verifique el código y vuelva a intentar.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instrucciones</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <p>• <strong>Código Numérico:</strong> Ingrese el código de 4 dígitos proporcionado al cliente</p>
          <p>• <strong>Código QR:</strong> Use la cámara para escanear el código QR del cliente</p>
          <p>• Una vez validada la reserva, proceda a asignar un espacio disponible</p>
          <p>• Los códigos de prueba válidos son: 4567, 8901, 2345</p>
        </CardContent>
      </Card>
    </div>
  );
}
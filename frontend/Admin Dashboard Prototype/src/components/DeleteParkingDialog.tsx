import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { AlertTriangle, Mail, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Parking {
  id: string;
  name: string;
  image: string;
  location: string;
  spaces: number;
  occupiedSpaces: number;
  rates: {
    moto: number;
    auto: number;
  };
  employees: number;
  revenue: number;
}

interface DeleteParkingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parking: Parking;
  onConfirm: () => void;
}

export function DeleteParkingDialog({ 
  open, 
  onOpenChange, 
  parking, 
  onConfirm 
}: DeleteParkingDialogProps) {
  const [step, setStep] = useState<'confirmation' | 'email-verification'>('confirmation');
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Email del administrador (simulado)
  const adminEmail = 'admin@estacionamiento.com';

  const handleInitialConfirm = () => {
    if (parking.occupiedSpaces > 0) {
      toast.error("No se puede eliminar: hay plazas ocupadas", {
        description: `Primero deben liberarse las ${parking.occupiedSpaces} plazas ocupadas.`
      });
      return;
    }
    setStep('email-verification');
  };

  const sendVerificationCode = async () => {
    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      toast.error("Email incorrecto", {
        description: "El email no coincide con el administrador registrado."
      });
      return;
    }

    setIsLoading(true);
    
    // Simular envío de código
    setTimeout(() => {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setSentCode(code);
      setIsLoading(false);
      
      toast.success("Código de verificación enviado", {
        description: `Revisa tu email: ${email}. Código: ${code} (para prueba)`
      });
    }, 2000);
  };

  const handleFinalConfirm = () => {
    if (confirmationCode.toUpperCase() !== sentCode) {
      toast.error("Código incorrecto", {
        description: "El código de verificación no es válido."
      });
      return;
    }

    onConfirm();
    handleCancel();
    
    toast.success("Estacionamiento eliminado", {
      description: `${parking.name} ha sido eliminado permanentemente.`
    });
  };

  const handleCancel = () => {
    setStep('confirmation');
    setEmail('');
    setConfirmationCode('');
    setSentCode('');
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            Eliminar Estacionamiento
          </DialogTitle>
          <DialogDescription>
            Esta acción eliminará permanentemente el estacionamiento y todos sus datos asociados. Se requiere verificación por email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'confirmation' && (
            <>
              {/* Advertencia principal */}
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-8 h-8 text-red-600 mt-1" />
                    <div>
                      <h3 className="text-red-800 mb-2">¡Atención! Esta acción es irreversible</h3>
                      <p className="text-red-700 text-sm leading-relaxed">
                        Estás a punto de eliminar permanentemente el estacionamiento "{parking.name}". 
                        Esta acción eliminará todos los datos asociados incluyendo historial de transacciones, 
                        empleados, configuraciones y estadísticas.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información del estacionamiento */}
              <div className="space-y-4">
                <h3 className="text-lg text-slate-800 border-b border-slate-200 pb-2">
                  Información del Estacionamiento a Eliminar
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-slate-600">Nombre</Label>
                      <p className="text-slate-800">{parking.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-slate-600">Ubicación</Label>
                      <p className="text-slate-800">{parking.location}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-slate-600">Empleados</Label>
                      <p className="text-slate-800">{parking.employees} empleados registrados</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-slate-600">Plazas Totales</Label>
                      <p className="text-slate-800">{parking.spaces} plazas</p>
                    </div>
                    <div>
                      <Label className="text-sm text-slate-600">Estado Actual</Label>
                      <div className="flex gap-2">
                        <Badge variant={parking.occupiedSpaces > 0 ? "destructive" : "default"}>
                          {parking.occupiedSpaces} ocupadas
                        </Badge>
                        <Badge variant="secondary">
                          {parking.spaces - parking.occupiedSpaces} disponibles
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-slate-600">Ingresos del Mes</Label>
                      <p className="text-slate-800">${parking.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Validación de plazas ocupadas */}
              {parking.occupiedSpaces > 0 && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="text-amber-800 mb-1">No se puede eliminar</h4>
                      <p className="text-sm text-amber-700">
                        El estacionamiento tiene {parking.occupiedSpaces} plazas ocupadas. 
                        Primero deben liberarse todas las plazas antes de poder eliminarlo.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Consecuencias */}
              <div className="space-y-3">
                <h4 className="text-slate-800">Datos que se eliminarán permanentemente:</h4>
                <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
                  <li>Toda la información del estacionamiento</li>
                  <li>Historial completo de transacciones y pagos</li>
                  <li>Datos de {parking.employees} empleados asociados</li>
                  <li>Estadísticas e informes históricos</li>
                  <li>Configuraciones de tarifas y métodos de pago</li>
                  <li>Imágenes y documentos asociados</li>
                </ul>
              </div>

              <Separator />

              {/* Botones de acción */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleInitialConfirm}
                  disabled={parking.occupiedSpaces > 0}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Continuar con Eliminación
                </Button>
              </div>
            </>
          )}

          {step === 'email-verification' && (
            <>
              {/* Verificación por email */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Shield className="w-8 h-8 text-blue-600 mt-1" />
                    <div>
                      <h3 className="text-blue-800 mb-2">Verificación de Seguridad</h3>
                      <p className="text-blue-700 text-sm leading-relaxed">
                        Para confirmar la eliminación del estacionamiento, necesitamos verificar tu identidad 
                        mediante tu email de administrador.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email del Administrador</Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-blue-600" />
                    <Input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@estacionamiento.com"
                      className="pl-10 border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Email registrado: {adminEmail}
                  </p>
                </div>

                {!sentCode ? (
                  <Button
                    onClick={sendVerificationCode}
                    disabled={!email || isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>Enviando código...</>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Enviar Código de Verificación
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-4">
                        <p className="text-green-800 text-sm">
                          ✓ Código enviado a: {email}
                        </p>
                        <p className="text-green-700 text-xs mt-1">
                          Código de prueba: {sentCode}
                        </p>
                      </CardContent>
                    </Card>

                    <div className="space-y-2">
                      <Label htmlFor="verification-code">Código de Verificación</Label>
                      <Input
                        id="verification-code"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                        placeholder="Ingresa el código de 6 dígitos"
                        maxLength={6}
                        className="border-green-200 focus:border-green-400 text-center text-lg tracking-wider"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Botones de acción para verificación */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                {sentCode && (
                  <Button
                    onClick={handleFinalConfirm}
                    disabled={!confirmationCode || confirmationCode.length !== 6}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Confirmar Eliminación
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
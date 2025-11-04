import { useState } from 'react';
import { ArrowLeft, Bell, Shield, Palette, Globe, CreditCard, HelpCircle, FileText, LogOut, Moon, Sun, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [locationAccess, setLocationAccess] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  return (
    <div className="min-h-screen bg-background overflow-y-auto pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="hover:bg-accent/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Configuración</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Cuenta y Perfil */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-blue-400" />
              Cuenta y Privacidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Verificación en dos pasos</p>
                <p className="text-sm text-muted-foreground">
                  Protege tu cuenta con autenticación adicional
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
            
            <Separator className="bg-border/50" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Acceso a ubicación</p>
                <p className="text-sm text-muted-foreground">
                  Para encontrar estacionamientos cercanos
                </p>
              </div>
              <Switch 
                checked={locationAccess} 
                onCheckedChange={setLocationAccess}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-green-400" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Notificaciones push</p>
                <p className="text-sm text-muted-foreground">
                  Recibe alertas de reservas y ofertas
                </p>
              </div>
              <Switch 
                checked={notifications} 
                onCheckedChange={setNotifications}
              />
            </div>
            
            <Separator className="bg-border/50" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Efectos de sonido</p>
                <p className="text-sm text-muted-foreground">
                  Sonidos de confirmación y alertas
                </p>
              </div>
              <Switch 
                checked={soundEffects} 
                onCheckedChange={setSoundEffects}
              />
            </div>
            
            <Separator className="bg-border/50" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Recordatorios de tiempo</p>
                <p className="text-sm text-muted-foreground">
                  Te avisamos antes de que expire tu reserva
                </p>
              </div>
              <Button variant="outline" size="sm">
                15 min antes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Apariencia */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-purple-400" />
              Apariencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Modo oscuro</p>
                <p className="text-sm text-muted-foreground">
                  Tema oscuro para mayor comodidad visual
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode}
                />
                <Moon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <Separator className="bg-border/50" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Idioma</p>
                <p className="text-sm text-muted-foreground">
                  Cambiar idioma de la aplicación
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                Español
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pagos y Facturación */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-yellow-400" />
              Pagos y Facturación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Métodos de pago</p>
                <p className="text-sm text-muted-foreground">
                  Gestionar tarjetas y métodos de pago
                </p>
              </div>
              <Button variant="outline" size="sm">
                Gestionar
              </Button>
            </div>
            
            <Separator className="bg-border/50" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Historial de pagos</p>
                <p className="text-sm text-muted-foreground">
                  Ver todas tus transacciones
                </p>
              </div>
              <Button variant="outline" size="sm">
                Ver historial
              </Button>
            </div>
            
            <Separator className="bg-border/50" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Recarga automática</p>
                <p className="text-sm text-muted-foreground">
                  Recargar saldo cuando esté bajo
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Ayuda y Soporte */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="h-5 w-5 text-cyan-400" />
              Ayuda y Soporte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Centro de ayuda</p>
                <p className="text-sm text-muted-foreground">
                  Preguntas frecuentes y guías
                </p>
              </div>
              <Button variant="outline" size="sm">
                Abrir
              </Button>
            </div>
            
            <Separator className="bg-border/50" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Contactar soporte</p>
                <p className="text-sm text-muted-foreground">
                  Chat en vivo y asistencia técnica
                </p>
              </div>
              <Button variant="outline" size="sm">
                Contactar
              </Button>
            </div>
            
            <Separator className="bg-border/50" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">Términos y condiciones</p>
                <p className="text-sm text-muted-foreground">
                  Política de privacidad y términos de uso
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                Ver
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Información de la App */}
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">ParkEasy App</p>
              <p className="text-sm text-muted-foreground">Versión 2.1.0</p>
              <p className="text-xs text-muted-foreground">
                © 2024 ParkEasy. Todos los derechos reservados.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cerrar Sesión */}
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="pt-6">
            <Button 
              variant="destructive" 
              className="w-full gap-2"
              size="lg"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
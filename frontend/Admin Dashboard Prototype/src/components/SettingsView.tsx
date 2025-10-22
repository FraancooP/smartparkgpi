import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Trash2,
  AlertTriangle
} from "lucide-react";

export function SettingsView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl text-slate-800">Configuración</h1>
          <p className="text-slate-600">Personaliza tu experiencia y gestiona la configuración del sistema</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notificaciones */}
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3">
                <Bell className="w-6 h-6" />
                Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-slate-500">Recibir alertas importantes por correo</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Alertas de Ocupación</Label>
                    <p className="text-sm text-slate-500">Notificar cuando se alcance el 90% de ocupación</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Reportes Semanales</Label>
                    <p className="text-sm text-slate-500">Resumen semanal de actividad</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Notificaciones Push</Label>
                    <p className="text-sm text-slate-500">Alertas en tiempo real en el navegador</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seguridad */}
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3">
                <Shield className="w-6 h-6" />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Autenticación de Dos Factores</Label>
                    <p className="text-sm text-slate-500">Seguridad adicional para tu cuenta</p>
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    Configurar
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Sesiones Activas</Label>
                    <p className="text-sm text-slate-500">Gestionar dispositivos conectados</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Sesiones
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Cambiar Contraseña</Label>
                    <p className="text-sm text-slate-500">Actualizar credenciales de acceso</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Cambiar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Apariencia */}
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3">
                <Palette className="w-6 h-6" />
                Apariencia
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <Select defaultValue="light">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Oscuro</SelectItem>
                      <SelectItem value="auto">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tamaño de Fuente</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pequeña</SelectItem>
                      <SelectItem value="medium">Mediana</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Animaciones</Label>
                    <p className="text-sm text-slate-500">Efectos visuales y transiciones</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sistema */}
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3">
                <Globe className="w-6 h-6" />
                Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select defaultValue="es">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Zona Horaria</Label>
                  <Select defaultValue="america-argentina">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-argentina">America/Argentina/Buenos_Aires</SelectItem>
                      <SelectItem value="america-sao_paulo">America/Sao_Paulo</SelectItem>
                      <SelectItem value="america-new_york">America/New_York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Actualizaciones Automáticas</Label>
                    <p className="text-sm text-slate-500">Instalar actualizaciones automáticamente</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sección de Datos y Respaldo */}
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-slate-800">
              <Download className="w-6 h-6" />
              Datos y Respaldo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-slate-700">Exportar Datos</h4>
                <p className="text-sm text-slate-500">
                  Descarga una copia de toda tu información de estacionamientos, empleados y transacciones.
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Datos
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="text-slate-700">Respaldo Automático</h4>
                <p className="text-sm text-slate-500">
                  Configura respaldos automáticos de tu información en la nube.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Respaldo activado</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zona Peligrosa */}
        <Card className="shadow-xl border-0 bg-white border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" />
              Zona Peligrosa
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Label className="text-red-700">Eliminar Cuenta</Label>
                  <p className="text-sm text-slate-500">
                    Esta acción eliminará permanentemente tu cuenta y todos los datos asociados. 
                    Esta acción no se puede deshacer.
                  </p>
                </div>
                <Button variant="destructive" className="ml-4">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar Cuenta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botón de Guardar Cambios */}
        <div className="flex justify-center">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3">
            <Settings className="w-4 h-4 mr-2" />
            Guardar Configuración
          </Button>
        </div>
      </div>
    </div>
  );
}
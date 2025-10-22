import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { User, Mail, Phone, MapPin, Calendar, Edit } from "lucide-react";

export function ProfileView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl text-slate-800">Mi Perfil</h1>
          <p className="text-slate-600">Gestiona tu información personal y configuración de cuenta</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información del Usuario */}
          <Card className="lg:col-span-2 shadow-xl border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3">
                <User className="w-6 h-6" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    defaultValue="Juan Carlos"
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    defaultValue="González"
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-purple-500" />
                  <Input
                    id="email"
                    type="email"
                    defaultValue="juan.gonzalez@email.com"
                    className="pl-10 border-purple-200 focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-purple-500" />
                  <Input
                    id="phone"
                    defaultValue="+54 11 1234-5678"
                    className="pl-10 border-purple-200 focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-purple-500" />
                  <Input
                    id="address"
                    defaultValue="Av. Corrientes 1234, CABA"
                    className="pl-10 border-purple-200 focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Actualizar Información
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tarjeta de Perfil */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white">
              <CardContent className="p-8 text-center space-y-6">
                <Avatar className="w-24 h-24 mx-auto border-4 border-purple-200">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xl">
                    JG
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="text-xl text-slate-800">Juan Carlos González</h3>
                  <p className="text-slate-600">Administrador</p>
                </div>

                <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                  Cuenta Activa
                </Badge>

                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" />
                  Miembro desde Enero 2024
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas rápidas */}
            <Card className="shadow-xl border-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h4 className="text-center">Resumen de Actividad</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Estacionamientos</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plazas Totales</span>
                      <span className="font-medium">405</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Empleados</span>
                      <span className="font-medium">12</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
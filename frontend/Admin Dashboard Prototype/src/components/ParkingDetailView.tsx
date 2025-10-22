import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  ArrowLeft, 
  Users, 
  Car, 
  Bike, 
  DollarSign, 
  TrendingUp,
  Edit,
  Trash2,
  Plus,
  Calendar
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { EditParkingInfoDialog } from "./EditParkingInfoDialog";
import { ManageEmployeesDialog } from "./ManageEmployeesDialog";
import { ManageSpacesDialog } from "./ManageSpacesDialog";
import { DeleteParkingDialog } from "./DeleteParkingDialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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

interface ParkingDetailViewProps {
  parking: Parking;
  onBack: () => void;
  onUpdate: (updatedParking: Parking) => void;
  onDelete: (parkingId: string) => void;
}

export function ParkingDetailView({ parking, onBack, onUpdate, onDelete }: ParkingDetailViewProps) {
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [showManageEmployees, setShowManageEmployees] = useState(false);
  const [showManageSpaces, setShowManageSpaces] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Datos simulados para gráficos
  const weeklyOccupancyData = [
    { day: 'Lun', autos: 45, motos: 23, total: 68 },
    { day: 'Mar', autos: 52, motos: 28, total: 80 },
    { day: 'Mié', autos: 48, motos: 25, total: 73 },
    { day: 'Jue', autos: 61, motos: 32, total: 93 },
    { day: 'Vie', autos: 67, motos: 35, total: 102 },
    { day: 'Sáb', autos: 39, motos: 18, total: 57 },
    { day: 'Dom', autos: 31, motos: 14, total: 45 }
  ];

  const revenueData = [
    { month: 'Ene', ingresos: 45000 },
    { month: 'Feb', ingresos: 52000 },
    { month: 'Mar', ingresos: 48000 },
    { month: 'Abr', ingresos: 61000 },
    { month: 'May', ingresos: 67000 },
    { month: 'Jun', ingresos: 59000 }
  ];

  const vehicleTypeData = [
    { name: 'Autos', value: 70, color: '#3b82f6' },
    { name: 'Motos', value: 30, color: '#10b981' }
  ];

  const occupancyRate = Math.round((parking.occupiedSpaces / parking.spaces) * 100);
  const availableSpaces = parking.spaces - parking.occupiedSpaces;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </Button>
            <div>
              <h1 className="text-3xl text-slate-800">{parking.name}</h1>
              <p className="text-slate-600">{parking.location}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowEditInfo(true)}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Información
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar Estacionamiento
            </Button>
          </div>
        </div>

        {/* Imagen del estacionamiento */}
        <Card className="overflow-hidden shadow-xl border-0">
          <div className="relative h-64">
            <ImageWithFallback
              src={parking.image}
              alt={parking.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-2xl mb-2">{parking.name}</h2>
              <div className="flex gap-4">
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  {parking.spaces} plazas totales
                </Badge>
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  {parking.occupiedSpaces} ocupadas
                </Badge>
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  {occupancyRate}% ocupación
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-blue-100">Plazas Ocupadas</p>
                <p className="text-2xl">{parking.occupiedSpaces}/{parking.spaces}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-green-100">Tasa de Ocupación</p>
                <p className="text-2xl">{occupancyRate}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-purple-100">Ingresos del Mes</p>
                <p className="text-2xl">${parking.revenue.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-orange-100">Empleados</p>
                <p className="text-2xl">{parking.employees}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pestañas principales */}
        <Tabs defaultValue="statistics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-blue-100">
            <TabsTrigger value="statistics" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Estadísticas
            </TabsTrigger>
            <TabsTrigger value="rates" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
              Tarifas
            </TabsTrigger>
            <TabsTrigger value="employees" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              Empleados
            </TabsTrigger>
            <TabsTrigger value="spaces" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              Gestión de Plazas
            </TabsTrigger>
          </TabsList>

          {/* Pestaña de Estadísticas */}
          <TabsContent value="statistics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de ocupación semanal */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Ocupación Semanal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyOccupancyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="day" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="autos" stackId="a" fill="#3b82f6" name="Autos" />
                        <Bar dataKey="motos" stackId="a" fill="#10b981" name="Motos" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Distribución por tipo de vehículo */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Car className="w-5 h-5 text-green-600" />
                    Distribución por Tipo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={vehicleTypeData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {vehicleTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de ingresos */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Ingresos Mensuales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="ingresos" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Tarifas */}
          <TabsContent value="rates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-xl border-0 border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Car className="w-5 h-5 text-blue-600" />
                    Tarifa para Autos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl text-blue-600">${parking.rates.auto}/hora</div>
                  <p className="text-slate-600">Tarifa actual para vehículos tipo auto</p>
                  <Button 
                    variant="outline" 
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={() => setShowEditInfo(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modificar Tarifa
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Bike className="w-5 h-5 text-green-600" />
                    Tarifa para Motos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl text-green-600">${parking.rates.moto}/hora</div>
                  <p className="text-slate-600">Tarifa actual para motocicletas</p>
                  <Button 
                    variant="outline" 
                    className="border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => setShowEditInfo(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modificar Tarifa
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Simulador de ingresos */}
            <Card className="shadow-xl border-0 bg-gradient-to-r from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="text-slate-800">Proyección de Ingresos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="text-2xl text-purple-600">
                      ${((parking.rates.auto * 8 + parking.rates.moto * 8) * 30).toLocaleString()}
                    </div>
                    <p className="text-sm text-slate-600">Ingresos Mensuales Estimados</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl text-purple-600">
                      ${((parking.rates.auto * 8 + parking.rates.moto * 8) * 7).toLocaleString()}
                    </div>
                    <p className="text-sm text-slate-600">Ingresos Semanales Estimados</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl text-purple-600">
                      ${(parking.rates.auto * 8 + parking.rates.moto * 8).toLocaleString()}
                    </div>
                    <p className="text-sm text-slate-600">Ingresos Diarios Estimados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Empleados */}
          <TabsContent value="employees" className="space-y-6">
            <Card className="shadow-xl border-0">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Users className="w-5 h-5 text-purple-600" />
                  Gestión de Empleados
                </CardTitle>
                <Button
                  onClick={() => setShowManageEmployees(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Gestionar Empleados
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="text-3xl text-purple-600 mb-2">{parking.employees}</div>
                    <p className="text-slate-600">Empleados Activos</p>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100">
                    <div className="text-3xl text-green-600 mb-2">8</div>
                    <p className="text-slate-600">Horas Promedio</p>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-3xl text-blue-600 mb-2">95%</div>
                    <p className="text-slate-600">Asistencia</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Gestión de Plazas */}
          <TabsContent value="spaces" className="space-y-6">
            <Card className="shadow-xl border-0">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Car className="w-5 h-5 text-orange-600" />
                  Gestión de Plazas
                </CardTitle>
                <Button
                  onClick={() => setShowManageSpaces(true)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modificar Plazas
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-3xl text-blue-600 mb-2">{parking.spaces}</div>
                    <p className="text-slate-600">Plazas Totales</p>
                  </div>
                  <div className="text-center p-6 bg-red-50 rounded-lg border border-red-100">
                    <div className="text-3xl text-red-600 mb-2">{parking.occupiedSpaces}</div>
                    <p className="text-slate-600">Plazas Ocupadas</p>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100">
                    <div className="text-3xl text-green-600 mb-2">{availableSpaces}</div>
                    <p className="text-slate-600">Plazas Disponibles</p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="text-3xl text-purple-600 mb-2">{occupancyRate}%</div>
                    <p className="text-slate-600">Ocupación</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Diálogos */}
        <EditParkingInfoDialog
          open={showEditInfo}
          onOpenChange={setShowEditInfo}
          parking={parking}
          onSave={onUpdate}
        />

        <ManageEmployeesDialog
          open={showManageEmployees}
          onOpenChange={setShowManageEmployees}
          parkingId={parking.id}
        />

        <ManageSpacesDialog
          open={showManageSpaces}
          onOpenChange={setShowManageSpaces}
          parking={parking}
          onSave={onUpdate}
        />

        <DeleteParkingDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          parking={parking}
          onConfirm={() => onDelete(parking.id)}
        />
      </div>
    </div>
  );
}
import { ArrowLeft, AlertTriangle, Phone, CreditCard, MapPin, MessageSquare, Star, Gift, Zap, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface QuickActionsProps {
  onClose: () => void;
}

export function QuickActions({ onClose }: QuickActionsProps) {
  const quickActions = [
    {
      title: "Reportar Problema",
      description: "Reporta incidencias en estacionamientos",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20"
    },
    {
      title: "Emergencia",
      description: "Contacto directo con seguridad",
      icon: Phone,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20"
    },
    {
      title: "Recargar Saldo",
      description: "Agregar fondos a tu cuenta",
      icon: CreditCard,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    },
    {
      title: "Buscar Estacionamiento",
      description: "Búsqueda avanzada por ubicación",
      icon: MapPin,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      title: "Chat con Soporte",
      description: "Asistencia en tiempo real",
      icon: MessageSquare,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      title: "Calificar Experiencia",
      description: "Comparte tu opinión",
      icon: Star,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20"
    }
  ];

  const promotions = [
    {
      title: "Descuento 20%",
      description: "En tu próxima reserva de más de 2 horas",
      icon: Gift,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/20",
      tag: "¡Oferta!"
    },
    {
      title: "Recarga Express",
      description: "Bono del 10% al recargar más de $5000",
      icon: Zap,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      tag: "Limitado"
    }
  ];

  const utilityActions = [
    {
      title: "Generar Factura",
      description: "Descarga facturas de tus reservas",
      icon: FileText,
      color: "text-gray-400",
      action: () => console.log("Generar factura")
    },
    {
      title: "Compartir App",
      description: "Invita amigos y obtén beneficios",
      icon: Gift,
      color: "text-indigo-400",
      action: () => console.log("Compartir app")
    }
  ];

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
          <h1 className="text-xl font-semibold">Acciones Rápidas</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Acciones de Emergencia */}
        <Card className="bg-red-500/5 border-red-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Acciones de Emergencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="destructive" 
              className="w-full justify-start gap-3 h-14"
              size="lg"
            >
              <AlertTriangle className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Reportar Problema</p>
                <p className="text-sm opacity-90">Incidencia en estacionamiento</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-14 border-orange-500/20 hover:bg-orange-500/10"
              size="lg"
            >
              <Phone className="h-5 w-5 text-orange-400" />
              <div className="text-left">
                <p className="font-medium">Contacto de Emergencia</p>
                <p className="text-sm text-muted-foreground">Llamada directa a seguridad</p>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Acciones Rápidas Principales */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Acciones Frecuentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <Card 
                  key={index}
                  className={`${action.bgColor} ${action.borderColor} hover:scale-105 transition-transform duration-200 cursor-pointer`}
                >
                  <CardContent className="p-4 text-center space-y-2">
                    <action.icon className={`h-8 w-8 mx-auto ${action.color}`} />
                    <div>
                      <p className="font-medium text-sm">{action.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {action.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Promociones Especiales */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gift className="h-5 w-5 text-pink-400" />
              Promociones Especiales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {promotions.map((promo, index) => (
              <Card key={index} className={`${promo.bgColor} ${promo.borderColor} relative overflow-hidden`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <promo.icon className={`h-8 w-8 ${promo.color}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{promo.title}</p>
                        {promo.tag && (
                          <span className="text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded-full">
                            {promo.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {promo.description}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Usar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Herramientas Útiles */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Herramientas Útiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {utilityActions.map((utility, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="w-full justify-start gap-3 h-14"
                size="lg"
                onClick={utility.action}
              >
                <utility.icon className={`h-5 w-5 ${utility.color}`} />
                <div className="text-left">
                  <p className="font-medium">{utility.title}</p>
                  <p className="text-sm text-muted-foreground">{utility.description}</p>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Estadísticas Rápidas */}
        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-400">Tu Resumen del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-400">24</p>
                <p className="text-xs text-muted-foreground">Reservas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">48h</p>
                <p className="text-xs text-muted-foreground">Tiempo total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">$2,850</p>
                <p className="text-xs text-muted-foreground">Gastado</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
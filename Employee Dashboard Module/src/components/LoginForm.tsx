import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { AlertCircle, Car } from 'lucide-react';
import { loginEmployee } from '../services/employeeService';

interface LoginFormProps {
  onLogin: (employee: any) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginEmployee(username, password);
      
      if (response.success) {
        // Guardar token y datos del empleado
        localStorage.setItem('smartpark_token', response.data.token);
        localStorage.setItem('smartpark_session_start', new Date().toISOString());
        
        // Pasar datos del empleado al componente padre
        onLogin(response.data.employee);
      } else {
        setError(response.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error de conexión. Intente nuevamente.');
      console.error('Login error:', error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Car className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">SmartPark</CardTitle>
          <p className="text-gray-600">Sistema de Empleados</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingrese su usuario"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                required
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
            <p className="font-medium mb-1">Usuarios de prueba:</p>
            <p>emp001 / 123456</p>
            <p>emp002 / 123456</p>
            <p>admin / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
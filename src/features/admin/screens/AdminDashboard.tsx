import React from 'react';
import { Card } from '@/ui/molecules/card';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Panel de Administrador
          </h1>
          <p className="text-muted-foreground">
            Bienvenido al panel de administración de Vett
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Gestión de Usuarios
            </h3>
            <p className="text-muted-foreground">
              Administrar dueños de mascotas y proveedores de servicios
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Analytics
            </h3>
            <p className="text-muted-foreground">
              Ver métricas y estadísticas de la plataforma
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Configuración
            </h3>
            <p className="text-muted-foreground">
              Configurar parámetros generales de la aplicación
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
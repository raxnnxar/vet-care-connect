import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';

export const AdminConfiguration: React.FC = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Configuración del Sistema
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 border rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">
              Notificaciones por Email
            </h4>
            <p className="text-sm text-muted-foreground">
              Configurar notificaciones automáticas del sistema
            </p>
          </div>
          <Button variant="outline" size="sm">
            Configurar
          </Button>
        </div>

        <div className="flex justify-between items-center p-4 border rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">
              Mantenimiento del Sistema
            </h4>
            <p className="text-sm text-muted-foreground">
              Herramientas de limpieza y optimización
            </p>
          </div>
          <Button variant="outline" size="sm">
            Acceder
          </Button>
        </div>

        <div className="flex justify-between items-center p-4 border rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">
              Respaldo de Datos
            </h4>
            <p className="text-sm text-muted-foreground">
              Configurar copias de seguridad automáticas
            </p>
          </div>
          <Button variant="outline" size="sm">
            Configurar
          </Button>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Nota:</strong> Las opciones de configuración avanzada estarán disponibles en futuras versiones.
          </p>
        </div>
      </div>
    </Card>
  );
};
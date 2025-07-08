import React from 'react';
import { Card } from '@/ui/molecules/card';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';

interface AdminStats {
  totalUsers: number;
  usersByRole: { [key: string]: number };
  totalPets: number;
  totalAppointments: number;
  weeklyAppointments: number;
}

interface AdminAnalyticsProps {
  stats: AdminStats | null;
  loading: boolean;
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin':
      return 'Administradores';
    case 'service_provider':
      return 'Proveedores';
    case 'pet_owner':
      return 'Dueños de Mascotas';
    default:
      return role;
  }
};

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({
  stats,
  loading,
}) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Analytics
        </h3>
        <p className="text-muted-foreground">
          No se pudieron cargar las estadísticas
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Resumen General
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.totalUsers}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Usuarios
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.totalPets}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Mascotas
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.totalAppointments}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Citas
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent1">
              {stats.weeklyAppointments}
            </div>
            <div className="text-sm text-muted-foreground">
              Citas Esta Semana
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Usuarios por Rol
        </h3>
        <div className="space-y-3">
          {Object.entries(stats.usersByRole).map(([role, count]) => (
            <div key={role} className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">
                {getRoleLabel(role)}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${(count / stats.totalUsers) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-foreground w-8 text-right">
                  {count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
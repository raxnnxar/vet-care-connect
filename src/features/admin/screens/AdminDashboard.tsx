
import React from 'react';
import { useAdminData } from '../hooks/useAdminData';
import { AdminAnalytics } from '../components/AdminAnalytics';
import { AdminUsersSection } from '../components/sections/AdminUsersSection';
import { AdminPetsSection } from '../components/sections/AdminPetsSection';
import { AdminAppointmentsSection } from '../components/sections/AdminAppointmentsSection';
import { AdminConfiguration } from '../components/AdminConfiguration';
import { Button } from '@/ui/atoms/button';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const { stats, users, pets, appointments, loading, error, updateUserRole, refreshData } = useAdminData();
  const { toast } = useToast();

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    const success = await updateUserRole(userId, newRole);
    if (success) {
      toast({
        title: "Rol actualizado",
        description: "El rol del usuario ha sido actualizado correctamente.",
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol del usuario.",
        variant: "destructive",
      });
    }
    return success;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Panel de Administrador
            </h1>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-destructive font-medium">Error: {error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={refreshData}
              >
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mobile-container mobile-padding">
      <div className="w-full">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Panel de Administrador
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Bienvenido al panel de administración de Vett
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={refreshData}
              disabled={loading}
              className="mobile-touch-target w-full sm:w-auto"
            >
              Actualizar Datos
            </Button>
          </div>
        </div>

        <div className="mobile-spacing">
          {/* Analytics Section */}
          <AdminAnalytics stats={stats} loading={loading} />

          {/* Users Management Section */}
          <AdminUsersSection users={users} loading={loading} />

          {/* Pets Management Section */}
          <AdminPetsSection pets={pets} loading={loading} />

          {/* Appointments Management Section */}
          <AdminAppointmentsSection appointments={appointments} loading={loading} />

          {/* Configuration Section */}
          <AdminConfiguration />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

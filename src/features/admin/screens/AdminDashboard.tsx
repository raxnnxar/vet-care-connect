import React from 'react';
import { useAdminData } from '../hooks/useAdminData';
import { AdminUserManagement } from '../components/AdminUserManagement';
import { AdminAnalytics } from '../components/AdminAnalytics';
import { AdminConfiguration } from '../components/AdminConfiguration';
import { Button } from '@/ui/atoms/button';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const { stats, users, loading, error, updateUserRole, refreshData } = useAdminData();
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Panel de Administrador
              </h1>
              <p className="text-muted-foreground">
                Bienvenido al panel de administración de Vett
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={refreshData}
              disabled={loading}
            >
              Actualizar Datos
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Analytics Section */}
          <AdminAnalytics stats={stats} loading={loading} />

          {/* User Management Section */}
          <AdminUserManagement 
            users={users} 
            loading={loading} 
            onUpdateUserRole={handleUpdateUserRole}
          />

          {/* Configuration Section */}
          <AdminConfiguration />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
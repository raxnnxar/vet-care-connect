
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ServiceCategoryGrid from '@/features/home/components/ServiceCategoryGrid';
import PetFriendlyMap from '@/features/home/components/PetFriendlyMap';

const OwnerDashboardScreen: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    console.log('OwnerDashboardScreen mounted with user:', user?.displayName);
  }, [user]);

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Bienvenido, {user?.displayName || 'Usuario'}
          </h1>
          <p className="text-muted-foreground">
            ¿Qué deseas hacer hoy?
          </p>
        </div>

        <div className="grid gap-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Servicios Populares</h2>
            <ServiceCategoryGrid />
          </section>

          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Lugares Pet-Friendly cercanos</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <PetFriendlyMap />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardScreen;

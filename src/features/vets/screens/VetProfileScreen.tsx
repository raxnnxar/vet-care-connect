
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { VeterinarianProfile } from '@/features/auth/types/veterinarianTypes';
import VetProfileForm from '@/features/auth/components/vet/VetProfileForm';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';
import { parseVetProfileData } from '@/features/auth/utils/vetProfileUtils';
import { updateVeterinarianProfile } from '@/features/auth/services/vetProfileService';

const VetProfileScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vetProfile, setVetProfile] = useState<VeterinarianProfile | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          fetchVetProfile(user.id);
        } else {
          // Redirect to login if not authenticated
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar la información del usuario",
          variant: "destructive",
        });
      }
    };

    fetchUser();
  }, [navigate, toast]);

  const fetchVetProfile = async (vetId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('veterinarians')
        .select('*')
        .eq('id', vetId)
        .single();

      if (error) {
        throw error;
      }

      // Use the utility function to parse the data
      const profile = parseVetProfileData(data);
      setVetProfile(profile);
    } catch (error) {
      console.error('Error fetching vet profile:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil veterinario",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = () => {
    setHasChanges(true);
  };

  const handleSubmit = async (data: VeterinarianProfile) => {
    if (!userId) return;
    
    setIsSubmitting(true);
    try {
      await updateVeterinarianProfile(userId, data);

      toast({
        title: "Cambios guardados",
        description: "Tu perfil ha sido actualizado correctamente",
      });
      
      setHasChanges(false);
    } catch (error: any) {
      console.error('Error updating vet profile:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el perfil",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LayoutBase
      header={
        <div className="bg-[#4DA6A8] px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-md">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20 p-1.5 mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-white font-medium text-lg">Mi Perfil Profesional</h1>
          </div>
          
          {hasChanges && (
            <Button 
              onClick={() => vetProfile && handleSubmit(vetProfile)}
              disabled={isSubmitting}
              className="bg-white text-[#4DA6A8] hover:bg-white/90 flex items-center text-sm px-3 py-1.5 h-auto"
              size="sm"
            >
              {isSubmitting ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <Save className="mr-1 h-4 w-4" />
                  Guardar
                </>
              )}
            </Button>
          )}
        </div>
      }
      footer={<NavbarInferior activeTab="profile" />}
    >
      <div className="pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <LoadingSpinner size="large" />
            <p className="text-gray-500 mt-4">Cargando perfil...</p>
          </div>
        ) : !vetProfile ? (
          <div className="flex flex-col items-center justify-center h-[70vh] p-4 text-center">
            <div className="bg-white rounded-xl shadow p-6 max-w-md">
              <h2 className="text-xl font-semibold text-[#4DA6A8] mb-2">Perfil no encontrado</h2>
              <p className="text-gray-600 mb-4">
                No se ha podido encontrar tu perfil veterinario. Por favor, contacta con soporte si este problema persiste.
              </p>
              <Button onClick={() => navigate('/vet')}>
                Volver al inicio
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <VetProfileForm
              initialData={vetProfile}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              userId={userId || ''}
              onChange={handleFormChange}
            />
          </div>
        )}
      </div>
    </LayoutBase>
  );
};

export default VetProfileScreen;

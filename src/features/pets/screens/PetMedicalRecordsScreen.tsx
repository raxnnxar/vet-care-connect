
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { ArrowLeft } from 'lucide-react';
import { Pet } from '@/features/pets/types';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';
import MedicalRecordTabs from '../components/medical/MedicalRecordTabs';

const PetMedicalRecordsScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Fetch pet data directly from Supabase
        const { data: petData, error: petError } = await supabase
          .from('pets')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (petError && petError.code !== 'PGRST116') {
          console.error('Error fetching pet:', petError);
        } else if (petData) {
          setPet(petData as Pet);
        }
      } catch (error) {
        console.error('Error fetching pet data:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar la información médica",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBack = () => {
    navigate(`/owner/pets/${id}`);
  };

  if (isLoading) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Expediente médico</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="profile" />}
      >
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      </LayoutBase>
    );
  }

  if (!pet) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Expediente médico</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="profile" />}
      >
        <div className="p-4">
          <Card className="p-4 text-center">
            <p>No se pudo encontrar la información de esta mascota.</p>
            <Button className="mt-4 bg-[#79D0B8]" onClick={() => navigate('/owner/profile')}>
              Volver al perfil
            </Button>
          </Card>
        </div>
      </LayoutBase>
    );
  }

  return (
    <LayoutBase
      header={
        <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
          <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
            <ArrowLeft />
          </Button>
          <h1 className="text-white font-medium text-lg ml-2">Expediente médico</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="profile" />}
    >
      <div className="p-4 pb-20 space-y-4">
        {/* Pet Info Header */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#79D0B8] rounded-full flex items-center justify-center overflow-hidden">
              {pet.profile_picture_url ? (
                <img 
                  src={pet.profile_picture_url} 
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-lg">
                  {pet.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{pet.name}</h2>
              <p className="text-sm text-gray-600">{pet.species} • {pet.breed || 'Raza no especificada'}</p>
            </div>
          </div>
        </Card>

        {/* Medical Records Tabs */}
        <MedicalRecordTabs petId={pet.id} petOwnerId={pet.owner_id} />
      </div>
    </LayoutBase>
  );
};

export default PetMedicalRecordsScreen;

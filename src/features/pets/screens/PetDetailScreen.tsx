
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { ArrowLeft, Edit, Trash2, Calendar, Heart } from 'lucide-react';
import { Pet } from '@/features/pets/types';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

const PetDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) {
        setError('ID de mascota no válido');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('pets')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }
        
        if (data) {
          setPet(data as Pet);
        } else {
          setError('No se pudo encontrar la mascota');
        }
      } catch (error) {
        console.error('Error fetching pet details:', error);
        setError('Error al cargar los detalles de la mascota');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPet();
  }, [id]); // Solo dependemos del ID, no de funciones que cambien

  const handleDeletePet = async () => {
    if (!id || !pet) return;
    
    if (!window.confirm(`¿Estás seguro de que quieres eliminar a ${pet.name}?`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      uiToast({
        title: "Éxito",
        description: "Mascota eliminada exitosamente",
      });
      navigate('/owner/profile');
    } catch (error) {
      console.error('Error deleting pet:', error);
      uiToast({
        title: "Error",
        description: "No se pudo eliminar la mascota",
        variant: "destructive"
      });
    }
  };

  const handleEditPet = () => {
    navigate(`/owner/pets/${id}/edit`);
  };

  const handleBookAppointment = () => {
    navigate('/owner/find-vets');
  };

  const handleViewMedicalInfo = () => {
    navigate(`/owner/pets/${id}/medical-records`);
  };

  const goBack = () => {
    navigate('/owner/profile');
  };

  // Helper function to calculate age
  const calculateAge = (dateOfBirth: string): string => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
    }
    
    if (years === 0) {
      const monthsAge = months < 0 ? 12 + months : months;
      return `${monthsAge} meses`;
    }
    
    return `${years} años`;
  };

  // Loading state
  if (isLoading) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Detalles de la Mascota</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="profile" />}
      >
        <div className="p-4 space-y-4">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </LayoutBase>
    );
  }

  // Error state
  if (error || !pet) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Error</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="profile" />}
      >
        <div className="p-4">
          <Card className="p-6 text-center">
            <p className="text-gray-600 mb-4">{error || 'No se pudo encontrar la información de esta mascota.'}</p>
            <Button className="bg-[#79D0B8] hover:bg-[#5FBFB3]" onClick={goBack}>
              Volver al perfil
            </Button>
          </Card>
        </div>
      </LayoutBase>
    );
  }

  const petAge = pet.date_of_birth ? calculateAge(pet.date_of_birth) : 'No especificada';
  const petDescription = pet.additional_notes || 'Sin descripción adicional';

  return (
    <LayoutBase
      header={
        <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
          <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
            <ArrowLeft />
          </Button>
          <h1 className="text-white font-medium text-lg ml-2">{pet.name}</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="profile" />}
    >
      <div className="mobile-container mobile-padding pb-20 mobile-spacing">
        {/* Pet Image */}
        <div className="relative">
          {pet.profile_picture_url ? (
            <div className="h-64 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={pet.profile_picture_url} 
                alt={pet.name} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-64 bg-gradient-to-br from-[#79D0B8] to-[#5FBFB3] rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-4xl">
                  {pet.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Pet Basic Info */}
        <Card className="p-6">
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">{pet.name}</h2>
          <p className="text-center text-gray-600 mb-6">
            {pet.species} {pet.breed && `• ${pet.breed}`}
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Edad</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{petAge}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Peso</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{pet.weight ? `${pet.weight} kg` : 'No especificado'}</p>
            </div>
            
            {pet.sex && (
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Sexo</p>
                <p className="text-lg font-semibold text-gray-800 mt-1 capitalize">{pet.sex}</p>
              </div>
            )}
            
            {pet.temperament && (
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Temperamento</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">{pet.temperament}</p>
              </div>
            )}
          </div>
          
          {petDescription !== 'Sin descripción adicional' && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Descripción</p>
              <p className="text-gray-700">{petDescription}</p>
            </div>
          )}
        </Card>

        {/* Medical Information Button */}
        <Card className="p-4">
          <Button 
            variant="outline" 
            className="w-full border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8]/10 h-12"
            onClick={handleViewMedicalInfo}
          >
            <Heart className="w-5 h-5 mr-2" />
            Ver información médica
          </Button>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            className="w-full bg-[#79D0B8] hover:bg-[#5FBFB3] h-12 text-lg font-medium"
            onClick={handleBookAppointment}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Agendar Cita
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8]/10 h-12"
              onClick={handleEditPet}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            
            <Button 
              variant="outline" 
              className="border-red-500 text-red-500 hover:bg-red-500/10 h-12"
              onClick={handleDeletePet}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </LayoutBase>
  );
};

export default PetDetailScreen;

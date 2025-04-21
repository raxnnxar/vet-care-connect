
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { ArrowLeft, Edit, Trash2, Calendar } from 'lucide-react';
import { usePets } from '@/features/pets/hooks/usePets';
import { PetType } from '@/features/pets/types';
import { useToast } from "@/hooks/use-toast";

const PetDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getPetById, deletePet } = usePets();
  const [pet, setPet] = useState<PetType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const petData = await getPetById(id);
        setPet(petData);
      } catch (error) {
        console.error('Error fetching pet details:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar los detalles de la mascota",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPet();
  }, [id, getPetById, toast]);

  const handleDeletePet = async () => {
    if (!id) return;
    try {
      await deletePet(id);
      toast({
        title: "Éxito",
        description: "Mascota eliminada exitosamente",
      });
      navigate('/owner/pets');
    } catch (error) {
      console.error('Error deleting pet:', error);
      toast({
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

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Cargando...</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="pets" />}
      >
        <div className="p-4 flex justify-center items-center h-full">
          <div className="animate-pulse flex flex-col w-full gap-4">
            <div className="h-48 bg-gray-200 rounded-lg w-full"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/4"></div>
          </div>
        </div>
      </LayoutBase>
    );
  }

  if (!pet) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Mascota no encontrada</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="pets" />}
      >
        <div className="p-4">
          <Card className="p-4 text-center">
            <p>No se pudo encontrar la información de esta mascota.</p>
            <Button className="mt-4 bg-[#79D0B8]" onClick={() => navigate('/owner/pets')}>
              Ver todas las mascotas
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
          <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
            <ArrowLeft />
          </Button>
          <h1 className="text-white font-medium text-lg ml-2">{pet.name}</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="pets" />}
    >
      <div className="p-4 pb-20">
        {/* Pet image */}
        <div className="mb-6">
          {pet.photo_url ? (
            <div className="h-64 rounded-lg overflow-hidden">
              <img 
                src={pet.photo_url} 
                alt={pet.name} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Sin foto</p>
            </div>
          )}
        </div>

        {/* Pet information */}
        <Card className="mb-4">
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">{pet.name}</h2>
            
            <div className="grid grid-cols-2 gap-y-3">
              <div>
                <p className="text-sm text-gray-500">Especie</p>
                <p>{pet.species}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Raza</p>
                <p>{pet.breed || 'No especificada'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Edad</p>
                <p>{pet.age || 'No especificada'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Peso</p>
                <p>{pet.weight ? `${pet.weight} kg` : 'No especificado'}</p>
              </div>
              
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Descripción</p>
                <p>{pet.description || 'Sin descripción'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 gap-4 mt-4">
          <Button 
            className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
            onClick={handleBookAppointment}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Agendar Cita
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1 border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8]/10"
              onClick={handleEditPet}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
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


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Pencil, ArrowLeft, Calendar, Trash2 } from 'lucide-react';
import { usePets } from '../hooks/usePets';
import { Pet } from '../types';
import { Card } from '@/ui/molecules/card';
import { Avatar } from '@/ui/atoms/avatar';
import { Skeleton } from '@/ui/atoms/skeleton';
import { toast } from 'sonner';

const PetDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPetById, deletePet } = usePets();
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const petData = await getPetById(id);
          setPet(petData);
        }
      } catch (error) {
        console.error('Error fetching pet details:', error);
        toast.error('Error al cargar detalles de la mascota');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPet();
  }, [id, getPetById]);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro que deseas eliminar esta mascota?')) {
      setIsDeleting(true);
      try {
        if (id) {
          await deletePet(id);
          toast.success('Mascota eliminada con éxito');
          navigate('/owner/pets');
        }
      } catch (error) {
        console.error('Error deleting pet:', error);
        toast.error('Error al eliminar la mascota');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditPet = () => {
    navigate(`/owner/pets/${id}/edit`);
  };

  const handleScheduleAppointment = () => {
    navigate('/owner/find-vets');
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <LayoutBase
      header={
        <div className="flex justify-between items-center px-4 py-3 bg-[#5FBFB3]">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={goBack} className="text-white mr-2">
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-white text-lg font-semibold">Detalles de Mascota</h1>
          </div>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="flex flex-col p-4 gap-6 pb-20">
        {isLoading ? (
          <PetDetailSkeleton />
        ) : pet ? (
          <>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-[#5FBFB3]">
                  {pet.imageUrl ? (
                    <img src={pet.imageUrl} alt={pet.name} className="object-cover" />
                  ) : (
                    <div className="bg-[#5FBFB3]/20 h-full w-full flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/053f0f17-f20a-466e-b7fe-5f6b4edbd41b.png" 
                        alt="Pet placeholder" 
                        className="h-8 w-8" 
                      />
                    </div>
                  )}
                </Avatar>
                <div>
                  <h2 className="text-2xl font-semibold">{pet.name}</h2>
                  <p className="text-gray-500">{pet.species}, {pet.breed}</p>
                </div>
              </div>
              <Button variant="outline" size="icon" onClick={handleEditPet}>
                <Pencil size={16} />
              </Button>
            </div>

            <Card className="p-4">
              <h3 className="font-medium mb-3">Información General</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Edad</span>
                  <span>{pet.age} años</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Género</span>
                  <span>{pet.gender === 'male' ? 'Macho' : 'Hembra'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Peso</span>
                  <span>{pet.weight} kg</span>
                </div>
                {pet.color && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Color</span>
                    <span>{pet.color}</span>
                  </div>
                )}
              </div>
            </Card>

            {pet.medicalHistory && (
              <Card className="p-4">
                <h3 className="font-medium mb-3">Historial Médico</h3>
                <p className="text-gray-700">{pet.medicalHistory}</p>
              </Card>
            )}

            <div className="flex flex-col gap-3 mt-4">
              <Button 
                className="bg-[#5FBFB3] hover:bg-[#4DA6A8]" 
                onClick={handleScheduleAppointment}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Programar Cita
              </Button>
              
              <Button 
                variant="destructive" 
                disabled={isDeleting} 
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? 'Eliminando...' : 'Eliminar Mascota'}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-8">
            <p className="text-gray-500 mb-4">Mascota no encontrada</p>
            <Button onClick={() => navigate('/owner/pets')}>
              Ver todas mis mascotas
            </Button>
          </div>
        )}
      </div>
    </LayoutBase>
  );
};

const PetDetailSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      
      <Card className="p-4">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-20 w-full" />
      </Card>
    </div>
  );
};

export default PetDetailScreen;


import React, { useState, useEffect } from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { ArrowLeft, MapPin, Phone, Mail, Calendar, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/ui/atoms/skeleton';
import { toast } from 'sonner';

// Create translateSpecialization function here instead of importing it
const translateSpecialization = (code: string): string => {
  const specializations = {
    'surgery': 'Cirugía',
    'dermatology': 'Dermatología',
    'internal_medicine': 'Medicina interna',
    'cardiology': 'Cardiología',
    'oncology': 'Oncología',
    'neurology': 'Neurología',
    'ophthalmology': 'Oftalmología',
    'dentistry': 'Odontología',
    'nutrition': 'Nutrición',
    'behavior': 'Comportamiento',
    'emergency': 'Emergencias'
  };
  
  return specializations[code] || code.charAt(0).toUpperCase() + code.slice(1).replace('_', ' ');
};

const VetDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [vetData, setVetData] = useState<any>(null);

  const fetchVetDetails = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('veterinarians')
        .select(`
          *,
          profile:profiles(first_name, last_name, email, address)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setVetData({
          ...data,
          fullName: data.profile && typeof data.profile === 'object' ? 
            `${data.profile.first_name || ''} ${data.profile.last_name || ''}`.trim() : 'Veterinario',
          imageUrl: data.profile_image_url || 'https://randomuser.me/api/portraits/lego/1.jpg',
          specializations: Array.isArray(data.specialization) ? 
            data.specialization.map(translateSpecialization) : []
        });
      }
    } catch (error) {
      console.error('Error fetching veterinarian details:', error);
      toast.error('Error al cargar los detalles del veterinario');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVetDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleBookAppointment = () => {
    navigate(`/owner/appointments/book/${id}`);
  };

  if (isLoading) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center p-4 bg-[#79D0B8]">
            <Button 
              variant="ghost" 
              className="text-white p-1 mr-2" 
              onClick={handleGoBack}
            >
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-xl font-medium text-white">Perfil del Veterinario</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="home" />}
      >
        <div className="p-4 pb-20 space-y-6">
          <Card className="mb-6">
            <div className="p-4 flex items-center">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="ml-4 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </Card>
          <Card className="mb-6">
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-24 w-full" />
            </div>
          </Card>
          <Card className="mb-6">
            <div className="p-4 space-y-4">
              <Skeleton className="h-5 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </Card>
        </div>
      </LayoutBase>
    );
  }

  if (!vetData) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center p-4 bg-[#79D0B8]">
            <Button 
              variant="ghost" 
              className="text-white p-1 mr-2" 
              onClick={handleGoBack}
            >
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-xl font-medium text-white">Perfil del Veterinario</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="home" />}
      >
        <div className="p-4 flex items-center justify-center h-full">
          <p className="text-gray-500">No se encontró información del veterinario</p>
        </div>
      </LayoutBase>
    );
  }

  return (
    <LayoutBase
      header={
        <div className="flex items-center p-4 bg-[#79D0B8]">
          <Button 
            variant="ghost" 
            className="text-white p-1 mr-2" 
            onClick={handleGoBack}
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-xl font-medium text-white">Perfil del Veterinario</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4 pb-20">
        <Card className="mb-6">
          <div className="p-4 flex items-center">
            <Avatar className="h-24 w-24 border-2 border-[#79D0B8]">
              {vetData.imageUrl ? (
                <AvatarImage src={vetData.imageUrl} alt={vetData.fullName} />
              ) : (
                <AvatarFallback className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                  {vetData.fullName.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{vetData.fullName}</h2>
              <p className="text-gray-600">
                {vetData.specializations?.join(', ') || 'Veterinario General'}
              </p>
              
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={(vetData.average_rating && star <= Math.round(vetData.average_rating)) 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-600">
                  {vetData.average_rating?.toFixed(1) || 'N/A'} ({vetData.total_reviews || 0} reseñas)
                </span>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="mb-6">
          <div className="p-4">
            <h3 className="font-medium text-lg mb-3">Acerca de</h3>
            <p className="text-gray-600">
              {vetData.bio || 
                `Veterinario con ${vetData.years_of_experience || 'varios'} años de experiencia en el cuidado de mascotas.`}
            </p>
          </div>
        </Card>
        
        <Card className="mb-6">
          <div className="p-4">
            <h3 className="font-medium text-lg mb-3">Contacto</h3>
            
            <div className="space-y-3">
              {vetData.profile?.address && (
                <div className="flex items-center">
                  <MapPin className="text-[#79D0B8] mr-3" size={20} />
                  <span>{vetData.profile.address}</span>
                </div>
              )}
              
              {vetData.profile?.phone_number && (
                <div className="flex items-center">
                  <Phone className="text-[#79D0B8] mr-3" size={20} />
                  <span>{vetData.profile.phone_number}</span>
                </div>
              )}
              
              {vetData.profile?.email && (
                <div className="flex items-center">
                  <Mail className="text-[#79D0B8] mr-3" size={20} />
                  <span>{vetData.profile.email}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
        
        <Button 
          onClick={handleBookAppointment}
          className="w-full bg-[#79D0B8] hover:bg-[#68BBA3] py-3"
        >
          <Calendar className="mr-2" size={20} />
          Agendar Cita
        </Button>
      </div>
    </LayoutBase>
  );
};

export default VetDetailScreen;

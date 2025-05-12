import React, { useEffect, useState } from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { ArrowLeft, MapPin, Phone, Mail, Calendar, Star, MessageCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';
import { supabase } from '@/integrations/supabase/client';
import { parseSpecializations } from '@/features/auth/utils/vetProfileUtils';

// Helper function to translate specialization to human-readable format
const translateSpecialization = (spec: string): string => {
  const translations: Record<string, string> = {
    'cardiology': 'Cardiología',
    'dermatology': 'Dermatología',
    'orthopedics': 'Ortopedia',
    'neurology': 'Neurología',
    'ophthalmology': 'Oftalmología',
    'oncology': 'Oncología',
    'general': 'Medicina General',
    'surgery': 'Cirugía',
    'dentistry': 'Odontología',
    'nutrition': 'Nutrición',
    'internal_medicine': 'Medicina Interna',
    'emergency': 'Emergencias',
    'rehabilitation': 'Rehabilitación',
    'exotics': 'Animales Exóticos',
    // Add more translations as needed
  };
  
  return translations[spec.toLowerCase()] || spec;
};

const VetDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVetDetails = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('veterinarians')
          .select(`
            *,
            profiles:id(
              display_name,
              email
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        
        setData(data);
      } catch (error) {
        console.error('Error fetching veterinarian details:', error);
        setError('No se pudo cargar la información del veterinario');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVetDetails();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleBookAppointment = () => {
    navigate(`/owner/appointments/book/${id}`);
  };

  const handleReviewClick = () => {
    navigate(`/owner/vets/${id}/review`);
  };

  if (loading) {
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
            <h1 className="text-xl font-medium text-white">Cargando...</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="home" />}
      >
        <div className="p-4 flex justify-center items-center h-full">
          <p>Cargando información del veterinario...</p>
        </div>
      </LayoutBase>
    );
  }

  if (error || !data) {
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
            <h1 className="text-xl font-medium text-white">Error</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="home" />}
      >
        <div className="p-4">
          <p>{error || 'No se encontró información del veterinario'}</p>
          <Button onClick={handleGoBack} className="mt-4">
            Volver
          </Button>
        </div>
      </LayoutBase>
    );
  }

  // Format veterinarian name
  const vetName = data.profiles && data.profiles.display_name 
    ? data.profiles.display_name 
    : "Doctor(a)";

  // Format specialization
  const specializations = parseSpecializations(data.specialization);
  const formattedSpecializations = specializations.map(spec => 
    translateSpecialization(String(spec))
  ).join(', ');

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
              {data.profile_image_url ? (
                <AvatarImage src={data.profile_image_url} alt={vetName} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-[#79D0B8] text-white">
                  {vetName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{vetName}</h2>
              <p className="text-gray-600">{formattedSpecializations}</p>
              
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= (data.average_rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-600">
                  {data.average_rating?.toFixed(1) || "0.0"} ({data.total_reviews || 0} reseñas)
                </span>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="mb-6">
          <div className="p-4">
            <h3 className="font-medium text-lg mb-3">Acerca de</h3>
            <p className="text-gray-600">
              {data.bio || "Este veterinario no ha proporcionado información adicional."}
            </p>
          </div>
        </Card>
        
        <Card className="mb-6">
          <div className="p-4">
            <h3 className="font-medium text-lg mb-3">Contacto</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="text-[#79D0B8] mr-3" size={20} />
                <span>Dirección no disponible</span>
              </div>
              
              <div className="flex items-center">
                <Phone className="text-[#79D0B8] mr-3" size={20} />
                <span>Teléfono no disponible</span>
              </div>
              
              <div className="flex items-center">
                <Mail className="text-[#79D0B8] mr-3" size={20} />
                <span>{data.profile?.email || "Email no disponible"}</span>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={handleBookAppointment}
            className="bg-[#79D0B8] hover:bg-[#68BBA3] py-3"
          >
            <Calendar className="mr-2" size={20} />
            Agendar Cita
          </Button>
          
          <Button 
            onClick={handleReviewClick}
            variant="outline" 
            className="border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8]/10 py-3"
          >
            <MessageCircle className="mr-2" size={20} />
            Calificar
          </Button>
        </div>
      </div>
    </LayoutBase>
  );
};

export default VetDetailScreen;

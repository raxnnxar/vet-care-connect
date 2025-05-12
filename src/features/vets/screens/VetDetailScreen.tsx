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

// Helper function to format animals treated 
const formatAnimalsTreated = (animals: string[]) => {
  if (!animals || animals.length === 0) {
    return "Animales domésticos";
  }
  
  return animals.join(', ');
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
            id,
            specialization,
            profile_image_url,
            average_rating,
            total_reviews,
            bio,
            animals_treated,
            profiles (
              first_name,
              last_name,
              email
            )
          `)
          .eq('id', id)
          .maybeSingle();

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

  // Generate initials for the avatar
  const getInitials = (firstName?: string, lastName?: string) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
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

  if (data) {
    // Format veterinarian name using profile data
    const firstName = data.profiles?.first_name || '';
    const lastName = data.profiles?.last_name || '';
    
    const vetName = firstName || lastName 
      ? `Dr${firstName.toLowerCase().endsWith('a') ? 'a' : ''}. ${firstName} ${lastName}`.trim()
      : `Dr. ${data.id.substring(0, 5)}`;

    // Format specialization
    const specializations = parseSpecializations(data.specialization);
    const formattedSpecializations = specializations.map(spec => 
      translateSpecialization(String(spec))
    ).join(', ');

    // Format animals treated
    let animalsTreated: string[] = [];
    if (data.animals_treated) {
      try {
        if (Array.isArray(data.animals_treated)) {
          animalsTreated = data.animals_treated.map((a: any) => String(a));
        } else {
          const parsed = typeof data.animals_treated === 'string'
            ? JSON.parse(data.animals_treated)
            : data.animals_treated;
          animalsTreated = Array.isArray(parsed) ? parsed.map((a: any) => String(a)) : [];
        }
      } catch (e) {
        console.error("Error parsing animals treated:", e);
        animalsTreated = [];
      }
    }
    
    const formattedAnimalsTreated = formatAnimalsTreated(animalsTreated);

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
                    {getInitials(firstName, lastName)}
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
                
                {animalsTreated.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Trata: {formattedAnimalsTreated}
                  </p>
                )}
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
                  <span>{data.profiles?.email || "Email no disponible"}</span>
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
};

export default VetDetailScreen;

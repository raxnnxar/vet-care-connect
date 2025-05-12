
import React, { useEffect, useState } from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { supabase } from '@/integrations/supabase/client';
import { getInitials } from '../utils/vetDetailUtils';

// Import our new components
import VetProfileHeader from '../components/detail/VetProfileHeader';
import VetAboutSection from '../components/detail/VetAboutSection';
import VetContactSection from '../components/detail/VetContactSection';
import VetActionButtons from '../components/detail/VetActionButtons';
import LoadingState from '../components/detail/LoadingState';
import ErrorState from '../components/detail/ErrorState';

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
            service_providers (
              business_name,
              provider_type,
              profiles (
                display_name,
                email
              )
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

  // Create header component for all states
  const Header = () => (
    <div className="flex items-center p-4 bg-[#79D0B8]">
      <Button 
        variant="ghost" 
        className="text-white p-1 mr-2" 
        onClick={handleGoBack}
      >
        <ArrowLeft size={24} />
      </Button>
      <h1 className="text-xl font-medium text-white">
        {loading ? "Cargando..." : error ? "Error" : "Perfil del Veterinario"}
      </h1>
    </div>
  );

  if (loading) {
    return (
      <LayoutBase
        header={<Header />}
        footer={<NavbarInferior activeTab="home" />}
      >
        <LoadingState />
      </LayoutBase>
    );
  }

  if (error || !data) {
    return (
      <LayoutBase
        header={<Header />}
        footer={<NavbarInferior activeTab="home" />}
      >
        <ErrorState message={error} onGoBack={handleGoBack} />
      </LayoutBase>
    );
  }

  if (data) {
    // Format veterinarian name using display_name from profiles
    const displayName = data.service_providers?.profiles?.display_name || data.service_providers?.business_name || '';
    
    // For gendered prefix (Dr/Dra), we'll check if the name seems feminine (ends with 'a')
    const firstNameEndsWithA = displayName.split(' ')[0].toLowerCase().endsWith('a');
    const vetName = displayName 
      ? `Dr${firstNameEndsWithA ? 'a' : ''}. ${displayName}`.trim()
      : `Dr. ${data.id.substring(0, 5)}`;

    return (
      <LayoutBase
        header={<Header />}
        footer={<NavbarInferior activeTab="home" />}
      >
        <div className="p-4 pb-20">
          <Card className="mb-6">
            <VetProfileHeader 
              data={data} 
              displayName={vetName} 
              getInitials={getInitials} 
            />
          </Card>
          
          <Card className="mb-6">
            <VetAboutSection bio={data.bio} />
          </Card>
          
          <Card className="mb-6">
            <VetContactSection email={data.service_providers?.profiles?.email} />
          </Card>
          
          <VetActionButtons 
            onBookAppointment={handleBookAppointment}
            onReviewClick={handleReviewClick}
          />
        </div>
      </LayoutBase>
    );
  }

  return (
    <LayoutBase
      header={<Header />}
      footer={<NavbarInferior activeTab="home" />}
    >
      <LoadingState />
    </LayoutBase>
  );
};

export default VetDetailScreen;

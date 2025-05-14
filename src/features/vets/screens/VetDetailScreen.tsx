
import React, { useEffect, useState } from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/ui/atoms/button';
import { supabase } from '@/integrations/supabase/client';
import { getInitials, translateSpecialization, formatAnimalsTreated } from '../utils/vetDetailUtils';

// Import our components
import VetProfileHero from '../components/detail/VetProfileHero';
import VetAboutSection from '../components/detail/VetAboutSection';
import VetContactSection from '../components/detail/VetContactSection';
import VetActionButtons from '../components/detail/VetActionButtons';
import LoadingState from '../components/detail/LoadingState';
import ErrorState from '../components/detail/ErrorState';
import VetEducationSection from '../components/detail/VetEducationSection';
import VetCertificationsSection from '../components/detail/VetCertificationsSection';
import VetServicesSection from '../components/detail/VetServicesSection';
import VetAnimalsTreatedSection from '../components/detail/VetAnimalsTreatedSection';

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
            education,
            certifications,
            services_offered,
            license_number,
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
        
        // Ensure services_offered is an array
        if (data) {
          data.services_offered = Array.isArray(data.services_offered) 
            ? data.services_offered 
            : [];
        }
        
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
    
    // Extract specializations and format them
    const specializations = Array.isArray(data.specialization) && data.specialization.length > 0
      ? data.specialization.map((spec: string) => translateSpecialization(spec)).join(', ')
      : 'Medicina General';
    
    return (
      <LayoutBase
        header={null}
        footer={<NavbarInferior activeTab="home" />}
      >
        {/* Back button that floats on top of the header */}
        <div className="absolute top-4 left-4 z-10">
          <Button 
            variant="ghost" 
            className="bg-white/20 text-white rounded-full p-2" 
            onClick={handleGoBack}
          >
            <ArrowLeft size={24} />
          </Button>
        </div>
        
        {/* New Hero Section */}
        <VetProfileHero 
          displayName={vetName}
          specializations={specializations}
          profileImageUrl={data.profile_image_url}
          averageRating={data.average_rating}
          totalReviews={data.total_reviews}
          licenseNumber={data.license_number}
          getInitials={getInitials}
        />
        
        <div className="p-4 pb-20 bg-gray-50">
          {/* Animals Treated Section */}
          <div className="mb-4">
            <VetAnimalsTreatedSection animals={data.animals_treated || []} />
          </div>
          
          {/* About Section */}
          <div className="mb-4">
            <VetAboutSection bio={data.bio} />
          </div>
          
          {/* Education Section */}
          <div className="mb-4">
            <VetEducationSection education={data.education || []} />
          </div>
          
          {/* Certifications Section */}
          <div className="mb-4">
            <VetCertificationsSection certifications={data.certifications || []} />
          </div>
          
          {/* Services Section */}
          <div className="mb-4">
            <VetServicesSection services={Array.isArray(data.services_offered) ? data.services_offered : []} />
          </div>
          
          {/* Contact Section */}
          <div className="mb-6">
            <VetContactSection email={data.service_providers?.profiles?.email} />
          </div>
          
          {/* Action Buttons */}
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

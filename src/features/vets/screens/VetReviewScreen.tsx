
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { Textarea } from '@/ui/atoms/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const VetReviewScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [vetName, setVetName] = useState<string>('');
  const [vetSpecialty, setVetSpecialty] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    // Cargar datos básicos del veterinario para mostrarlos en la pantalla
    const fetchVetDetails = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('veterinarians')
        .select(`
          profile_image_url,
          specialization,
          service_providers (
            profiles (
              display_name
            ),
            business_name
          )
        `)
        .eq('id', id)
        .single();
        
      if (!error && data) {
        const displayName = data.service_providers?.profiles?.display_name || 
                          data.service_providers?.business_name || 
                          'Veterinario';
        
        // Para el prefijo de género (Dr/Dra)
        const firstNameEndsWithA = displayName.split(' ')[0].toLowerCase().endsWith('a');
        setVetName(`Dr${firstNameEndsWithA ? 'a' : ''}. ${displayName}`);
        
        // Establecer especialidad
        const spec = Array.isArray(data.specialization) && data.specialization.length > 0
          ? data.specialization[0]
          : 'general';
        
        setVetSpecialty(translateSpecialization(spec));
        setProfileImage(data.profile_image_url);
      }
    };
    
    fetchVetDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Por favor selecciona una calificación",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error de autenticación",
          description: "Debes iniciar sesión para dejar una reseña",
          variant: "destructive",
        });
        return;
      }

      // Insert the review
      const { error } = await supabase.from('reviews').insert({
        veterinarian_id: id,
        pet_owner_id: user.id,
        rating,
        comment: comment.trim() || null
      });

      if (error) throw error;

      toast({
        title: "¡Gracias por tu reseña!",
        description: "Tu opinión es muy importante para nosotros.",
      });

      // Navigate back to vet profile
      navigate(`/owner/vets/${id}`);

    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error al enviar la reseña",
        description: "Ocurrió un error al enviar tu reseña. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Función para traducir especialidades
  function translateSpecialization(spec: string): string {
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
    };
    
    return translations[spec.toLowerCase()] || spec;
  }

  // Función para obtener iniciales de un nombre
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

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
          <h1 className="text-xl font-medium text-white">Calificar Veterinario</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4 pb-20 flex flex-col gap-6">
        {/* Información del veterinario */}
        <div className="flex items-center bg-white p-4 rounded-lg shadow-sm">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mr-4">
            {profileImage ? (
              <img src={profileImage} alt={vetName} className="w-full h-full object-cover" />
            ) : (
              <div className="bg-[#79D0B8] w-full h-full flex items-center justify-center text-white text-xl font-bold">
                {getInitials(vetName)}
              </div>
            )}
          </div>
          
          <div>
            <h2 className="font-semibold text-lg">{vetName}</h2>
            <p className="text-gray-600">{vetSpecialty}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">¿Cómo calificarías tu experiencia?</h2>
          
          <div className="flex justify-center mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                className="p-1 focus:outline-none"
              >
                <Star
                  size={36}
                  className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                />
              </button>
            ))}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Comparte tu opinión (opcional)</label>
            <Textarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="Describe tu experiencia con este veterinario..."
              className="w-full p-3 border border-gray-300 rounded-md"
              rows={5}
            />
          </div>
          
          <Button
            onClick={handleSubmitReview}
            disabled={submitting || rating === 0}
            className="w-full bg-[#79D0B8] hover:bg-[#68BBA3] text-white py-3"
          >
            {submitting ? 'Enviando...' : 'Enviar Reseña'}
          </Button>
        </div>
      </div>
    </LayoutBase>
  );
};

export default VetReviewScreen;

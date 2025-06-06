
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

export const useGroomingDetail = (id: string | undefined) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const { userRole } = useUser();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroomingDetails = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('pet_grooming')
          .select(`
            id,
            business_name,
            profile_image_url,
            location,
            animals_accepted,
            services_offered,
            availability
          `)
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        
        // Ensure services_offered is an array and properly formatted
        if (data) {
          console.log('Raw grooming data:', data);
          
          // Process services_offered to ensure it's an array
          let servicesOffered = [];
          if (data.services_offered) {
            if (Array.isArray(data.services_offered)) {
              servicesOffered = data.services_offered;
            } else if (typeof data.services_offered === 'object') {
              // If it's an object, try to convert it to array
              servicesOffered = Object.values(data.services_offered);
            }
          }
          
          data.services_offered = servicesOffered;
          data.animals_accepted = Array.isArray(data.animals_accepted) 
            ? data.animals_accepted 
            : [];
          
          console.log('Processed services:', data.services_offered);
        }
        
        setData(data);
      } catch (error) {
        console.error('Error fetching grooming details:', error);
        setError('No se pudo cargar la información de la estética');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGroomingDetails();
    }
  }, [id]);

  const handleBookAppointment = () => {
    if (!id) return;
    // Navigate to the booking flow with the correct path format
    navigate(`/owner/appointments/book/${id}`);
  };

  const handleReviewClick = () => {
    if (!id) return;
    navigate(`/groomers/${id}/review`);
  };

  const handleSendMessage = async () => {
    if (!id || !user?.id) {
      console.error('Missing grooming ID or user ID');
      return;
    }
    
    try {
      console.log('Creating conversation between:', user.id, 'and', id);
      
      // Create or get existing conversation
      const { data: conversationId, error } = await supabase.rpc(
        'get_or_create_conversation',
        {
          user1_uuid: user.id,
          user2_uuid: id
        }
      );

      if (error) {
        console.error('Error creating conversation:', error);
        return;
      }

      console.log('Conversation ID:', conversationId);
      
      // Navigate to chat screen with the correct role prefix
      const rolePrefix = userRole === 'pet_owner' ? '/owner' : '/vet';
      navigate(`${rolePrefix}/chats/${conversationId}`);
    } catch (error) {
      console.error('Error handling send message:', error);
    }
  };

  return {
    data,
    loading,
    error,
    handleBookAppointment,
    handleReviewClick,
    handleSendMessage
  };
};

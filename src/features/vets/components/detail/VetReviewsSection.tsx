
import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/ui/atoms/skeleton';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  pet_owner_id: string;
  display_name?: string;
}

interface VetReviewsSectionProps {
  veterinarianId: string;
}

const VetReviewsSection: React.FC<VetReviewsSectionProps> = ({ veterinarianId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const reviewsPerPage = 3;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        // Using a simpler approach to get reviews and join with profile information
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('veterinarian_id', veterinarianId)
          .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;

        // If we have reviews, fetch the display names for each reviewer
        if (reviewsData && reviewsData.length > 0) {
          const reviewsWithProfiles = await Promise.all(
            reviewsData.map(async (review) => {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('display_name')
                .eq('id', review.pet_owner_id)
                .single();
              
              return {
                ...review,
                display_name: profileData?.display_name || 'Usuario'
              };
            })
          );

          setReviews(reviewsWithProfiles);
        } else {
          setReviews([]);
        }
      } catch (err: any) {
        console.error('Error al cargar reseñas:', err);
        setError('No se pudieron cargar las reseñas');
      } finally {
        setLoading(false);
      }
    };

    if (veterinarianId) {
      fetchReviews();
    }
  }, [veterinarianId]);

  // Formatear fecha relativa (ej: "hace 2 días")
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: es
      });
    } catch (e) {
      return 'Fecha desconocida';
    }
  };

  // Determinar cuántas reseñas mostrar basado en si está expandido o no
  const displayedReviews = expanded 
    ? reviews.slice(0, page * reviewsPerPage) 
    : reviews.slice(0, 1);

  const hasMoreReviews = expanded && reviews.length > page * reviewsPerPage;

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const loadMoreReviews = () => {
    setPage(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Reseñas</h3>
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="border-b pb-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="my-2">
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-16 w-full mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Reseñas</h3>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Reseñas</h3>
        <p className="text-gray-500 italic">Este veterinario aún no tiene reseñas.</p>
      </div>
    );
  }

  return (
    <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Reseñas</h3>
      
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-3">
            <div className="flex justify-between">
              <span className="font-medium">{review.display_name}</span>
              <span className="text-gray-500 text-sm">{formatDate(review.created_at)}</span>
            </div>
            <div className="flex my-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            {review.comment && <p className="text-gray-700 mt-1">{review.comment}</p>}
          </div>
        ))}
      </div>

      {reviews.length > 1 && (
        <button 
          onClick={toggleExpanded} 
          className="mt-4 flex items-center text-[#4DA6A8] hover:text-[#3A8486] font-medium"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" /> Mostrar menos
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" /> Ver todas las reseñas ({reviews.length})
            </>
          )}
        </button>
      )}

      {hasMoreReviews && (
        <button 
          onClick={loadMoreReviews} 
          className="mt-2 text-[#4DA6A8] hover:text-[#3A8486] text-sm"
        >
          Cargar más reseñas
        </button>
      )}
    </div>
  );
};

export default VetReviewsSection;

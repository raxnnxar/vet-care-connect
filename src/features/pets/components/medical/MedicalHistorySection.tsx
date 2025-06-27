
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/molecules/card';
import { Badge } from '@/ui/atoms/badge';
import { Calendar, FileText, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/frontend/shared/utils/date';

interface MedicalHistoryEvent {
  event_id: string;
  event_date: string;
  diagnosis: string;
  vet_name: string;
  note_text: string;
  instructions_for_owner: string;
  meds_summary: string;
}

interface MedicalHistorySectionProps {
  petId: string;
  onCountChange: (count: number) => void;
}

const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({ 
  petId, 
  onCountChange 
}) => {
  const [history, setHistory] = useState<MedicalHistoryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!petId) return;
      
      try {
        const { data, error } = await supabase
          .from('v_medical_history')
          .select('*')
          .eq('pet_id', petId)
          .order('event_date', { ascending: false });

        if (error) throw error;
        
        setHistory(data || []);
        onCountChange(data?.length || 0);
      } catch (error) {
        console.error('Error fetching medical history:', error);
        setHistory([]);
        onCountChange(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [petId, onCountChange]);

  const handleHistoryClick = (eventId: string) => {
    navigate(`/owner/pets/${petId}/medical/history/${eventId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center p-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Sin historial médico
        </h3>
        <p className="text-gray-500">
          No hay registros médicos disponibles para esta mascota.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((event) => (
        <Card 
          key={event.event_id} 
          className="cursor-pointer hover:shadow-md transition-shadow h-[120px]"
          onClick={() => handleHistoryClick(event.event_id)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-bold">
                {event.diagnosis || 'Consulta médica'}
              </CardTitle>
              <Badge variant="outline" className="ml-2">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(event.event_date)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {event.vet_name && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <User className="h-4 w-4 mr-1" />
                Dr. {event.vet_name}
              </div>
            )}
            
            {event.note_text && (
              <p className="text-sm text-gray-700 line-clamp-2">
                {event.note_text}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MedicalHistorySection;

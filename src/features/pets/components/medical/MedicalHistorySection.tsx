
import React, { useState, useEffect } from 'react';
import { Card } from '@/ui/molecules/card';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/frontend/shared/utils/date';
import { Stethoscope, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MedicalHistoryEvent {
  event_id: string;
  event_date: string;
  diagnosis: string;
  vet_name: string;
  note_text?: string;
  instructions_for_owner?: string;
  meds_summary?: string;
  pet_id: string;
  vet_id: string;
}

interface MedicalHistorySectionProps {
  petId: string;
  onCountChange: (count: number) => void;
}

const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({
  petId,
  onCountChange
}) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<MedicalHistoryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMedicalHistory();
  }, [petId]);

  useEffect(() => {
    onCountChange(events.length);
  }, [events.length, onCountChange]);

  const fetchMedicalHistory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('v_medical_history')
        .select('*')
        .eq('pet_id', petId)
        .order('event_date', { ascending: false });

      if (error) throw error;
      
      const typedEvents: MedicalHistoryEvent[] = (data || []).map(item => ({
        event_id: item.event_id,
        event_date: item.event_date,
        diagnosis: item.diagnosis,
        vet_name: item.vet_name,
        note_text: item.note_text,
        instructions_for_owner: item.instructions_for_owner,
        meds_summary: item.meds_summary,
        pet_id: item.pet_id,
        vet_id: item.vet_id
      }));
      
      setEvents(typedEvents);
    } catch (error) {
      console.error('Error fetching medical history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = (event: MedicalHistoryEvent) => {
    navigate(`/owner/history/${event.event_id}`);
  };

  const truncateText = (text: string, maxLines: number = 2) => {
    const words = text.split(' ');
    const wordsPerLine = 10; // Aproximadamente 10 palabras por línea
    const maxWords = maxLines * wordsPerLine;
    
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-[#79D0B8]" />
          Historial Médico
        </h3>
      </div>

      {events.length === 0 ? (
        <Card className="p-6 text-center">
          <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No hay historial médico registrado</p>
          <p className="text-gray-400 text-sm">
            Los tratamientos y notas del veterinario aparecerán aquí
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Card 
              key={event.event_id} 
              className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
              onClick={() => handleEventClick(event)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      {formatDate(event.event_date)}
                    </span>
                    <span className="text-gray-400">·</span>
                    <span className="text-sm text-gray-600">
                      Vet: {event.vet_name}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-[#79D0B8]" />
                    {event.diagnosis}
                  </h4>

                  {event.note_text && (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      "{truncateText(event.note_text, 2)}"
                    </p>
                  )}
                </div>
                
                <ChevronRight className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalHistorySection;

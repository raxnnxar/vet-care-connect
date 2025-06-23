
import React, { useState, useEffect } from 'react';
import { Card } from '@/ui/molecules/card';
import { Clock, Stethoscope, Pill } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/frontend/shared/utils/date';

interface TreatmentMedication {
  id: string;
  medication: string;
  dosage: string;
  frequency_hours: number;
  duration_days: number;
}

interface TreatmentCase {
  id: string;
  diagnosis: string;
  start_date: string;
  veterinarian_name: string;
  medications: TreatmentMedication[];
}

interface MedicalTreatmentsSectionProps {
  petId: string;
  onCountChange: (count: number) => void;
}

const MedicalTreatmentsSection: React.FC<MedicalTreatmentsSectionProps> = ({
  petId,
  onCountChange
}) => {
  const [treatments, setTreatments] = useState<TreatmentCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTreatments();
  }, [petId]);

  useEffect(() => {
    onCountChange(treatments.length);
  }, [treatments.length, onCountChange]);

  const fetchTreatments = async () => {
    setIsLoading(true);
    try {
      // Fetch treatment cases with veterinarian info
      const { data: treatmentData, error: treatmentError } = await supabase
        .from('treatment_cases')
        .select(`
          *,
          treatment_medications(*)
        `)
        .eq('pet_id', petId)
        .order('start_date', { ascending: false });

      if (treatmentError) throw treatmentError;

      // Get veterinarian names
      const vetIds = [...new Set(treatmentData?.map(t => t.veterinarian_id).filter(Boolean))];
      let vetProfiles: any[] = [];
      
      if (vetIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, display_name')
          .in('id', vetIds);

        if (!profilesError && profiles) {
          vetProfiles = profiles;
        }
      }

      // Transform data
      const transformedTreatments: TreatmentCase[] = (treatmentData || []).map(treatment => {
        const vetProfile = vetProfiles.find(p => p.id === treatment.veterinarian_id);
        
        return {
          id: treatment.id,
          diagnosis: treatment.diagnosis,
          start_date: treatment.start_date,
          veterinarian_name: vetProfile?.display_name || 'Veterinario',
          medications: treatment.treatment_medications || []
        };
      });

      setTreatments(transformedTreatments);
    } catch (error) {
      console.error('Error fetching treatments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFrequencyText = (hours: number) => {
    if (hours === 24) return 'c/24h';
    if (hours === 12) return 'c/12h';
    if (hours === 8) return 'c/8h';
    if (hours === 6) return 'c/6h';
    return `c/${hours}h`;
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
          Tratamientos Médicos
        </h3>
      </div>

      {treatments.length === 0 ? (
        <Card className="p-6 text-center">
          <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay tratamientos registrados</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {treatments.map((treatment) => (
            <Card key={treatment.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#79D0B8]" />
                  <span className="text-sm font-medium text-gray-600">
                    {formatDate(treatment.start_date)}
                  </span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm font-medium text-gray-800">
                    {treatment.diagnosis}
                  </span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-600">
                    Vet: {treatment.veterinarian_name}
                  </span>
                </div>

                {treatment.medications.length > 0 && (
                  <div className="ml-6 space-y-1">
                    {treatment.medications.map((medication) => (
                      <div key={medication.id} className="flex items-center gap-2 text-sm text-gray-600">
                        <Pill className="w-3 h-3" />
                        <span>
                          {medication.medication} — {medication.dosage} {getFrequencyText(medication.frequency_hours)} ({medication.duration_days} días)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalTreatmentsSection;

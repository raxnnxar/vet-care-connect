
import React, { useState } from 'react';
import { Button } from '@/ui/atoms/button';
import { Plus, FileText } from 'lucide-react';
import { useVaccinationRecords } from '../../hooks/useVaccinationRecords';
import VaccinationForm from './VaccinationForm';
import VaccinationRecordsList from './VaccinationRecordsList';
import VaccineDocumentsList from './VaccineDocumentsList';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

interface DigitalVaccinationSectionProps {
  petId: string;
}

const DigitalVaccinationSection: React.FC<DigitalVaccinationSectionProps> = ({ petId }) => {
  const [showForm, setShowForm] = useState(false);
  const { records, isLoading, createRecord } = useVaccinationRecords(petId);
  const { user } = useSelector((state: RootState) => state.auth);

  // Get pet owner id
  const [petOwnerId, setPetOwnerId] = useState<string>('');
  
  React.useEffect(() => {
    const fetchPetOwner = async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data } = await supabase
        .from('pets')
        .select('owner_id')
        .eq('id', petId)
        .maybeSingle();
      if (data) {
        setPetOwnerId(data.owner_id);
      }
    };
    fetchPetOwner();
  }, [petId]);

  const handleVaccinationAdded = () => {
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#79D0B8]" />
          <h3 className="font-semibold text-gray-800">Cartilla de vacunación digital</h3>
        </div>
        
        {!showForm && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            className="border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8] hover:text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            Añadir vacuna
          </Button>
        )}
      </div>

      {showForm && (
        <VaccinationForm
          petId={petId}
          onClose={() => setShowForm(false)}
          onVaccinationAdded={handleVaccinationAdded}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <VaccinationRecordsList
          records={records}
          petId={petId}
        />
      )}

      {/* Cartilla de vacunación física */}
      {petOwnerId && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-[#79D0B8]" />
            <h4 className="font-semibold text-gray-800">Cartilla de vacunación física</h4>
          </div>
          <VaccineDocumentsList 
            petId={petId}
            petOwnerId={petOwnerId}
          />
        </div>
      )}
    </div>
  );
};

export default DigitalVaccinationSection;

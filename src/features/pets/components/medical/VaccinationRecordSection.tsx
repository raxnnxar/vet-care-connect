
import React, { useState, useEffect } from 'react';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Plus, Syringe, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { Badge } from '@/ui/atoms/badge';
import { formatDate } from '@/frontend/shared/utils/date';
import VaccinationForm from './VaccinationForm';
import VaccineDocumentsList from './VaccineDocumentsList';

interface VaccinationRecord {
  id: string;
  vaccine_name: string;
  application_date: string;
  next_due_date?: string;
  manufacturer?: string;
  lot_number?: string;
  administered_by?: string;
  notes?: string;
  needs_booster: boolean;
}

interface VaccinationRecordSectionProps {
  petId: string;
  onCountChange: (count: number) => void;
}

const VaccinationRecordSection: React.FC<VaccinationRecordSectionProps> = ({
  petId,
  onCountChange
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    fetchVaccinationRecords();
  }, [petId]);

  useEffect(() => {
    onCountChange(records.length);
  }, [records.length, onCountChange]);

  const fetchVaccinationRecords = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('vaccination_records')
        .select('*')
        .eq('pet_id', petId)
        .order('application_date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching vaccination records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordAdded = () => {
    fetchVaccinationRecords();
    setShowAddDialog(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
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
          <Syringe className="w-5 h-5 text-[#79D0B8]" />
          Cartilla de Vacunación
        </h3>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Añadir vacuna
        </Button>
      </div>

      {/* Vaccination Records */}
      {records.length === 0 ? (
        <Card className="p-6 text-center">
          <Syringe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No hay registros de vacunación</p>
          <Button
            onClick={() => setShowAddDialog(true)}
            variant="outline"
            className="border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8] hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir primera vacuna
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <Card key={record.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-800">{record.vaccine_name}</h4>
                    {record.needs_booster && (
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        Requiere refuerzo
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Aplicada: {formatDate(record.application_date)}</div>
                    {record.next_due_date && (
                      <div>Próxima: {formatDate(record.next_due_date)}</div>
                    )}
                    {record.manufacturer && (
                      <div>Laboratorio: {record.manufacturer}</div>
                    )}
                    {record.lot_number && (
                      <div>Lote: {record.lot_number}</div>
                    )}
                    {record.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        {record.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Vaccine Documents Section */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-[#79D0B8]" />
          <h4 className="font-medium text-gray-800">Documentos Adjuntos</h4>
        </div>
        <VaccineDocumentsList 
          petId={petId}
          petOwnerId={user?.id || ''}
        />
      </Card>

      {showAddDialog && (
        <VaccinationForm
          petId={petId}
          onClose={() => setShowAddDialog(false)}
          onVaccinationAdded={handleRecordAdded}
        />
      )}
    </div>
  );
};

export default VaccinationRecordSection;

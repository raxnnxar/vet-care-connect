
import React, { useState, useEffect } from 'react';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Plus, Syringe, Calendar, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/ui/atoms/badge';
import { formatDate } from '@/frontend/shared/utils/date';

interface VaccinationRecord {
  id: string;
  vaccine_name: string;
  application_date: string;
  next_due_date: string | null;
  needs_booster: boolean;
  notes: string | null;
  administered_by: string | null;
}

interface VaccinationRecordSectionProps {
  petId: string;
  onCountChange: (count: number) => void;
}

const VaccinationRecordSection: React.FC<VaccinationRecordSectionProps> = ({
  petId,
  onCountChange
}) => {
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVaccinations();
  }, [petId]);

  useEffect(() => {
    onCountChange(vaccinations.length);
  }, [vaccinations.length, onCountChange]);

  const fetchVaccinations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('vaccination_records')
        .select('*')
        .eq('pet_id', petId)
        .order('application_date', { ascending: false });

      if (error) throw error;

      setVaccinations(data || []);
    } catch (error) {
      console.error('Error fetching vaccinations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isBoosterOverdue = (nextDueDate: string | null, needsBooster: boolean) => {
    if (!needsBooster || !nextDueDate) return false;
    return new Date(nextDueDate) < new Date();
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
          <Syringe className="w-5 h-5 text-[#79D0B8]" />
          Cartilla de Vacunación
        </h3>
        <Button
          className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Añadir vacuna
        </Button>
      </div>

      {vaccinations.length === 0 ? (
        <Card className="p-6 text-center">
          <Syringe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No hay vacunas registradas</p>
          <Button
            variant="outline"
            className="border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8] hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir primera vacuna
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {vaccinations.map((vaccination) => (
            <Card key={vaccination.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Syringe className="w-4 h-4 text-[#79D0B8]" />
                    <h4 className="font-semibold text-gray-800">{vaccination.vaccine_name}</h4>
                    {isBoosterOverdue(vaccination.next_due_date, vaccination.needs_booster) && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Refuerzo pendiente
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Aplicada: {formatDate(vaccination.application_date)}</span>
                    </div>
                    
                    {vaccination.next_due_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Refuerzo: {formatDate(vaccination.next_due_date)}</span>
                      </div>
                    )}
                    
                    {vaccination.notes && (
                      <p className="text-gray-500 mt-2">
                        Notas: {vaccination.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VaccinationRecordSection;


import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Badge } from '@/ui/atoms/badge';

interface Medication {
  id: string;
  medication: string;
  dosage: string;
  frequency_hours: number;
  duration_days: number;
  start_date: string;
  instructions: string | null;
}

interface MedicationsListProps {
  medications: Medication[];
}

const MedicationsList: React.FC<MedicationsListProps> = ({ medications }) => {
  if (medications.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No se han agregado medicamentos aún
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getFrequencyText = (hours: number) => {
    if (hours === 24) return 'Una vez al día';
    if (hours === 12) return 'Cada 12 horas';
    if (hours === 8) return 'Cada 8 horas';
    if (hours === 6) return 'Cada 6 horas';
    return `Cada ${hours} horas`;
  };

  return (
    <div className="space-y-3">
      {medications.map((medication) => (
        <Card key={medication.id} className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h5 className="font-semibold text-gray-800">{medication.medication}</h5>
            <Badge variant="outline" className="text-[#79D0B8] border-[#79D0B8]">
              {medication.duration_days} días
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
            <div>
              <span className="font-medium">Dosis:</span> {medication.dosage}
            </div>
            <div>
              <span className="font-medium">Frecuencia:</span> {getFrequencyText(medication.frequency_hours)}
            </div>
            <div>
              <span className="font-medium">Inicio:</span> {formatDate(medication.start_date)}
            </div>
          </div>
          
          {medication.instructions && (
            <div className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
              <span className="font-medium">Instrucciones:</span> {medication.instructions}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default MedicationsList;

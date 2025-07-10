
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/molecules/card';
import { Badge } from '@/ui/atoms/badge';
import { Calendar, Syringe } from 'lucide-react';
import { VaccinationRecord } from '../../types/vaccinationTypes';
import { formatDate } from '@/frontend/shared/utils/date';

interface VaccinationRecordsListProps {
  records: VaccinationRecord[];
  petId: string;
  onDelete?: (recordId: string) => void;
  canDelete?: boolean;
}

const VaccinationRecordsList: React.FC<VaccinationRecordsListProps> = ({
  records,
  petId,
  onDelete,
  canDelete = false
}) => {
  const navigate = useNavigate();

  const handleRecordClick = (recordId: string) => {
    navigate(`/owner/pets/${petId}/vaccination/${recordId}`);
  };

  if (records.length === 0) {
    return (
      <div className="text-center p-8">
        <Syringe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Sin registros de vacunación
        </h3>
        <p className="text-gray-500">
          No hay vacunas registradas para esta mascota.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <Card 
          key={record.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleRecordClick(record.id!)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-bold">
                {record.vaccine_name}
              </CardTitle>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="outline" className="ml-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(record.application_date)}
                </Badge>
                {record.needs_booster ? (
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    Refuerzo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    Completada
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {record.next_due_date && (
              <div className="text-sm text-gray-600">
                Próx. refuerzo: {formatDate(record.next_due_date)}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VaccinationRecordsList;

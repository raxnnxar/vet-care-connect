
import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Badge } from '@/ui/atoms/badge';
import { Trash2, Syringe } from 'lucide-react';
import { VaccinationRecord } from '../../types/vaccinationTypes';

interface VaccinationRecordsListProps {
  records: VaccinationRecord[];
  onDelete: (recordId: string) => void;
  canDelete?: boolean;
}

const VaccinationRecordsList: React.FC<VaccinationRecordsListProps> = ({
  records,
  onDelete,
  canDelete = true
}) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <Syringe className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>No hay vacunas registradas aún</p>
        <p className="text-sm">Añade una vacuna usando el botón de arriba</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <Card key={record.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-gray-800">{record.vaccine_name}</h4>
                {record.needs_booster && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    Requiere refuerzo
                  </Badge>
                )}
                {record.administered_by && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Vet. confirmado
                  </Badge>
                )}
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Fecha de aplicación:</strong>{' '}
                  {new Date(record.application_date).toLocaleDateString('es-ES')}
                </p>
                {record.next_due_date && (
                  <p>
                    <strong>Próximo refuerzo:</strong>{' '}
                    {new Date(record.next_due_date).toLocaleDateString('es-ES')}
                  </p>
                )}
                {record.notes && (
                  <p>
                    <strong>Notas:</strong> {record.notes}
                  </p>
                )}
              </div>
            </div>

            {canDelete && !record.administered_by && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => record.id && onDelete(record.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default VaccinationRecordsList;

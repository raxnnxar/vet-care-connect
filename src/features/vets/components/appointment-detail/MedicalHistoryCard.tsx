
import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Heart, FileText, Scissors } from 'lucide-react';

interface MedicalHistoryCardProps {
  medicalHistory: any;
  onViewFullHistory: () => void;
}

const MedicalHistoryCard: React.FC<MedicalHistoryCardProps> = ({
  medicalHistory,
  onViewFullHistory
}) => {
  if (!medicalHistory) return null;

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-[#1F2937] flex items-center">
          <Heart className="mr-2 text-[#79D0B8]" size={20} />
          Historial Médico
        </h2>
        <Button 
          variant="outline"
          size="sm"
          className="border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8]/10"
          onClick={onViewFullHistory}
        >
          Ver completo
        </Button>
      </div>
      
      <div className="space-y-4">
        {medicalHistory.allergies && (
          <div className="flex items-start">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <Heart size={16} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Alergias</p>
              <p className="font-medium">{medicalHistory.allergies}</p>
            </div>
          </div>
        )}
        
        {medicalHistory.chronic_conditions && (
          <div className="flex items-start">
            <div className="bg-orange-100 p-2 rounded-full mr-3">
              <FileText size={16} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Condiciones crónicas</p>
              <p className="font-medium">{medicalHistory.chronic_conditions}</p>
            </div>
          </div>
        )}
        
        {medicalHistory.previous_surgeries && (
          <div className="flex items-start">
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <Scissors size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cirugías pasadas</p>
              <div className="font-medium">
                {Array.isArray(medicalHistory.previous_surgeries) 
                  ? medicalHistory.previous_surgeries.map((surgery: any, index: number) => (
                      <p key={index}>{surgery.type} ({surgery.date})</p>
                    ))
                  : <p>{JSON.stringify(medicalHistory.previous_surgeries)}</p>
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MedicalHistoryCard;

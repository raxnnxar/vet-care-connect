
import React, { useState, useEffect } from 'react';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { Badge } from '@/ui/atoms/badge';
import { Plus, Scissors } from 'lucide-react';
import { usePetSurgeries } from '@/features/pets/hooks/usePetSurgeries';
import SurgeryModal from './SurgeryModal';
import { PetSurgery } from '@/features/pets/types/formTypes';

interface SurgeriesSectionProps {
  petId: string;
  onCountChange?: (count: number) => void;
}

const SurgeriesSection: React.FC<SurgeriesSectionProps> = ({ petId, onCountChange }) => {
  const { surgeries, isLoading, addSurgery, updateSurgery, deleteSurgery } = usePetSurgeries(petId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSurgery, setEditingSurgery] = useState<PetSurgery | null>(null);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(surgeries.length);
    }
  }, [surgeries.length, onCountChange]);

  const handleAddSurgery = () => {
    setEditingSurgery(null);
    setIsModalOpen(true);
  };

  const handleEditSurgery = (surgery: PetSurgery) => {
    setEditingSurgery(surgery);
    setIsModalOpen(true);
  };

  const handleSaveSurgery = async (procedure: string, surgery_date?: string, notes?: string) => {
    if (editingSurgery) {
      await updateSurgery(editingSurgery.id, procedure, surgery_date, notes);
    } else {
      await addSurgery(procedure, surgery_date, notes);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Fecha no especificada';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Cirugías</h3>
        <Button
          onClick={handleAddSurgery}
          size="sm"
          className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
        >
          <Plus className="h-4 w-4 mr-1" />
          Añadir
        </Button>
      </div>

      {surgeries.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Scissors className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Sin cirugías registradas</h4>
              <p className="text-gray-500 text-sm mb-4">
                No hay cirugías previas registradas para esta mascota
              </p>
              <Button
                onClick={handleAddSurgery}
                variant="outline"
                className="border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8] hover:text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Añadir primera cirugía
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {surgeries.map((surgery) => (
            <Card 
              key={surgery.id} 
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleEditSurgery(surgery)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#79D0B8]/10 rounded-full flex items-center justify-center">
                  <Scissors className="h-5 w-5 text-[#79D0B8]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{surgery.procedure}</h4>
                  <p className="text-sm text-gray-600">
                    Fecha: {formatDate(surgery.surgery_date)}
                  </p>
                  {surgery.notes && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {surgery.notes}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <SurgeryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveSurgery}
        surgery={editingSurgery}
        title={editingSurgery ? 'Editar Cirugía' : 'Añadir Cirugía'}
      />
    </div>
  );
};

export default SurgeriesSection;

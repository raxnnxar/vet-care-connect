
import React from 'react';
import { Clock } from 'lucide-react';
import { EditableSection } from '@/features/vets/components/profile/EditableSection';

interface GroomingAvailabilitySectionProps {
  availability: Record<string, any>;
  userId: string;
  isEditing: boolean;
  toggleEditing: () => void;
  handleSave: () => Promise<void>;
  isLoading: boolean;
}

const GroomingAvailabilitySection: React.FC<GroomingAvailabilitySectionProps> = ({
  availability,
  userId,
  isEditing,
  toggleEditing,
  handleSave,
  isLoading
}) => {
  const daysOfWeek = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  const formatTimeSlot = (dayData: any) => {
    if (!dayData || typeof dayData !== 'object') return 'Cerrado';
    
    // Check if the day is available
    if (!dayData.isAvailable && !dayData.available) return 'Cerrado';
    
    // Format time slots
    if (dayData.startTime && dayData.endTime) {
      return `${dayData.startTime} - ${dayData.endTime}`;
    }
    
    if (dayData.start && dayData.end) {
      return `${dayData.start} - ${dayData.end}`;
    }
    
    return 'Horario no especificado';
  };

  return (
    <EditableSection
      title="Horarios de Atención"
      isEditing={isEditing}
      onEdit={toggleEditing}
      onSave={null} // No save functionality for now
      isSaving={isLoading}
    >
      <div className="space-y-3">
        {daysOfWeek.map((day) => {
          const dayAvailability = availability[day.key];
          const timeSlot = formatTimeSlot(dayAvailability);
          const isAvailable = timeSlot !== 'Cerrado';
          
          return (
            <div key={day.key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-gray-400" />
                <span className="font-medium text-gray-700">{day.label}:</span>
              </div>
              <div className="text-right">
                {isAvailable ? (
                  <span className="text-[#79D0B8] font-medium">
                    {timeSlot}
                  </span>
                ) : (
                  <span className="text-gray-400">Cerrado</span>
                )}
              </div>
            </div>
          );
        })}
        
        {(!availability || Object.keys(availability).length === 0) && (
          <p className="text-gray-500 italic text-center py-4">
            No hay horarios configurados
          </p>
        )}
      </div>
    </EditableSection>
  );
};

export default GroomingAvailabilitySection;

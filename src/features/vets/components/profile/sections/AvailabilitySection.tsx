
import React from 'react';
import { Calendar } from 'lucide-react';
import { EditableSection } from '../EditableSection';
import { AvailabilitySchedule } from '@/features/auth/types/veterinarianTypes';
import AvailabilityEditor from './availability/AvailabilityEditor';

interface AvailabilitySectionProps {
  availability: AvailabilitySchedule;
  userId: string; 
  isEditing: boolean;
  toggleEditing: () => void;
  handleSave: () => Promise<void>;
  isLoading: boolean;
  onAvailabilityUpdated?: (updatedAvailability: AvailabilitySchedule) => void;
}

const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({
  availability,
  userId,
  isEditing,
  toggleEditing,
  handleSave,
  isLoading,
  onAvailabilityUpdated
}) => {
  // Function to handle closing the editor and refreshing availability data
  const handleEditorSave = () => {
    toggleEditing();
    
    // Trigger data refresh through the parent component
    if (handleSave) {
      handleSave();
    }
  };

  return (
    <EditableSection
      title="Disponibilidad"
      isEditing={isEditing}
      onEdit={toggleEditing}
      onSave={handleSave}
      isSaving={isLoading}
    >
      {!isEditing ? (
        <div className="rounded-lg bg-white">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-[#4DA6A8] mr-2" />
                <h3 className="font-medium">Lunes</h3>
              </div>
              {availability?.monday?.isAvailable ? (
                <p className="text-sm text-gray-700">
                  {availability.monday.startTime} - {availability.monday.endTime}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">No disponible</p>
              )}
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-[#4DA6A8] mr-2" />
                <h3 className="font-medium">Martes</h3>
              </div>
              {availability?.tuesday?.isAvailable ? (
                <p className="text-sm text-gray-700">
                  {availability.tuesday.startTime} - {availability.tuesday.endTime}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">No disponible</p>
              )}
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-[#4DA6A8] mr-2" />
                <h3 className="font-medium">Miércoles</h3>
              </div>
              {availability?.wednesday?.isAvailable ? (
                <p className="text-sm text-gray-700">
                  {availability.wednesday.startTime} - {availability.wednesday.endTime}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">No disponible</p>
              )}
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-[#4DA6A8] mr-2" />
                <h3 className="font-medium">Jueves</h3>
              </div>
              {availability?.thursday?.isAvailable ? (
                <p className="text-sm text-gray-700">
                  {availability.thursday.startTime} - {availability.thursday.endTime}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">No disponible</p>
              )}
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-[#4DA6A8] mr-2" />
                <h3 className="font-medium">Viernes</h3>
              </div>
              {availability?.friday?.isAvailable ? (
                <p className="text-sm text-gray-700">
                  {availability.friday.startTime} - {availability.friday.endTime}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">No disponible</p>
              )}
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-[#4DA6A8] mr-2" />
                <h3 className="font-medium">Sábado</h3>
              </div>
              {availability?.saturday?.isAvailable ? (
                <p className="text-sm text-gray-700">
                  {availability.saturday.startTime} - {availability.saturday.endTime}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">No disponible</p>
              )}
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-[#4DA6A8] mr-2" />
                <h3 className="font-medium">Domingo</h3>
              </div>
              {availability?.sunday?.isAvailable ? (
                <p className="text-sm text-gray-700">
                  {availability.sunday.startTime} - {availability.sunday.endTime}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">No disponible</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <AvailabilityEditor 
          userId={userId}
          initialAvailability={availability || {}}
          onSave={handleEditorSave}
        />
      )}
    </EditableSection>
  );
};

export default AvailabilitySection;

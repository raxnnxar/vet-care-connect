
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Switch } from '@/ui/atoms/switch';
import { useVetAvailability } from '@/features/vets/hooks/useVetAvailability';
import { AvailabilitySchedule } from '@/features/auth/types/veterinarianTypes';
import { Button } from '@/ui/atoms/button';

interface AvailabilityEditorProps {
  userId: string;
  initialAvailability: AvailabilitySchedule;
  onSave: () => void;
}

interface DayConfig {
  id: string;
  label: string;
}

const DAYS: DayConfig[] = [
  { id: 'monday', label: 'Lunes' },
  { id: 'tuesday', label: 'Martes' },
  { id: 'wednesday', label: 'Miércoles' },
  { id: 'thursday', label: 'Jueves' },
  { id: 'friday', label: 'Viernes' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' }
];

// Generar opciones de hora desde 00:00 hasta 23:30 en intervalos de 30 minutos
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    const hourStr = hour.toString().padStart(2, '0');
    times.push(`${hourStr}:00`);
    times.push(`${hourStr}:30`);
  }
  return times;
};

const TIME_OPTIONS = generateTimeOptions();

const AvailabilityEditor: React.FC<AvailabilityEditorProps> = ({
  userId,
  initialAvailability,
  onSave
}) => {
  const {
    availability,
    isLoading,
    toggleDayAvailability,
    updateStartTime,
    updateEndTime,
    saveAvailability
  } = useVetAvailability(userId, initialAvailability);

  const handleSave = async () => {
    const success = await saveAvailability();
    if (success) {
      onSave();
    }
  };

  return (
    <div className="space-y-6">
      {DAYS.map((day) => {
        const dayData = availability[day.id] || { isAvailable: false };
        
        return (
          <div 
            key={day.id} 
            className={`p-4 border rounded-lg ${dayData.isAvailable ? 'border-[#79D0B8] bg-[#f0faf8]' : 'border-gray-200'}`}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-[#4DA6A8] mr-2" />
                <h3 className="font-medium">{day.label}</h3>
              </div>
              <Switch
                checked={dayData.isAvailable || false}
                onCheckedChange={() => toggleDayAvailability(day.id)}
              />
            </div>
            
            {dayData.isAvailable && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Hora inicio</span>
                  </div>
                  <select
                    value={dayData.startTime || '09:00'}
                    onChange={(e) => updateStartTime(day.id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={`start-${day.id}-${time}`} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Hora fin</span>
                  </div>
                  <select
                    value={dayData.endTime || '18:00'}
                    onChange={(e) => updateEndTime(day.id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    disabled={!dayData.isAvailable}
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={`end-${day.id}-${time}`} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      <div className="flex justify-end">
        <Button
          className="bg-[#79D0B8] hover:bg-[#4DA6A8] text-white"
          disabled={isLoading}
          onClick={handleSave}
        >
          {isLoading ? 'Guardando...' : 'Guardar disponibilidad'}
        </Button>
      </div>
    </div>
  );
};

export default AvailabilityEditor;

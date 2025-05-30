
import React from 'react';
import { format, isSameDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import TimeSlotsList from './TimeSlotsList';
import { Button } from '@/ui/atoms/button';
import { useVetAvailability } from '../../hooks/useVetAvailability';
import { useParams } from 'react-router-dom';

interface ListViewDateSelectorProps {
  availableDays: Date[];
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  onContinue: () => void;
  onGoBack: () => void;
}

const ListViewDateSelector: React.FC<ListViewDateSelectorProps> = ({
  availableDays,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onContinue,
  onGoBack
}) => {
  const { vetId } = useParams<{ vetId: string }>();
  const { isDateAvailable, getAvailableTimeSlotsForDate, isLoading } = useVetAvailability(vetId || '');

  const formatDayName = (date: Date): string => {
    if (isToday(date)) {
      return 'Hoy';
    }
    return format(date, 'EEEE', { locale: es });
  };

  // Filter available days based on vet's availability
  const actuallyAvailableDays = availableDays.filter(day => isDateAvailable(day));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando disponibilidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {actuallyAvailableDays.map((day) => {
          const timeSlots = getAvailableTimeSlotsForDate(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          
          return (
            <div
              key={day.toISOString()}
              className={`border rounded-xl transition-all duration-200 ${
                isSelected 
                  ? 'border-[#5ECBAD] bg-[#5ECBAD]/5 shadow-sm' 
                  : 'border-gray-200 hover:border-[#5ECBAD]/50'
              }`}
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-medium capitalize ${
                      isSelected ? 'text-[#4BA68D]' : 'text-gray-800'
                    }`}>
                      {formatDayName(day)}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {format(day, 'd MMMM', { locale: es })}
                    </p>
                  </div>
                  {timeSlots.length === 0 && (
                    <span className="text-sm text-gray-400 italic">
                      Sin horarios disponibles
                    </span>
                  )}
                </div>
              </div>
              
              {timeSlots.length > 0 && (
                <TimeSlotsList
                  timeSlots={timeSlots}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  currentDate={day}
                  onDateSelect={onDateSelect}
                  onTimeSelect={onTimeSelect}
                />
              )}
            </div>
          );
        })}
      </div>

      {actuallyAvailableDays.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay días disponibles para este veterinario</p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-4">
        <Button 
          variant="outline"
          className="flex-1"
          onClick={onGoBack}
        >
          Anterior
        </Button>
        
        <Button 
          className="flex-1 bg-[#79D0B8] hover:bg-[#5FBFB3]"
          onClick={onContinue}
          disabled={!selectedDate || !selectedTime}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default ListViewDateSelector;

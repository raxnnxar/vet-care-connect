
import React, { useState } from 'react';
import { Calendar } from '@/ui/molecules/calendar';
import { addDays, startOfDay } from 'date-fns';
import TimeSlotsList from './TimeSlotsList';
import { Button } from '@/ui/atoms/button';
import { useVetAvailability } from '../../hooks/useVetAvailability';
import { useGroomingAvailability } from '../../hooks/useGroomingAvailability';

interface CalendarViewDateSelectorProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  onContinue: () => void;
  onGoBack: () => void;
  providerId?: string;
  providerType?: 'vet' | 'grooming' | null;
}

const CalendarViewDateSelector: React.FC<CalendarViewDateSelectorProps> = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onContinue,
  onGoBack,
  providerId,
  providerType
}) => {
  // Use the appropriate hook based on provider type
  const vetAvailability = useVetAvailability(providerType === 'vet' ? (providerId || '') : '');
  const groomingAvailability = useGroomingAvailability(providerType === 'grooming' ? (providerId || '') : '');
  
  // Select the right availability data based on provider type
  const availability = providerType === 'grooming' ? groomingAvailability : vetAvailability;
  const { isDateAvailable, getAvailableTimeSlotsForDate, isLoading } = availability;

  const [availableDates] = useState<Date[]>(() => {
    // Generate available dates for the next 30 days
    const dates = [];
    const today = startOfDay(new Date());
    
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      if (isDateAvailable(date)) {
        dates.push(date);
      }
    }
    
    return dates;
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isDateAvailable(date)) {
      onDateSelect(date);
      // Clear selected time when changing date
      onTimeSelect('');
    }
  };

  const timeSlots = selectedDate ? getAvailableTimeSlotsForDate(selectedDate) : [];

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
    <div className="space-y-6">
      <div className="flex justify-center bg-white rounded-lg border border-gray-200 p-4">
        <Calendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={handleDateSelect}
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today || !isDateAvailable(date);
          }}
          modifiers={{
            available: availableDates,
          }}
          modifiersClassNames={{
            available: "bg-[#5ECBAD]/10 text-[#4BA68D] font-medium hover:bg-[#5ECBAD]/20",
            selected: "bg-[#4BA68D] text-white hover:bg-[#4BA68D]",
          }}
          className="rounded-md border-none"
        />
      </div>

      {selectedDate && timeSlots.length > 0 && (
        <div className="bg-white border rounded-xl border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">
              Horarios disponibles
            </h4>
          </div>
          <TimeSlotsList
            timeSlots={timeSlots}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            currentDate={selectedDate}
            onDateSelect={onDateSelect}
            onTimeSelect={onTimeSelect}
          />
        </div>
      )}

      {selectedDate && timeSlots.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay horarios disponibles para esta fecha</p>
        </div>
      )}

      {/* Botones de navegación */}
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

export default CalendarViewDateSelector;

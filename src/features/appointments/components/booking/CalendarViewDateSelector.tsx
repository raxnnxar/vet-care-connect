
import React, { useState } from 'react';
import { Calendar } from '@/ui/molecules/calendar';
import { addDays, startOfDay, isSameDay } from 'date-fns';
import TimeSlotsList from './TimeSlotsList';
import { Button } from '@/ui/atoms/button';

interface CalendarViewDateSelectorProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  onContinue: () => void;
  onGoBack: () => void;
}

const CalendarViewDateSelector: React.FC<CalendarViewDateSelectorProps> = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onContinue,
  onGoBack
}) => {
  const [availableDates] = useState<Date[]>(() => {
    // Generate available dates for the next 30 days
    const dates = [];
    const today = startOfDay(new Date());
    
    for (let i = 0; i < 30; i++) {
      // Simulate some unavailable dates
      if (Math.random() > 0.2) {
        dates.push(addDays(today, i));
      }
    }
    
    return dates;
  });

  // Generate time slots for a selected date
  const generateTimeSlots = (date: Date): string[] => {
    const slots = [];
    const startHour = 9;
    const endHour = 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    // Mock: Remove some random slots to simulate unavailability
    const availableSlots = slots.filter((_, index) => {
      return Math.random() > 0.3;
    });
    
    return availableSlots;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && availableDates.some(availableDate => isSameDay(availableDate, date))) {
      onDateSelect(date);
      // Clear selected time when changing date
      onTimeSelect('');
    }
  };

  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

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
            return date < today || !availableDates.some(availableDate => isSameDay(availableDate, date));
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


import React, { useState } from 'react';
import { Calendar } from '@/ui/molecules/calendar';
import { addDays, startOfDay, isSameDay } from 'date-fns';
import TimeSlotsList from './TimeSlotsList';

interface CalendarViewDateSelectorProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
}

const CalendarViewDateSelector: React.FC<CalendarViewDateSelectorProps> = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect
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
            <h4 className="font-medium text-[#4BA68D]">
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
    </div>
  );
};

export default CalendarViewDateSelector;

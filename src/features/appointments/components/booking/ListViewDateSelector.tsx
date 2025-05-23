
import React from 'react';
import { format, isSameDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import TimeSlotsList from './TimeSlotsList';
import { Button } from '@/ui/atoms/button';

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
  // Generate time slots for a day (9:00 AM to 6:00 PM, 30-minute intervals)
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

  const formatDayName = (date: Date): string => {
    if (isToday(date)) {
      return 'Hoy';
    }
    return format(date, 'EEEE', { locale: es });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {availableDays.map((day) => {
          const timeSlots = generateTimeSlots(day);
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

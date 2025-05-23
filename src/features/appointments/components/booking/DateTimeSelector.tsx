
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { format, addDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import AvailableDaysList from './AvailableDaysList';
import CalendarModal from './CalendarModal';

interface DateTimeSelectorProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [availableDays, setAvailableDays] = useState<Date[]>([]);

  useEffect(() => {
    // Generate next 7 days starting from today
    const days = [];
    const today = startOfDay(new Date());
    
    for (let i = 0; i < 7; i++) {
      days.push(addDays(today, i));
    }
    
    setAvailableDays(days);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-700">Selecciona fecha y hora</h3>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowCalendar(true)}
          className="h-10 w-10 rounded-full border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8] hover:text-white"
        >
          <Calendar size={20} />
        </Button>
      </div>

      <AvailableDaysList
        availableDays={availableDays}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onDateSelect={onDateSelect}
        onTimeSelect={onTimeSelect}
      />

      <CalendarModal
        open={showCalendar}
        onOpenChange={setShowCalendar}
        selectedDate={selectedDate}
        onDateSelect={(date) => {
          onDateSelect(date);
          setShowCalendar(false);
        }}
      />
    </div>
  );
};

export default DateTimeSelector;


import React, { useState, useEffect } from 'react';
import { Calendar, List } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { addDays, startOfDay } from 'date-fns';
import ListViewDateSelector from './ListViewDateSelector';
import CalendarViewDateSelector from './CalendarViewDateSelector';

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
  const [currentView, setCurrentView] = useState<'list' | 'calendar'>('list');
  const [availableDays, setAvailableDays] = useState<Date[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Generate next 7 days starting from today
    const days = [];
    const today = startOfDay(new Date());
    
    for (let i = 0; i < 7; i++) {
      days.push(addDays(today, i));
    }
    
    setAvailableDays(days);
  }, []);

  const handleViewChange = (newView: 'list' | 'calendar') => {
    if (newView === currentView) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(newView);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-700">Selecciona fecha y hora</h3>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleViewChange(currentView === 'list' ? 'calendar' : 'list')}
          className="h-10 w-10 rounded-full border-[#5ECBAD] text-[#5ECBAD] hover:bg-[#5ECBAD] hover:text-white transition-colors"
        >
          {currentView === 'list' ? <Calendar size={20} /> : <List size={20} />}
        </Button>
      </div>

      <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
        {currentView === 'list' ? (
          <ListViewDateSelector
            availableDays={availableDays}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={onDateSelect}
            onTimeSelect={onTimeSelect}
          />
        ) : (
          <CalendarViewDateSelector
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={onDateSelect}
            onTimeSelect={onTimeSelect}
          />
        )}
      </div>
    </div>
  );
};

export default DateTimeSelector;

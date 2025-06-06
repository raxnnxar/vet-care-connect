
import React, { useState, useEffect } from 'react';
import { Calendar, List } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { addDays, startOfDay } from 'date-fns';
import ListViewDateSelector from './ListViewDateSelector';
import CalendarViewDateSelector from './CalendarViewDateSelector';
import { useVetAvailability } from '../../hooks/useVetAvailability';
import { useGroomingAvailability } from '../../hooks/useGroomingAvailability';

interface DateTimeSelectorProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  onContinue: () => void;
  onGoBack: () => void;
  providerId?: string;
  providerType?: 'vet' | 'grooming' | null;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onContinue,
  onGoBack,
  providerId,
  providerType
}) => {
  const [currentView, setCurrentView] = useState<'list' | 'calendar'>('list');
  const [availableDays, setAvailableDays] = useState<Date[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Use the appropriate hook based on provider type
  const vetAvailability = useVetAvailability(providerType === 'vet' ? (providerId || '') : '');
  const groomingAvailability = useGroomingAvailability(providerType === 'grooming' ? (providerId || '') : '');
  
  // Select the right availability data based on provider type
  const availability = providerType === 'grooming' ? groomingAvailability : vetAvailability;
  const { isDateAvailable, isLoading } = availability;

  useEffect(() => {
    if (!isLoading && isDateAvailable) {
      // Generate next 7 days starting from today, but only include available days
      const days = [];
      const today = startOfDay(new Date());
      
      for (let i = 0; i < 30; i++) { // Check more days to find 7 available ones
        const date = addDays(today, i);
        if (isDateAvailable(date)) {
          days.push(date);
        }
        if (days.length >= 7) break; // Stop when we have 7 available days
      }
      
      setAvailableDays(days);
    }
  }, [isDateAvailable, isLoading]);

  const handleViewChange = (newView: 'list' | 'calendar') => {
    if (newView === currentView) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(newView);
      setIsTransitioning(false);
    }, 150);
  };

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
            onContinue={onContinue}
            onGoBack={onGoBack}
            providerId={providerId}
            providerType={providerType}
          />
        ) : (
          <CalendarViewDateSelector
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={onDateSelect}
            onTimeSelect={onTimeSelect}
            onContinue={onContinue}
            onGoBack={onGoBack}
            providerId={providerId}
            providerType={providerType}
          />
        )}
      </div>
    </div>
  );
};

export default DateTimeSelector;

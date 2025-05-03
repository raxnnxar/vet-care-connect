
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/ui/atoms/button';

interface CalendarHeaderProps {
  selectedDate: Date;
  onOpenMonthlyCalendar: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  selectedDate,
  onOpenMonthlyCalendar,
}) => {
  // Function to capitalize the first letter of each word
  const capitalizeFirstLetter = (string: string) => {
    return string.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const currentMonthYear = capitalizeFirstLetter(format(selectedDate, 'MMMM yyyy', { locale: es }));

  return (
    <div className="flex justify-center items-center mb-2">
      <Button
        variant="ghost"
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        onClick={onOpenMonthlyCalendar}
      >
        <h2 className="text-lg font-medium capitalize">
          {currentMonthYear}
        </h2>
        <ChevronDown size={18} className="text-gray-500" />
      </Button>
    </div>
  );
};

export default CalendarHeader;

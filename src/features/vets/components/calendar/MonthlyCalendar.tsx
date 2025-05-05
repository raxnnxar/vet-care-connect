import React from 'react';
import { Dialog, DialogContent, DialogClose } from '@/ui/molecules/dialog';
import { Calendar } from '@/ui/molecules/calendar';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { es } from 'date-fns/locale';
import { format, addMonths, subMonths } from 'date-fns';
import '../styles/calendarShared.css';
import '../styles/monthlyCalendar.css';

interface MonthlyCalendarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  viewDate: Date;
  onMonthChange: (date: Date) => void;
  appointmentDates: Date[];
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  open,
  onOpenChange,
  selectedDate,
  onDateSelect,
  viewDate,
  onMonthChange,
  appointmentDates,
}) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateSelect(date);
      onOpenChange(false);
    }
  };

  // Function to capitalize the first letter of each word
  const capitalizeFirstLetter = (string: string) => {
    return string.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Handle month navigation
  const handlePreviousMonth = () => {
    const previousMonth = subMonths(viewDate, 1);
    onMonthChange(previousMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = addMonths(viewDate, 1);
    onMonthChange(nextMonth);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="calendar-modal calendar-modal-content p-0 sm:max-w-[320px]">
        <DialogClose className="close-button absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </DialogClose>
        
        <div className="p-2">
          <div className="calendar-header flex items-center justify-between">
            <button 
              onClick={handlePreviousMonth}
              className="calendar-nav-arrow"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <h2 className="calendar-title">
              {capitalizeFirstLetter(
                format(viewDate, 'MMMM yyyy', { locale: es })
              )}
            </h2>
            
            <button 
              onClick={handleNextMonth}
              className="calendar-nav-arrow"
              aria-label="Mes siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            month={viewDate}
            onMonthChange={onMonthChange}
            locale={es}
            className="mx-auto"
            classNames={{
              day_today: "rdp-day_today",
              day_selected: "calendar-day-selected",
              day: cn("hover:bg-gray-100 font-medium calendar-day"),
              day_outside: "rdp-day_outside",
              nav_button: "calendar-nav-button hidden", // Hide default navigation buttons
              caption: "calendar-caption",
              month: "calendar-month-header",
              head_cell: "calendar-weekday-heading",
              months: "rdp-months",
              cell: "rdp-cell"
            }}
            components={{
              IconLeft: () => null, // Hide default left arrow
              IconRight: () => null, // Hide default right arrow
              Caption: () => null // Hide default caption as we're providing our own
            }}
            formatters={{
              formatWeekdayName: (day) => {
                // Convert to Spanish short day abbreviations like in the weekly calendar (L, M, M, J, V, S, D)
                const dayMap: Record<string, string> = {
                  'lu': 'L', 'ma': 'M', 'mi': 'M', 'ju': 'J',
                  'vi': 'V', 'sá': 'S', 'do': 'D'
                };
                
                // Format the day properly to get the weekday name
                const weekdayName = format(day, 'EEEEEE', { locale: es }).toLowerCase();
                return dayMap[weekdayName] || weekdayName;
              }
            }}
            modifiersClassNames={{
              selected: "calendar-day-selected",
              today: "calendar-day-today",
              hasAppointment: "day-with-appointment"
            }}
            modifiers={{
              hasAppointment: appointmentDates,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MonthlyCalendar;

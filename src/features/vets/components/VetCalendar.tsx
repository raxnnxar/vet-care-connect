
import React, { useRef, useState, useEffect } from 'react';
import { format, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/ui/molecules/dialog';
import { Calendar } from '@/ui/molecules/calendar';
import { Button } from '@/ui/atoms/button';
import { cn } from '@/lib/utils';
import './styles/calendar.css';
import { useIsMobile } from '@/hooks/use-mobile';

interface VetCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  weeks: Date[][];
  currentWeekIndex: number;
  setCurrentWeekIndex: (index: number) => void;
  appointmentDates: Date[];
  isLoading: boolean;
}

const VetCalendar: React.FC<VetCalendarProps> = ({
  selectedDate,
  onDateSelect,
  weeks,
  currentWeekIndex,
  setCurrentWeekIndex,
  appointmentDates,
  isLoading
}) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selectedDate);
  const isMobile = useIsMobile();

  // Handle calendar scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
    const weekWidth = scrollWidth / weeks.length;
    const newIndex = Math.round(scrollLeft / weekWidth);
    
    // Only update if the index has changed to prevent unnecessary re-renders
    if (newIndex !== currentWeekIndex) {
      setCurrentWeekIndex(newIndex);
    }
  };

  // Handle scroll to the current week
  useEffect(() => {
    if (calendarRef.current) {
      const scrollWidth = calendarRef.current.scrollWidth;
      const numWeeks = weeks.length;
      if (numWeeks > 0) {
        const scrollPosition = (scrollWidth / numWeeks) * currentWeekIndex;
        calendarRef.current.scrollLeft = scrollPosition;
      }
    }
  }, [weeks, currentWeekIndex]);

  // Check if a date has appointments
  const hasAppointmentsOnDate = (date: Date): boolean => {
    return appointmentDates.some(appDate => isSameDay(appDate, date));
  };

  // Get the month and year of the currently visible week
  const currentMonthYear = weeks.length > 0 && currentWeekIndex < weeks.length 
    ? format(selectedDate, 'MMMM yyyy', { locale: es })
    : '';

  // Handle date selection from the month view
  const handleMonthDateSelect = (date: Date) => {
    onDateSelect(date);
    setCalendarOpen(false);
    
    // Find which week contains this date to update the week view
    for (let i = 0; i < weeks.length; i++) {
      if (weeks[i].some(day => isSameDay(day, date))) {
        setCurrentWeekIndex(i);
        break;
      }
    }
  };

  // Navigation between months in the dialog
  const handlePreviousMonth = () => {
    setViewDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setViewDate(prev => addMonths(prev, 1));
  };

  return (
    <div>
      <div className="flex justify-center items-center mb-2">
        <Button
          variant="ghost"
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          onClick={() => setCalendarOpen(true)}
        >
          <h2 className="text-lg font-medium capitalize">
            {currentMonthYear}
          </h2>
          <ChevronDown size={18} className="text-gray-500" />
        </Button>

        <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
          <DialogContent className="calendar-modal p-0 sm:max-w-[320px]">
            <div className="p-4">
              <div className="text-center mb-2">
                <h2 className="text-xl font-semibold capitalize">
                  {format(viewDate, 'MMMM yyyy', { locale: es })}
                </h2>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleMonthDateSelect}
                month={viewDate}
                onMonthChange={setViewDate}
                locale={es}
                className="mx-auto"
                classNames={{
                  day_today: "rdp-day_today",
                  day_selected: "bg-[#79D0B8] text-white hover:bg-[#79D0B8] hover:text-white font-medium",
                  day: cn("hover:bg-gray-100 font-medium"),
                  day_outside: "rdp-day_outside"
                }}
                components={{
                  IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                  IconRight: () => <ChevronRight className="h-4 w-4" />,
                }}
                modifiersClassNames={{
                  selected: "bg-[#79D0B8] text-white",
                  today: "rdp-day_today",
                  hasAppointment: "day-with-appointment"
                }}
                modifiers={{
                  hasAppointment: appointmentDates,
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div 
        className="overflow-x-auto snap-x snap-mandatory scrollbar-hide" 
        onScroll={handleScroll}
        ref={calendarRef}
        style={{ 
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex">
          {weeks.map((week, weekIndex) => (
            <div 
              key={weekIndex} 
              className="flex py-2 px-4 min-w-full snap-center"
              style={{ scrollSnapAlign: 'center' }}
            >
              {week.map((day, dayIndex) => {
                const isSelected = isSameDay(day, selectedDate);
                const dayIsToday = isToday(day);
                const hasAppointments = hasAppointmentsOnDate(day);
                
                return (
                  <div 
                    key={dayIndex} 
                    className="calendar-day-item"
                    onClick={() => onDateSelect(day)}
                  >
                    <span className="text-sm">
                      {format(day, 'EEEEE', { locale: es }).toUpperCase()}
                    </span>
                    <div 
                      className={`w-10 h-10 flex items-center justify-center rounded-full mt-1 ${
                        isSelected ? 'bg-[#79D0B8]' : dayIsToday ? 'border border-[#79D0B8]' : 'bg-transparent'
                      }`}
                    >
                      <span className={`text-lg ${isSelected ? 'text-white' : dayIsToday ? 'text-[#4DA6A8] font-bold' : 'text-[#1F2937]'}`}>
                        {format(day, 'd', { locale: es })}
                      </span>
                    </div>
                    {hasAppointments && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#79D0B8] mt-1"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VetCalendar;

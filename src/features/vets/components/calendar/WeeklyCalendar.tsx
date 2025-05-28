
import React, { useRef, useEffect } from 'react';
import { format, isSameDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import '../styles/calendar.css';

interface WeeklyCalendarProps {
  weeks: Date[][];
  currentWeekIndex: number;
  setCurrentWeekIndex: (index: number) => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  appointmentDates: Date[];
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  weeks,
  currentWeekIndex,
  setCurrentWeekIndex,
  selectedDate,
  onDateSelect,
  appointmentDates,
}) => {
  const calendarRef = useRef<HTMLDivElement>(null);

  // Scroll to current week on mount and when weeks change
  useEffect(() => {
    if (calendarRef.current && weeks.length > 0) {
      const scrollToCurrentWeek = () => {
        if (calendarRef.current) {
          const weekWidth = calendarRef.current.scrollWidth / weeks.length;
          const scrollPosition = currentWeekIndex * weekWidth;
          
          // Scroll immediately without animation for initial load
          calendarRef.current.scrollLeft = scrollPosition;
        }
      };

      // Use multiple methods to ensure the scroll happens
      scrollToCurrentWeek();
      
      // Also use setTimeout to ensure it happens after render
      const timeoutId = setTimeout(scrollToCurrentWeek, 50);
      
      // And requestAnimationFrame for good measure
      requestAnimationFrame(scrollToCurrentWeek);

      return () => clearTimeout(timeoutId);
    }
  }, [weeks, currentWeekIndex]);

  // Check if a date has appointments
  const hasAppointmentsOnDate = (date: Date): boolean => {
    return appointmentDates.some(appDate => isSameDay(appDate, date));
  };

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

  return (
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
  );
};

export default WeeklyCalendar;

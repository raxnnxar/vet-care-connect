
import React, { useRef, useState, useEffect } from 'react';
import { format, isSameDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import './styles/calendar.css';

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
    ? format(weeks[currentWeekIndex][0], 'MMMM yyyy', { locale: es }) 
    : '';

  return (
    <div>
      <div className="flex justify-center items-center mb-2">
        <h2 className="text-lg font-medium">
          {currentMonthYear}
        </h2>
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
              className="flex space-x-4 py-2 px-4 min-w-full snap-center"
              style={{ scrollSnapAlign: 'center' }}
            >
              {week.map((day, dayIndex) => {
                const isSelected = isSameDay(day, selectedDate);
                const dayIsToday = isToday(day);
                const hasAppointments = hasAppointmentsOnDate(day);
                
                return (
                  <div 
                    key={dayIndex} 
                    className={`flex flex-col items-center flex-1 cursor-pointer ${
                      isSelected ? 'text-white' : dayIsToday ? 'text-[#4DA6A8] font-bold' : 'text-[#1F2937]'
                    }`}
                    onClick={() => onDateSelect(day)}
                  >
                    <span className="text-sm">
                      {format(day, 'EEEEE', { locale: es }).toUpperCase()}
                    </span>
                    <div 
                      className={`w-10 h-10 flex items-center justify-center rounded-full mt-1 ${
                        isSelected ? 'bg-[#79D0B8]' : 'bg-transparent'
                      }`}
                    >
                      <span className="text-lg">{format(day, 'd', { locale: es })}</span>
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

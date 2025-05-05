
import React, { useState, useEffect, useRef } from 'react';
import CalendarHeader from './calendar/CalendarHeader';
import WeeklyCalendar from './calendar/WeeklyCalendar';
import MonthlyCalendar from './calendar/MonthlyCalendar';
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
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selectedDate);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Effect to scroll to the current week when component mounts or the week changes
  useEffect(() => {
    if (scrollContainerRef.current && weeks.length > 0) {
      // Get the week container width
      const containerWidth = scrollContainerRef.current.clientWidth;
      
      // Calculate the position to scroll to center the current week
      const scrollPosition = currentWeekIndex * containerWidth;
      
      // Scroll to the calculated position
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentWeekIndex, weeks.length]);

  return (
    <div>
      <CalendarHeader 
        selectedDate={selectedDate} 
        onOpenMonthlyCalendar={() => setCalendarOpen(true)} 
      />
      
      <MonthlyCalendar 
        open={calendarOpen}
        onOpenChange={setCalendarOpen}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        viewDate={viewDate}
        onMonthChange={setViewDate}
        appointmentDates={appointmentDates}
      />
      
      <WeeklyCalendar 
        weeks={weeks}
        currentWeekIndex={currentWeekIndex}
        setCurrentWeekIndex={setCurrentWeekIndex}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        appointmentDates={appointmentDates}
        scrollContainerRef={scrollContainerRef}
      />
    </div>
  );
};

export default VetCalendar;

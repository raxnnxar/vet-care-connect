
import React, { useState } from 'react';
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
      />
    </div>
  );
};

export default VetCalendar;

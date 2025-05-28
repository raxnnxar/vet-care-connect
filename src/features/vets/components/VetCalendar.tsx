
import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  const currentWeek = weeks[currentWeekIndex] || [];
  const monthYear = format(selectedDate, 'MMMM yyyy', { locale: es });

  const goToPreviousWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
    }
  };

  const goToNextWeek = () => {
    if (currentWeekIndex < weeks.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1);
    }
  };

  const hasAppointment = (date: Date) => {
    return appointmentDates.some(appointmentDate => 
      isSameDay(appointmentDate, date)
    );
  };

  const handleAgendaClick = () => {
    navigate('/vet/agenda');
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      {/* Header with month/year and agenda button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#1F2937] capitalize">
          {monthYear}
        </h2>
        <button
          onClick={handleAgendaClick}
          className="flex items-center space-x-2 bg-[#79D0B8] hover:bg-[#5FBFB3] text-white px-3 py-2 rounded-lg transition-colors"
        >
          <Calendar size={18} />
          <span className="text-sm font-medium">Agenda</span>
        </button>
      </div>
      
      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousWeek}
          disabled={currentWeekIndex === 0}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        
        <div className="flex space-x-1 overflow-x-auto">
          {currentWeek.map((date, index) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            const hasAppointmentOnDate = hasAppointment(date);
            
            return (
              <button
                key={index}
                onClick={() => onDateSelect(date)}
                className={`flex flex-col items-center p-3 rounded-lg min-w-[60px] transition-colors ${
                  isSelected
                    ? 'bg-[#79D0B8] text-white'
                    : isToday
                    ? 'bg-[#79D0B8]/20 text-[#4DA6A8] font-medium'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-xs uppercase font-medium">
                  {format(date, 'EEE', { locale: es })}
                </span>
                <span className="text-lg font-semibold mt-1">
                  {format(date, 'd')}
                </span>
                {hasAppointmentOnDate && (
                  <div className={`w-2 h-2 rounded-full mt-1 ${
                    isSelected ? 'bg-white' : 'bg-[#79D0B8]'
                  }`} />
                )}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={goToNextWeek}
          disabled={currentWeekIndex === weeks.length - 1}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default VetCalendar;

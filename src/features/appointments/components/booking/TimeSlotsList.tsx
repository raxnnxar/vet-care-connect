
import React, { useRef } from 'react';
import { isSameDay } from 'date-fns';

interface TimeSlotsListProps {
  timeSlots: string[];
  selectedDate: Date | null;
  selectedTime: string | null;
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
}

const TimeSlotsList: React.FC<TimeSlotsListProps> = ({
  timeSlots,
  selectedDate,
  selectedTime,
  currentDate,
  onDateSelect,
  onTimeSelect
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTimeSelect = (time: string) => {
    onDateSelect(currentDate);
    onTimeSelect(time);
  };

  const isTimeSelected = (time: string): boolean => {
    return selectedDate && 
           isSameDay(selectedDate, currentDate) && 
           selectedTime === time;
  };

  return (
    <div className="p-4">
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {timeSlots.map((time) => {
          const isSelected = isTimeSelected(time);
          
          return (
            <button
              key={time}
              onClick={() => handleTimeSelect(time)}
              className={`
                flex-shrink-0 px-4 py-3 rounded-xl font-medium text-sm
                transition-all duration-200 min-w-[80px]
                ${isSelected
                  ? 'bg-[#4BA68D] text-white shadow-lg transform scale-105'
                  : 'bg-[#5ECBAD]/10 text-[#4BA68D] border border-[#5ECBAD]/20 hover:bg-[#5ECBAD]/20 hover:border-[#5ECBAD]/40'
                }
              `}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotsList;

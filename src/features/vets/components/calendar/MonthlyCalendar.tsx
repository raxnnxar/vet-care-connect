
import React from 'react';
import { Dialog, DialogContent } from '@/ui/molecules/dialog';
import { Calendar } from '@/ui/molecules/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { es } from 'date-fns/locale';
import '../styles/calendar.css';

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="calendar-modal p-0 sm:max-w-[320px]">
        <div className="p-4">
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
              day_selected: "bg-[#79D0B8] text-white hover:bg-[#79D0B8] hover:text-white font-medium",
              day: cn("hover:bg-gray-100 font-medium"),
              day_outside: "rdp-day_outside",
              nav_button: "calendar-nav-button",
              caption: "calendar-caption"
            }}
            components={{
              IconLeft: () => <ChevronLeft className="h-4 w-4" />,
              IconRight: () => <ChevronRight className="h-4 w-4" />,
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

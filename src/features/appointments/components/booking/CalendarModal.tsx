
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/molecules/dialog';
import { Calendar } from '@/ui/molecules/calendar';

interface CalendarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  onDateSelect: (date: Date | undefined) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  open,
  onOpenChange,
  selectedDate,
  onDateSelect
}) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateSelect(date);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Seleccionar Fecha</DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date()}
            initialFocus
            className="rounded-md border-none"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarModal;

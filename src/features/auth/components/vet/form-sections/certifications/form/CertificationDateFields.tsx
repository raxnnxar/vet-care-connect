
import React from 'react';
import { Label } from '@/ui/atoms/label';
import { Button } from '@/ui/atoms/button';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/molecules/popover';
import { Calendar as CalendarComponent } from '@/ui/molecules/calendar';

interface CertificationDateFieldsProps {
  issueDate: string;
  expiryDate: string;
  errors: Record<string, string>;
  onDateSelect: (field: string, date: Date | undefined) => void;
  onClearExpiryDate: () => void;
}

const CertificationDateFields: React.FC<CertificationDateFieldsProps> = ({
  issueDate,
  expiryDate,
  errors,
  onDateSelect,
  onClearExpiryDate
}) => {
  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return '';
      return format(new Date(dateStr), 'dd MMM yyyy', { locale: es });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="issue_date">
          Fecha de Emisión
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left ${
                errors.issue_date ? "border-red-500" : ""
              }`}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {issueDate ? (
                formatDate(issueDate)
              ) : (
                <span>Seleccionar Fecha</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={issueDate ? new Date(issueDate) : undefined}
              onSelect={(date) => onDateSelect('issue_date', date)}
              disabled={(date) => date > new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.issue_date && (
          <p className="text-sm text-red-500">{errors.issue_date}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiry_date">Fecha de Vencimiento (Opcional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {expiryDate ? (
                formatDate(expiryDate)
              ) : (
                <span>Seleccionar Fecha</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={expiryDate ? new Date(expiryDate) : undefined}
              onSelect={(date) => onDateSelect('expiry_date', date)}
              disabled={(date) => {
                if (!issueDate) return true;
                return date < new Date(issueDate);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClearExpiryDate}
          className="mt-1 text-xs text-gray-500 hover:text-gray-700 h-7"
        >
          Limpiar fecha
        </Button>
      </div>
    </div>
  );
};

export default CertificationDateFields;

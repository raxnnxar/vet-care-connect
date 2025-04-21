
import React from 'react';
import { Info } from 'lucide-react';
import { Control } from 'react-hook-form';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/ui/molecules/form';
import { Input } from '@/ui/atoms/input';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/ui/molecules/tooltip';

interface PhoneNumberFieldProps {
  control: Control<any>;
}

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-2 mb-1.5">
            <FormLabel className="text-base font-medium">Número de Teléfono</FormLabel>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[280px]">
                  <p className="text-sm">
                    Tu número de teléfono se utilizará como contacto de emergencia
                    para los veterinarios y para prevenir el abandono de mascotas.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <FormControl>
            <Input 
              placeholder="Ej: +123456789" 
              {...field} 
              className="text-base md:text-sm"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhoneNumberField;

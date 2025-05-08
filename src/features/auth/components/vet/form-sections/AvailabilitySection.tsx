
import React from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';
import { VeterinarianProfile, DaySchedule } from '../../../types/veterinarianTypes';
import { Switch } from '@/ui/atoms/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/molecules/select';
import { Clock } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem, 
  AccordionTrigger 
} from '@/ui/molecules/accordion';

interface AvailabilitySectionProps {
  control: Control<VeterinarianProfile>;
  errors: any; // Use 'any' for errors until we can properly type them
}

const WEEKDAYS = [
  { id: 'monday', label: 'Lunes' },
  { id: 'tuesday', label: 'Martes' },
  { id: 'wednesday', label: 'Miércoles' },
  { id: 'thursday', label: 'Jueves' },
  { id: 'friday', label: 'Viernes' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' },
];

const HOURS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({
  control,
  errors,
}) => {
  // Use useWatch to get the current value of availability
  const availability = useWatch({
    control,
    name: 'availability',
    defaultValue: {},
  });

  return (
    <div className="space-y-6">
      <p className="text-gray-500 text-sm">
        Establece tu horario de disponibilidad para que los dueños de mascotas puedan programar citas contigo
      </p>
      
      <div className="overflow-hidden bg-white rounded-lg border">
        {/* Vista móvil: Diseño en acordeón */}
        <div className="md:hidden">
          <Accordion type="single" collapsible className="w-full">
            {WEEKDAYS.map((day) => (
              <AccordionItem key={day.id} value={day.id}>
                <AccordionTrigger className="flex justify-between items-center px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{day.label}</span>
                    <Controller
                      name={`availability.${day.id}` as any}
                      control={control}
                      defaultValue={{ isAvailable: false, startTime: '09:00', endTime: '18:00' } as DaySchedule}
                      render={({ field }) => {
                        // Since we're using `as any` for the name, we need to ensure type safety here
                        const daySchedule = field.value as DaySchedule | undefined;
                        
                        return (
                          <Switch
                            checked={daySchedule?.isAvailable ?? false}
                            onCheckedChange={(checked) => {
                              field.onChange({
                                ...daySchedule,
                                isAvailable: checked
                              });
                            }}
                            id={`${day.id}-available-mobile`}
                          />
                        );
                      }}
                    />
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4">
                  <Controller
                    name={`availability.${day.id}` as any}
                    control={control}
                    defaultValue={{ isAvailable: false, startTime: '09:00', endTime: '18:00' } as DaySchedule}
                    render={({ field }) => {
                      const daySchedule = field.value as DaySchedule | undefined;
                      const isAvailable = daySchedule?.isAvailable ?? false;
                      
                      if (!isAvailable) return null;
                      
                      return (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Hora inicio</label>
                            <Select
                              value={daySchedule?.startTime || '09:00'}
                              onValueChange={(value) => {
                                field.onChange({
                                  ...daySchedule,
                                  startTime: value,
                                  endTime: daySchedule?.endTime && value >= daySchedule.endTime
                                    ? value
                                    : daySchedule?.endTime || '18:00'
                                });
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-3 w-3 text-gray-400" />
                                  <SelectValue placeholder="Inicio" />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                {HOURS.map((hour) => (
                                  <SelectItem 
                                    key={hour} 
                                    value={hour}
                                    disabled={daySchedule?.endTime && hour >= daySchedule.endTime}
                                  >
                                    {hour}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Hora fin</label>
                            <Select
                              value={daySchedule?.endTime || '18:00'}
                              onValueChange={(value) => {
                                field.onChange({
                                  ...daySchedule,
                                  endTime: value
                                });
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-3 w-3 text-gray-400" />
                                  <SelectValue placeholder="Fin" />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                {HOURS.map((hour) => (
                                  <SelectItem 
                                    key={hour} 
                                    value={hour}
                                    disabled={daySchedule?.startTime && hour <= daySchedule.startTime}
                                  >
                                    {hour}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      );
                    }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        {/* Vista escritorio: Diseño en tabla */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Día
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Disponible
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horario
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {WEEKDAYS.map((day) => (
                <tr key={day.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {day.label}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Controller
                      name={`availability.${day.id}` as any}
                      control={control}
                      defaultValue={{ isAvailable: false, startTime: '09:00', endTime: '18:00' } as DaySchedule}
                      render={({ field }) => {
                        const daySchedule = field.value as DaySchedule | undefined;
                        
                        return (
                          <Switch
                            checked={daySchedule?.isAvailable ?? false}
                            onCheckedChange={(checked) => {
                              field.onChange({
                                ...daySchedule,
                                isAvailable: checked
                              });
                            }}
                            id={`${day.id}-available`}
                          />
                        );
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Controller
                      name={`availability.${day.id}` as any}
                      control={control}
                      defaultValue={{ isAvailable: false, startTime: '09:00', endTime: '18:00' } as DaySchedule}
                      render={({ field }) => {
                        const daySchedule = field.value as DaySchedule | undefined;
                        const isAvailable = daySchedule?.isAvailable ?? false;
                        
                        return (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Select
                                disabled={!isAvailable}
                                value={daySchedule?.startTime || '09:00'}
                                onValueChange={(value) => {
                                  field.onChange({
                                    ...daySchedule,
                                    startTime: value,
                                    endTime: daySchedule?.endTime && value >= daySchedule.endTime
                                      ? value
                                      : daySchedule?.endTime || '18:00'
                                  });
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <div className="flex items-center">
                                    <Clock className="mr-2 h-3 w-3 text-gray-400" />
                                    <SelectValue placeholder="Inicio" />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  {HOURS.map((hour) => (
                                    <SelectItem 
                                      key={hour} 
                                      value={hour}
                                      disabled={daySchedule?.endTime && hour >= daySchedule.endTime}
                                    >
                                      {hour}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Select
                                disabled={!isAvailable}
                                value={daySchedule?.endTime || '18:00'}
                                onValueChange={(value) => {
                                  field.onChange({
                                    ...daySchedule,
                                    endTime: value
                                  });
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <div className="flex items-center">
                                    <Clock className="mr-2 h-3 w-3 text-gray-400" />
                                    <SelectValue placeholder="Fin" />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  {HOURS.map((hour) => (
                                    <SelectItem 
                                      key={hour} 
                                      value={hour}
                                      disabled={daySchedule?.startTime && hour <= daySchedule.startTime}
                                    >
                                      {hour}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        );
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
        <p className="text-yellow-800 text-sm">
          <strong>Importante:</strong> Estos horarios serán visibles para los dueños de mascotas y se utilizarán para programar citas. Asegúrate de que reflejen tu disponibilidad real.
        </p>
      </div>
    </div>
  );
};

export default AvailabilitySection;

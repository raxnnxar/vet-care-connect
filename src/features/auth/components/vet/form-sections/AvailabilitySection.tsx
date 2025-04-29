
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { VeterinarianProfile, DaySchedule } from '../../../types/veterinarianTypes';
import { Label } from '@/ui/atoms/label';
import { Switch } from '@/ui/atoms/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/molecules/select';
import { Clock } from 'lucide-react';

interface AvailabilitySectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
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
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Disponibilidad</h2>
      
      <div className="overflow-hidden bg-white rounded-lg border">
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
                    name={`availability.${day.id}.isAvailable`}
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id={`${day.id}-available`}
                      />
                    )}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Controller
                    name={`availability.${day.id}`}
                    control={control}
                    defaultValue={{ isAvailable: false, startTime: '09:00', endTime: '18:00' } as DaySchedule}
                    render={({ field }) => {
                      const isAvailable = field.value?.isAvailable;
                      
                      return (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Select
                              disabled={!isAvailable}
                              value={field.value?.startTime || '09:00'}
                              onValueChange={(value) => {
                                field.onChange({
                                  ...field.value,
                                  startTime: value,
                                  // Ensure end time is after start time
                                  endTime: field.value?.endTime && value >= field.value.endTime
                                    ? value
                                    : field.value?.endTime || '18:00'
                                });
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-3 w-3 text-gray-400" />
                                  <SelectValue placeholder="Hora inicio" />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                {HOURS.map((hour) => (
                                  <SelectItem 
                                    key={hour} 
                                    value={hour}
                                    disabled={field.value?.endTime && hour >= field.value.endTime}
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
                              value={field.value?.endTime || '18:00'}
                              onValueChange={(value) => {
                                field.onChange({
                                  ...field.value,
                                  endTime: value
                                });
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-3 w-3 text-gray-400" />
                                  <SelectValue placeholder="Hora fin" />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                {HOURS.map((hour) => (
                                  <SelectItem 
                                    key={hour} 
                                    value={hour}
                                    disabled={field.value?.startTime && hour <= field.value.startTime}
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
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
        <p className="text-yellow-800 text-sm">
          <strong>Importante:</strong> Estos horarios serán visibles para los dueños de mascotas y se utilizarán para programar citas. Asegúrate de que reflejen tu disponibilidad real.
        </p>
      </div>
    </div>
  );
};

export default AvailabilitySection;

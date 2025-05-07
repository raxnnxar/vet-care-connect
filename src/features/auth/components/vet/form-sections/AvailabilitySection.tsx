
import React from 'react';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { VeterinarianProfile, DaySchedule } from '../../../types/veterinarianTypes';
import { Switch } from '@/ui/atoms/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/molecules/select';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/ui/atoms/button';

interface AvailabilitySectionProps {
  control: Control<VeterinarianProfile>;
  errors: any;
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
      <p className="text-gray-500 text-sm">
        Establece tu horario de disponibilidad para que los dueños de mascotas puedan programar citas contigo
      </p>
      
      <div className="overflow-hidden bg-white rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Día
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Disponible
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horarios
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
                    defaultValue={{ isAvailable: false, schedules: [] }}
                    render={({ field }) => {
                      // Asegurarse de que el valor es un objeto válido
                      const dayData = field.value || { isAvailable: false, schedules: [] };
                      
                      // Asegurarse de que schedules siempre sea un array
                      const schedules = Array.isArray(dayData.schedules) ? dayData.schedules : [];
                      
                      // Si no hay horarios y el día está disponible, añadir uno por defecto
                      if (dayData.isAvailable && schedules.length === 0) {
                        schedules.push({ startTime: '09:00', endTime: '18:00' });
                      }

                      const handleAddSchedule = () => {
                        const lastSchedule = schedules[schedules.length - 1];
                        const newStartTime = lastSchedule ? lastSchedule.endTime : '09:00';
                        const newEndTime = HOURS.indexOf(newStartTime) + 4 < HOURS.length 
                          ? HOURS[HOURS.indexOf(newStartTime) + 4]
                          : HOURS[HOURS.length - 1];
                        
                        field.onChange({
                          ...dayData,
                          schedules: [...schedules, { startTime: newStartTime, endTime: newEndTime }]
                        });
                      };

                      const handleRemoveSchedule = (index: number) => {
                        const newSchedules = [...schedules];
                        newSchedules.splice(index, 1);
                        field.onChange({
                          ...dayData,
                          schedules: newSchedules
                        });
                      };

                      const updateSchedule = (index: number, key: 'startTime' | 'endTime', value: string) => {
                        const newSchedules = [...schedules];
                        newSchedules[index] = { ...newSchedules[index], [key]: value };
                        
                        // Si la hora de inicio es después de la hora de fin, actualizar la hora de fin
                        if (key === 'startTime' && newSchedules[index].startTime > newSchedules[index].endTime) {
                          newSchedules[index].endTime = newSchedules[index].startTime;
                        }
                        
                        field.onChange({
                          ...dayData,
                          schedules: newSchedules
                        });
                      };

                      return !dayData.isAvailable ? (
                        <div className="text-gray-400 italic">No disponible</div>
                      ) : (
                        <div className="space-y-4">
                          {schedules.map((schedule, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="flex-1">
                                <Select
                                  value={schedule.startTime}
                                  onValueChange={(value) => updateSchedule(index, 'startTime', value)}
                                >
                                  <SelectTrigger>
                                    <div className="flex items-center">
                                      <Clock className="mr-2 h-3 w-3 text-gray-400" />
                                      <SelectValue />
                                    </div>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {HOURS.map((hour) => (
                                      <SelectItem 
                                        key={hour} 
                                        value={hour}
                                        disabled={schedule.endTime && hour >= schedule.endTime}
                                      >
                                        {hour}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <span className="text-gray-500">a</span>
                              <div className="flex-1">
                                <Select
                                  value={schedule.endTime}
                                  onValueChange={(value) => updateSchedule(index, 'endTime', value)}
                                >
                                  <SelectTrigger>
                                    <div className="flex items-center">
                                      <Clock className="mr-2 h-3 w-3 text-gray-400" />
                                      <SelectValue />
                                    </div>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {HOURS.map((hour) => (
                                      <SelectItem 
                                        key={hour} 
                                        value={hour}
                                        disabled={schedule.startTime && hour <= schedule.startTime}
                                      >
                                        {hour}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              {schedules.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-600"
                                  onClick={() => handleRemoveSchedule(index)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2 text-xs"
                            onClick={handleAddSchedule}
                          >
                            <Plus size={14} className="mr-1" />
                            Añadir horario
                          </Button>
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

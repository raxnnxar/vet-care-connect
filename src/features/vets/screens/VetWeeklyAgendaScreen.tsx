
import React, { useState, useEffect } from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { ArrowLeft, Dog, Cat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { getVetAppointments, Appointment } from '../api/vetAppointmentsApi';
import { useVetProfileData } from '@/features/auth/hooks/useVetProfileData';
import { APPOINTMENT_STATUS } from '@/core/constants/app.constants';

const VetWeeklyAgendaScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const { initialData: vetProfile } = useVetProfileData(user?.id);
  
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(currentWeekStart, i)
  );

  // Get dynamic time range based on vet availability
  const getDynamicTimeRange = () => {
    if (!vetProfile?.availability) return { start: '09:00', end: '18:00' };
    
    let earliestStart = '23:59';
    let latestEnd = '00:00';
    
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    dayKeys.forEach(dayKey => {
      const daySchedule = vetProfile.availability[dayKey as keyof typeof vetProfile.availability];
      if (daySchedule?.isAvailable) {
        const startTime = daySchedule.startTime || '09:00';
        const endTime = daySchedule.endTime || '18:00';
        
        if (startTime < earliestStart) earliestStart = startTime;
        if (endTime > latestEnd) latestEnd = endTime;
      }
    });
    
    return {
      start: earliestStart !== '23:59' ? earliestStart : '09:00',
      end: latestEnd !== '00:00' ? latestEnd : '18:00'
    };
  };

  // Generate time slots based on dynamic range
  const generateTimeSlots = () => {
    const { start, end } = getDynamicTimeRange();
    const slots = [];
    
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      slots.push(timeStr);
      
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour++;
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Check if vet is available on a specific day
  const isVetAvailable = (date: Date) => {
    if (!vetProfile?.availability) return false;
    
    const dayName = format(date, 'EEEE', { locale: es }).toLowerCase();
    const dayMap: { [key: string]: string } = {
      'lunes': 'monday',
      'martes': 'tuesday',
      'miércoles': 'wednesday',
      'jueves': 'thursday',
      'viernes': 'friday',
      'sábado': 'saturday',
      'domingo': 'sunday'
    };
    
    const dayKey = dayMap[dayName];
    const daySchedule = vetProfile.availability[dayKey as keyof typeof vetProfile.availability];
    
    return daySchedule?.isAvailable || false;
  };

  // Get vet working hours for a specific day
  const getVetWorkingHours = (date: Date) => {
    if (!vetProfile?.availability) return { start: '09:00', end: '18:00' };
    
    const dayName = format(date, 'EEEE', { locale: es }).toLowerCase();
    const dayMap: { [key: string]: string } = {
      'lunes': 'monday',
      'martes': 'tuesday',
      'miércoles': 'wednesday',
      'jueves': 'thursday',
      'viernes': 'friday',
      'sábado': 'saturday',
      'domingo': 'sunday'
    };
    
    const dayKey = dayMap[dayName];
    const daySchedule = vetProfile.availability[dayKey as keyof typeof vetProfile.availability];
    
    return {
      start: daySchedule?.startTime || '09:00',
      end: daySchedule?.endTime || '18:00'
    };
  };

  // Check if time slot is within working hours for a specific day
  const isTimeSlotAvailable = (date: Date, timeSlot: string) => {
    if (!isVetAvailable(date)) return false;
    
    const { start, end } = getVetWorkingHours(date);
    return timeSlot >= start && timeSlot <= end;
  };

  // Get appointment for specific date and time
  const getAppointmentForSlot = (date: Date, timeSlot: string) => {
    return appointments.find(appointment => {
      try {
        let appointmentDate;
        let appointmentTime;
        
        if (typeof appointment.appointment_date === 'string') {
          appointmentDate = parseISO(appointment.appointment_date);
          appointmentTime = format(appointmentDate, 'HH:mm');
        } else if (typeof appointment.appointment_date === 'object') {
          const dateObj = appointment.appointment_date as any;
          appointmentDate = parseISO(dateObj.date);
          appointmentTime = dateObj.time;
        }
        
        return isSameDay(appointmentDate, date) && appointmentTime === timeSlot;
      } catch (error) {
        console.error('Error parsing appointment date:', error);
        return false;
      }
    });
  };

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const allAppointments = await getVetAppointments(user.id);
        const confirmedAppointments = allAppointments.filter(appointment => 
          appointment.status === APPOINTMENT_STATUS.CONFIRMED || 
          appointment.status === 'programada'
        );
        setAppointments(confirmedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, [user?.id]);

  const goToPreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const getPetIcon = (petName: string) => {
    // Simple logic to determine pet type based on name or could be improved with actual pet data
    return <Cat size={16} className="text-[#4DA6A8]" />;
  };

  return (
    <LayoutBase
      header={
        <div className="flex items-center justify-between px-4 py-3 bg-[#79D0B8]">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/vet')}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={24} className="text-white" />
            </button>
            <h1 className="text-white font-medium text-lg">Agenda Semanal</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousWeek}
              className="p-2 rounded-full hover:bg-white/20 text-white"
            >
              ‹
            </button>
            <span className="text-white font-medium">
              {format(currentWeekStart, 'd MMM', { locale: es })} - {format(addDays(currentWeekStart, 6), 'd MMM yyyy', { locale: es })}
            </span>
            <button
              onClick={goToNextWeek}
              className="p-2 rounded-full hover:bg-white/20 text-white"
            >
              ›
            </button>
          </div>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4 pb-20">
        {/* Week header */}
        <div className="grid grid-cols-8 gap-1 mb-4 sticky top-0 bg-white z-10 py-2">
          <div className="text-xs font-medium text-gray-500 p-2">Hora</div>
          {weekDays.map((day, index) => {
            const dayAvailable = isVetAvailable(day);
            return (
              <div key={index} className="text-center p-2">
                <div className="text-xs font-medium text-gray-500 uppercase">
                  {format(day, 'EEE', { locale: es })}
                </div>
                <div className="text-lg font-semibold text-[#1F2937] mt-1">
                  {format(day, 'd')}
                </div>
                {!dayAvailable && (
                  <div className="text-xs text-red-500 mt-1">Cerrado</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Time slots grid */}
        <div className="space-y-0 max-h-[70vh] overflow-y-auto">
          {timeSlots.map((timeSlot, timeIndex) => (
            <div key={timeIndex} className="grid grid-cols-8 gap-1 border-b border-gray-100">
              {/* Time label */}
              <div className="text-xs text-gray-500 p-2 text-right pr-4">
                {timeSlot}
              </div>
              
              {/* Day columns */}
              {weekDays.map((day, dayIndex) => {
                const isDayAvailable = isVetAvailable(day);
                const isSlotAvailable = isTimeSlotAvailable(day, timeSlot);
                const appointment = getAppointmentForSlot(day, timeSlot);
                
                // If day is not available, show closed column
                if (!isDayAvailable) {
                  return (
                    <div 
                      key={dayIndex} 
                      className="h-8 bg-red-100 border-r border-gray-200"
                    />
                  );
                }
                
                // If slot is not within working hours, show empty
                if (!isSlotAvailable) {
                  return (
                    <div 
                      key={dayIndex} 
                      className="h-8 bg-gray-50 border-r border-gray-100"
                    />
                  );
                }
                
                return (
                  <div 
                    key={dayIndex} 
                    className="h-8 bg-[#79D0B8]/10 border-r border-gray-100 relative"
                  >
                    {appointment && (
                      <div className="h-full bg-[#79D0B8] text-white text-xs p-1 rounded flex items-center justify-center overflow-hidden">
                        {getPetIcon(appointment.petName || '')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </LayoutBase>
  );
};

export default VetWeeklyAgendaScreen;

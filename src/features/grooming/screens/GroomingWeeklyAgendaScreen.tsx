
import React, { useState, useEffect } from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { ArrowLeft, Scissors } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { getGroomingAppointments, Appointment } from '../api/groomingAppointmentsApi';
import { useGroomingProfileData } from '@/features/auth/hooks/useGroomingProfileData';
import { APPOINTMENT_STATUS } from '@/core/constants/app.constants';

const GroomingWeeklyAgendaScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const { initialData: groomingProfile } = useGroomingProfileData(user?.id);
  
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(currentWeekStart, i)
  );

  // Get the overall time range based on grooming availability for the entire week
  const getWeekTimeRange = () => {
    if (!groomingProfile?.availability) return { start: '09:00', end: '18:00' };
    
    let earliestStart = '23:59';
    let latestEnd = '00:00';
    
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    dayKeys.forEach(dayKey => {
      const daySchedule = groomingProfile.availability[dayKey as keyof typeof groomingProfile.availability];
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

  // Generate time slots based on the week's overall time range
  const generateTimeSlots = () => {
    const { start, end } = getWeekTimeRange();
    const slots = [];
    
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    // Generate slots until we reach the end time
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

  // Check if grooming is available on a specific day
  const isGroomingAvailable = (date: Date) => {
    if (!groomingProfile?.availability) return false;
    
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
    const daySchedule = groomingProfile.availability[dayKey as keyof typeof groomingProfile.availability];
    
    return daySchedule?.isAvailable || false;
  };

  // Get grooming working hours for a specific day
  const getGroomingWorkingHours = (date: Date) => {
    if (!groomingProfile?.availability) return { start: '09:00', end: '18:00' };
    
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
    const daySchedule = groomingProfile.availability[dayKey as keyof typeof groomingProfile.availability];
    
    return {
      start: daySchedule?.startTime || '09:00',
      end: daySchedule?.endTime || '18:00'
    };
  };

  // Check if time slot is within working hours for a specific day
  const isTimeSlotAvailable = (date: Date, timeSlot: string) => {
    if (!isGroomingAvailable(date)) return false;
    
    const { start, end } = getGroomingWorkingHours(date);
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
        const allAppointments = await getGroomingAppointments(user.id);
        const confirmedAppointments = allAppointments.filter(appointment => 
          appointment.status === APPOINTMENT_STATUS.CONFIRMED || 
          appointment.status === 'programada'
        );
        setAppointments(confirmedAppointments);
      } catch (error) {
        console.error('Error fetching grooming appointments:', error);
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
    return <Scissors size={16} className="text-[#4DA6A8]" />;
  };

  return (
    <LayoutBase
      header={
        <div className="flex items-center justify-between px-4 py-3 bg-[#79D0B8]">
          <button
            onClick={() => navigate('/grooming')}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPreviousWeek}
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <span className="text-lg">‹</span>
            </button>
            <span className="text-white font-medium text-lg">
              {format(currentWeekStart, 'd MMM', { locale: es })} - {format(addDays(currentWeekStart, 6), 'd MMM yyyy', { locale: es })}
            </span>
            <button
              onClick={goToNextWeek}
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <span className="text-lg">›</span>
            </button>
          </div>
          
          <div className="w-10"></div>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="flex flex-col h-full">
        {/* Fixed Week header with rounded design */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="grid grid-cols-8 gap-1 p-4">
            <div className="text-xs font-medium text-gray-500 p-2">Hora</div>
            {weekDays.map((day, index) => {
              const dayAvailable = isGroomingAvailable(day);
              const { start: dayStart, end: dayEnd } = getGroomingWorkingHours(day);
              
              return (
                <div 
                  key={index} 
                  className={`text-center p-3 rounded-xl ${
                    dayAvailable 
                      ? 'bg-gray-50' 
                      : 'bg-red-100'
                  }`}
                >
                  <div className="text-xs font-medium text-gray-500 uppercase">
                    {format(day, 'EEE', { locale: es })}
                  </div>
                  <div className={`text-lg font-semibold mt-1 ${
                    dayAvailable ? 'text-[#1F2937]' : 'text-red-500'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  {dayAvailable && (
                    <div className="text-xs text-gray-400 mt-1">
                      {dayStart} - {dayEnd}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable Time slots grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-0">
            {timeSlots.map((timeSlot, timeIndex) => (
              <div key={timeIndex} className="grid grid-cols-8 gap-1 border-b border-gray-100 px-4">
                {/* Time label */}
                <div className="text-xs text-gray-500 p-2 text-right pr-4">
                  {timeSlot}
                </div>
                
                {/* Day columns */}
                {weekDays.map((day, dayIndex) => {
                  const isDayAvailable = isGroomingAvailable(day);
                  const isSlotAvailable = isTimeSlotAvailable(day, timeSlot);
                  const appointment = getAppointmentForSlot(day, timeSlot);
                  
                  // If day is not available, show closed column
                  if (!isDayAvailable) {
                    return (
                      <div 
                        key={dayIndex} 
                        className="h-8 bg-red-100 border-r border-gray-200 rounded-sm"
                      />
                    );
                  }
                  
                  // If slot is not within working hours, show empty
                  if (!isSlotAvailable) {
                    return (
                      <div 
                        key={dayIndex} 
                        className="h-8 bg-gray-50 border-r border-gray-100 rounded-sm"
                      />
                    );
                  }
                  
                  return (
                    <div 
                      key={dayIndex} 
                      className="h-8 bg-[#79D0B8]/10 border-r border-gray-100 relative rounded-sm"
                    >
                      {appointment && (
                        <div className="h-full bg-[#79D0B8] text-white text-xs p-1 rounded-sm flex items-center justify-center overflow-hidden">
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
      </div>
    </LayoutBase>
  );
};

export default GroomingWeeklyAgendaScreen;

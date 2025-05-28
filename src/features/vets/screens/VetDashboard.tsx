import React, { useState, useEffect } from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/ui/molecules/card';
import { format, addDays, startOfWeek, endOfWeek, addWeeks, subWeeks, startOfDay } from 'date-fns';
import { useSelector } from 'react-redux';
import { getVetAppointments, getVetAppointmentsByDate, getVetAppointmentDates, Appointment } from '../api/vetAppointmentsApi';
import { toast } from 'sonner';
import { APPOINTMENT_STATUS } from '@/core/constants/app.constants';
import VetSearchHeader from '../components/VetSearchHeader';
import VetCalendar from '../components/VetCalendar';
import VetAppointmentsList from '../components/VetAppointmentsList';
import PendingRequestsList from '../components/PendingRequestsList';

const VetDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const [weeks, setWeeks] = useState<Date[][]>([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(5);
  const { user } = useSelector((state: any) => state.auth);
  
  // State for appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [appointmentDates, setAppointmentDates] = useState<Date[]>([]);

  // Generate weeks of days
  useEffect(() => {
    const generateWeeks = () => {
      const weeksArray: Date[][] = [];
      const currentDate = new Date();
      
      for (let i = -5; i < 5; i++) {
        const weekStartDate = startOfWeek(addWeeks(currentDate, i), { weekStartsOn: 1 });
        const weekDays: Date[] = [];
        
        for (let j = 0; j < 7; j++) {
          weekDays.push(addDays(weekStartDate, j));
        }
        
        weeksArray.push(weekDays);
      }
      
      return weeksArray;
    };
    
    setWeeks(generateWeeks());
  }, []);

  // Fetch logged-in vet's appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        console.log('Fetching appointments for vet:', user.id);
        
        // Fetch all appointments for the logged-in vet
        const allAppointments = await getVetAppointments(user.id);
        console.log('All vet appointments:', allAppointments);
        
        // Extract unique dates for the appointment indicators (all statuses)
        const dates = allAppointments.map(app => {
          try {
            if (app.appointment_date.includes('T')) {
              return new Date(app.appointment_date);
            }
            return new Date(app.appointment_date);
          } catch (err) {
            console.error('Error parsing appointment date for calendar:', err);
            return new Date();
          }
        });
        setAppointmentDates(dates);
        
        // Get today's confirmed appointments by default
        const todayAppointments = await getVetAppointmentsByDate(user.id, selectedDate);
        const confirmedTodayAppointments = todayAppointments.filter(appointment => 
          appointment.status === APPOINTMENT_STATUS.CONFIRMED
        );
        
        console.log('Today confirmed appointments:', confirmedTodayAppointments);
        setAppointments(confirmedTodayAppointments);
      } catch (error) {
        console.error('Error fetching vet appointments:', error);
        toast.error('Error al cargar las citas');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, [user?.id, selectedDate]);

  // Fetch confirmed appointments for the selected date
  useEffect(() => {
    const fetchAppointmentsByDate = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        console.log('Fetching appointments for selected date:', format(selectedDate, 'yyyy-MM-dd'));
        
        const dateAppointments = await getVetAppointmentsByDate(user.id, selectedDate);
        console.log('Appointments for selected date:', dateAppointments);
        
        // Filter only confirmed appointments (programada)
        const confirmedAppointments = dateAppointments.filter(appointment => 
          appointment.status === APPOINTMENT_STATUS.CONFIRMED
        );
        
        console.log('Confirmed appointments for selected date:', confirmedAppointments);
        setAppointments(confirmedAppointments);
      } catch (error) {
        console.error('Error fetching appointments by date:', error);
        toast.error('Error al cargar las citas para la fecha seleccionada');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointmentsByDate();
  }, [selectedDate, user?.id]);

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <LayoutBase
      header={<VetSearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="flex flex-col gap-6 p-4 pb-20 overflow-y-auto">
        {/* Calendar Section - Now first */}
        <VetCalendar 
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          weeks={weeks}
          currentWeekIndex={currentWeekIndex}
          setCurrentWeekIndex={setCurrentWeekIndex}
          appointmentDates={appointmentDates}
          isLoading={isLoading}
        />

        {/* Scheduled Appointments Section - Now second */}
        <VetAppointmentsList 
          appointments={appointments} 
          selectedDate={selectedDate} 
          isLoading={isLoading} 
        />

        {/* Pending Requests Section */}
        <PendingRequestsList requests={[]} />

        {/* Appointment History Section */}
        <Card 
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => console.log('Ver historial clicked')}
        >
          <span className="font-medium">Ver historial de citas</span>
          <ArrowRight size={20} className="text-gray-500" />
        </Card>
      </div>
    </LayoutBase>
  );
};

export default VetDashboard;

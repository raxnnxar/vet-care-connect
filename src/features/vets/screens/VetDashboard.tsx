
import React, { useState, useEffect } from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/ui/molecules/card';
import { format, addDays, startOfWeek, endOfWeek, addWeeks, subWeeks, isToday } from 'date-fns';
import { useSelector } from 'react-redux';
import { getVetAppointments, getVetAppointmentsByDate, getVetAppointmentDates, Appointment } from '../api/vetAppointmentsApi';
import { toast } from 'sonner';
import VetSearchHeader from '../components/VetSearchHeader';
import VetCalendar from '../components/VetCalendar';
import VetAppointmentsList from '../components/VetAppointmentsList';
import PendingRequestsList from '../components/PendingRequestsList';

// Sample data for pending requests (this will stay static for now)
const pendingRequests = [
  { id: '1', petName: 'Mía', time: '4:00 PM', date: '25 abr' },
];

const VetDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weeks, setWeeks] = useState<Date[][]>([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const { user } = useSelector((state: any) => state.auth);
  
  // State for appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [appointmentDates, setAppointmentDates] = useState<Date[]>([]);
  
  // Generate weeks of days and initialize to the current week
  useEffect(() => {
    const generateWeeks = () => {
      const weeksArray: Date[][] = [];
      const currentDate = new Date();
      
      // Generate 10 weeks (past, current, and future)
      for (let i = -5; i < 5; i++) {
        const weekStartDate = startOfWeek(addWeeks(currentDate, i), { weekStartsOn: 1 });
        const weekDays: Date[] = [];
        
        // Generate 7 days for each week (Monday to Sunday)
        for (let j = 0; j < 7; j++) {
          weekDays.push(addDays(weekStartDate, j));
        }
        
        weeksArray.push(weekDays);
      }
      
      // Find the index of the week containing today
      const todayWeekIndex = weeksArray.findIndex(week => 
        week.some(day => isToday(day))
      );
      
      // Set the current week index to the one containing today
      setCurrentWeekIndex(todayWeekIndex >= 0 ? todayWeekIndex : 5);
      
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
        // Fetch all appointments for the logged-in vet
        const allAppointments = await getVetAppointments(user.id);
        
        // Get today's appointments
        const todayAppointments = allAppointments.filter(appointment => 
          isSameDay(parseDate(appointment.appointment_date), new Date())
        );
        
        // Extract unique dates for the appointment indicators
        const dates = allAppointments.map(app => parseDate(app.appointment_date));
        setAppointmentDates(dates);
        
        // Set today's appointments by default
        setAppointments(todayAppointments);
      } catch (error) {
        console.error('Error fetching vet appointments:', error);
        toast.error('Error al cargar las citas');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, [user?.id]);

  // Fetch appointments for the selected date
  useEffect(() => {
    const fetchAppointmentsByDate = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const dateAppointments = await getVetAppointmentsByDate(user.id, selectedDate);
        setAppointments(dateAppointments);
      } catch (error) {
        console.error('Error fetching appointments by date:', error);
        toast.error('Error al cargar las citas para la fecha seleccionada');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointmentsByDate();
  }, [selectedDate, user?.id]);

  // Helper function to parse date strings
  const parseDate = (dateString: string): Date => {
    return new Date(dateString);
  };
  
  // Helper function to check if two dates are on the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Get doctor's name from Redux state
  const doctorName = user?.user_metadata?.name || "García";

  return (
    <LayoutBase
      header={<VetSearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="flex flex-col gap-6 p-4 pb-20 overflow-y-auto">
        {/* Greeting Section */}
        <div className="mt-2">
          <h1 className="text-2xl font-semibold text-[#1F2937]">
            👋 Hola, Dr. {doctorName}. Estas son tus citas de hoy:
          </h1>
        </div>

        {/* Today's Appointments Section */}
        <VetAppointmentsList 
          appointments={appointments} 
          selectedDate={selectedDate} 
          isLoading={isLoading} 
        />

        {/* Calendar Section */}
        <VetCalendar 
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          weeks={weeks}
          currentWeekIndex={currentWeekIndex}
          setCurrentWeekIndex={setCurrentWeekIndex}
          appointmentDates={appointmentDates}
          isLoading={isLoading}
        />

        {/* Pending Requests Section */}
        <PendingRequestsList requests={pendingRequests} />

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

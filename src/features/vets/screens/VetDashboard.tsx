import React, { useState, useEffect, useRef } from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import VettLogo from '@/ui/atoms/VettLogo';
import { Bell, Search, Cat, Check, X, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { ScrollArea } from '@/ui/molecules/scroll-area';
import { format, addDays, startOfWeek, isToday, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useUser } from '@/contexts/UserContext';
import { useSelector } from 'react-redux';
import '../components/styles/calendar.css';

// Sample data for upcoming appointments
const upcomingAppointments = [
  { id: '1', petName: 'Luna', time: '10:30 AM', date: new Date() },
  { id: '2', petName: 'Kira', time: '11:30 AM', date: new Date() },
  { id: '3', petName: 'Max', time: '1:00 PM', date: new Date() },
];

// Sample data for pending requests
const pendingRequests = [
  { id: '1', petName: 'Mía', time: '4:00 PM', date: '25 abr' },
];

const VetDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weeks, setWeeks] = useState<Date[][]>([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const calendarRef = useRef<HTMLDivElement>(null);
  const { userRole, providerType } = useUser();
  const { user } = useSelector((state: any) => state.auth);
  
  // Generate weeks of days
  useEffect(() => {
    const generateWeeks = () => {
      const weeksArray: Date[][] = [];
      const currentDate = new Date();
      
      // Generate 10 weeks (past, current, and future)
      for (let i = -5; i < 5; i++) {
        const weekStartDate = startOfWeek(addDays(currentDate, i * 7), { weekStartsOn: 1 });
        const weekDays: Date[] = [];
        
        // Generate 7 days for each week (Monday to Sunday)
        for (let j = 0; j < 7; j++) {
          weekDays.push(addDays(weekStartDate, j));
        }
        
        weeksArray.push(weekDays);
      }
      
      // Set the current week index to the middle of the array (current week)
      setCurrentWeekIndex(5);
      return weeksArray;
    };
    
    setWeeks(generateWeeks());
  }, []);

  useEffect(() => {
    // Find and scroll to the current week
    if (calendarRef.current) {
      const scrollWidth = calendarRef.current.scrollWidth;
      const numWeeks = weeks.length;
      if (numWeeks > 0) {
        const scrollPosition = (scrollWidth / numWeeks) * currentWeekIndex;
        calendarRef.current.scrollLeft = scrollPosition;
      }
    }
  }, [weeks, currentWeekIndex]);

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  // Handle calendar scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
    const weekWidth = scrollWidth / weeks.length;
    const newIndex = Math.round(scrollLeft / weekWidth);
    
    // Only update if the index has changed to prevent unnecessary re-renders
    if (newIndex !== currentWeekIndex) {
      setCurrentWeekIndex(newIndex);
    }
  };

  // Get the month and year of the currently visible week
  const currentMonthYear = weeks.length > 0 && currentWeekIndex < weeks.length 
    ? format(weeks[currentWeekIndex][0], 'MMMM yyyy', { locale: es }) 
    : '';
  
  // Get doctor's name from Redux state
  const doctorName = user?.user_metadata?.name || "García";

  // Filter appointments based on the selected date
  const filteredAppointments = upcomingAppointments.filter((appointment) => 
    isSameDay(appointment.date, selectedDate)
  );

  return (
    <LayoutBase
      header={
        <div className="flex flex-col bg-[#79D0B8] px-4 py-3 space-y-2">
          <div className="flex justify-between items-center">
            <VettLogo color="#FFFFFF" height={36} />
            <button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
              <Bell size={24} />
            </button>
          </div>
          
          <div className="relative mb-1">
            <input
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5FBFB3] focus:border-transparent"
            />
            <span className="absolute inset-y-0 left-3 flex items-center">
              <Search className="w-5 h-5 text-gray-400" />
            </span>
          </div>
        </div>
      }
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
        <div>
          <h2 className="text-xl font-medium text-[#1F2937] mb-3">
            {isSameDay(selectedDate, new Date()) ? 
              "Tus próximas citas hoy" : 
              `Citas para ${format(selectedDate, 'd MMMM', { locale: es })}`
            }
          </h2>
          <div className="space-y-3">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Cat size={24} className="text-[#4DA6A8]" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{appointment.petName}</p>
                      <p className="text-gray-500">{appointment.time}</p>
                    </div>
                  </div>
                  <Button 
                    className="bg-[#79D0B8] hover:bg-[#5FBFB3] text-white"
                  >
                    Ver
                  </Button>
                </Card>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No hay citas programadas para esta fecha
              </div>
            )}
          </div>
        </div>

        {/* Calendar Section */}
        <div>
          <div className="flex justify-center items-center mb-2">
            <h2 className="text-lg font-medium">
              {currentMonthYear}
            </h2>
          </div>
          <div 
            className="overflow-x-auto snap-x snap-mandatory scrollbar-hide" 
            onScroll={handleScroll}
            ref={calendarRef}
            style={{ 
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="flex">
              {weeks.map((week, weekIndex) => (
                <div 
                  key={weekIndex} 
                  className="flex space-x-4 py-2 px-4 min-w-full snap-center"
                  style={{ scrollSnapAlign: 'center' }}
                >
                  {week.map((day, dayIndex) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const dayIsToday = isToday(day);
                    const hasAppointments = Math.random() > 0.7; // Random for demonstration
                    
                    return (
                      <div 
                        key={dayIndex} 
                        className={`flex flex-col items-center flex-1 cursor-pointer ${
                          isSelected ? 'text-white' : dayIsToday ? 'text-[#4DA6A8] font-bold' : 'text-[#1F2937]'
                        }`}
                        onClick={() => handleDateSelect(day)}
                      >
                        <span className="text-sm">
                          {format(day, 'EEEEE', { locale: es }).toUpperCase()}
                        </span>
                        <div 
                          className={`w-10 h-10 flex items-center justify-center rounded-full mt-1 ${
                            isSelected ? 'bg-[#79D0B8]' : 'bg-transparent'
                          }`}
                        >
                          <span className="text-lg">{format(day, 'd', { locale: es })}</span>
                        </div>
                        {hasAppointments && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#79D0B8] mt-1"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Requests Section */}
        <div>
          <h2 className="text-xl font-medium text-[#1F2937] mb-3">Solicitudes pendientes</h2>
          {pendingRequests.map((request) => (
            <Card key={request.id} className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <Cat size={24} className="text-[#4DA6A8]" />
                  </div>
                  <div>
                    <p className="font-medium text-lg">{request.petName}</p>
                    <p className="text-gray-500">{request.date} — {request.time}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  className="bg-[#79D0B8] hover:bg-[#5FBFB3] text-white rounded-full h-10 w-10 p-0"
                  size="icon"
                >
                  <Check size={18} />
                </Button>
                <Button 
                  className="bg-[#EF4444] hover:bg-red-400 text-white rounded-full h-10 w-10 p-0"
                  size="icon"
                >
                  <X size={18} />
                </Button>
                <Button 
                  variant="outline"
                  className="border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8]/10 rounded-full h-10 w-10 p-0"
                  size="icon"
                >
                  <MessageSquare size={18} />
                </Button>
              </div>
            </Card>
          ))}
        </div>

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


import React, { useState } from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import VettLogo from '@/ui/atoms/VettLogo';
import { Bell, Search, Cat, Check, X, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { ScrollArea } from '@/ui/molecules/scroll-area';

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

// Weekly calendar days
const calendarDays = [
  { day: 'L', date: 22, hasAppointments: true },
  { day: 'M', date: 23, hasAppointments: false },
  { day: 'X', date: 4, hasAppointments: false },
  { day: 'J', date: 16, hasAppointments: false },
  { day: 'V', date: 13, hasAppointments: false },
  { day: 'S', date: 25, hasAppointments: false, isSelected: true },
  { day: 'D', date: 28, hasAppointments: false },
  { day: 'L', date: 29, hasAppointments: false },
];

const VetDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

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
            👋 Hola, Dr. García. Estas son tus citas de hoy:
          </h1>
        </div>

        {/* Today's Appointments Section */}
        <div>
          <h2 className="text-xl font-medium text-[#1F2937] mb-3">Tus próximas citas hoy</h2>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
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
            ))}
          </div>
        </div>

        {/* Calendar Section */}
        <div>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-4 py-2 px-1">
              {calendarDays.map((day, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col items-center min-w-[40px] ${
                    day.isSelected ? 'text-white' : 'text-[#1F2937]'
                  }`}
                >
                  <span className="text-sm">{day.day}</span>
                  <div 
                    className={`w-10 h-10 flex items-center justify-center rounded-full mt-1 ${
                      day.isSelected ? 'bg-[#79D0B8]' : 'bg-transparent'
                    }`}
                  >
                    <span className="text-lg">{day.date}</span>
                  </div>
                  {day.hasAppointments && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#79D0B8] mt-1"></div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
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
                    <p className="text-gray-500">{request.time}</p>
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

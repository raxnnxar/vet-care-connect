
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/molecules/tabs';
import { Calendar, Clock, MapPin } from 'lucide-react';

const OwnerAppointmentsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('upcoming');

  const goToAppointmentDetails = (id: string) => {
    navigate(`/owner/appointments/${id}`);
  };

  const handleFindVets = () => {
    navigate('/owner/find-vets');
  };

  // Sample data for appointments
  const upcomingAppointments = [
    {
      id: 'appt-1',
      date: '2025-04-25',
      time: '15:30',
      vetName: 'Dr. Martinez',
      petName: 'Max',
      location: 'Clínica Veterinaria Central',
      status: 'confirmed'
    },
    {
      id: 'appt-2',
      date: '2025-05-03',
      time: '10:00',
      vetName: 'Dra. García',
      petName: 'Luna',
      location: 'Hospital Veterinario San Miguel',
      status: 'pending'
    }
  ];

  const pastAppointments = [
    {
      id: 'appt-3',
      date: '2025-03-15',
      time: '16:45',
      vetName: 'Dr. Rodriguez',
      petName: 'Max',
      location: 'Clínica Veterinaria Central',
      status: 'completed'
    },
    {
      id: 'appt-4',
      date: '2025-02-20',
      time: '11:30',
      vetName: 'Dra. López',
      petName: 'Luna',
      location: 'Hospital Veterinario San Miguel',
      status: 'cancelled'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { color: 'bg-green-100 text-green-800', text: 'Confirmada' },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      completed: { color: 'bg-blue-100 text-blue-800', text: 'Completada' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelada' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <LayoutBase
      header={
        <div className="px-4 py-3 bg-[#79D0B8]">
          <h1 className="text-white font-medium text-lg mb-2">Mis Citas</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="appointments" />}
    >
      <div className="p-4 pb-20">
        <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
            <TabsTrigger value="past">Anteriores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingAppointments.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-gray-500 mb-4">No tienes citas programadas</p>
                <Button 
                  className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
                  onClick={handleFindVets}
                >
                  Buscar Veterinarios
                </Button>
              </Card>
            ) : (
              <>
                {upcomingAppointments.map(appointment => (
                  <Card 
                    key={appointment.id} 
                    className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => goToAppointmentDetails(appointment.id)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{appointment.vetName}</h3>
                        {getStatusBadge(appointment.status)}
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-1">Para: {appointment.petName}</p>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-[#79D0B8] mr-2" />
                          <span className="text-sm">{formatDate(appointment.date)}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-[#79D0B8] mr-2" />
                          <span className="text-sm">{appointment.time}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-[#79D0B8] mr-2" />
                          <span className="text-sm">{appointment.location}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                
                <Button 
                  className="w-full mt-2 bg-[#79D0B8] hover:bg-[#5FBFB3]"
                  onClick={handleFindVets}
                >
                  Agendar Nueva Cita
                </Button>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastAppointments.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-gray-500">No tienes citas anteriores</p>
              </Card>
            ) : (
              pastAppointments.map(appointment => (
                <Card 
                  key={appointment.id} 
                  className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => goToAppointmentDetails(appointment.id)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{appointment.vetName}</h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-1">Para: {appointment.petName}</p>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-[#79D0B8] mr-2" />
                        <span className="text-sm">{formatDate(appointment.date)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-[#79D0B8] mr-2" />
                        <span className="text-sm">{appointment.time}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-[#79D0B8] mr-2" />
                        <span className="text-sm">{appointment.location}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </LayoutBase>
  );
};

export default OwnerAppointmentsScreen;

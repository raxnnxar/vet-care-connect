
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/molecules/tabs';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { Badge } from '@/ui/atoms/badge';

const OwnerAppointmentsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('upcoming');

  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['appointments', activeTab],
    queryFn: async () => {
      const now = new Date();
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          pets (
            id,
            name,
            profile_picture_url
          )
        `)
        .order('appointment_date', { ascending: activeTab === 'upcoming' })
        .gte('appointment_date', activeTab === 'upcoming' ? now.toISOString() : undefined)
        .lt('appointment_date', activeTab === 'past' ? now.toISOString() : undefined);

      if (error) {
        console.error('Error fetching appointments:', error);
        toast.error('No se pudieron cargar las citas');
        throw error;
      }

      return data || [];
    },
  });

  const handleFindVets = () => {
    navigate('/owner/find-vets');
  };

  const goToAppointmentDetails = (id: string) => {
    navigate(`/owner/appointments/${id}`);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { variant: 'default', className: 'bg-green-100 text-green-800', text: 'Confirmada' },
      pending: { variant: 'default', className: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      completed: { variant: 'default', className: 'bg-blue-100 text-blue-800', text: 'Completada' },
      cancelled: { variant: 'default', className: 'bg-red-100 text-red-800', text: 'Cancelada' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge variant={config.variant as any} className={config.className}>
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d 'de' MMMM',' yyyy", { locale: es });
  };

  if (error) {
    return (
      <LayoutBase
        header={
          <div className="px-4 py-3 bg-[#79D0B8]">
            <h1 className="text-white font-medium text-lg mb-2">Mis Citas</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="appointments" />}
      >
        <div className="p-4">
          <Card className="p-6 text-center">
            <p className="text-gray-500 mb-4">Ocurrió un error al cargar las citas</p>
            <Button 
              className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
          </Card>
        </div>
      </LayoutBase>
    );
  }

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
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </Card>
                ))}
              </div>
            ) : appointments?.length === 0 ? (
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
                {appointments?.map(appointment => (
                  <Card 
                    key={appointment.id} 
                    className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => goToAppointmentDetails(appointment.id)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{appointment.provider_name}</h3>
                        {getStatusBadge(appointment.status)}
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-1">
                        Para: {appointment.pets?.name}
                      </p>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-[#79D0B8] mr-2" />
                          <span className="text-sm">
                            {formatDate(appointment.appointment_date)}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-[#79D0B8] mr-2" />
                          <span className="text-sm">
                            {format(new Date(appointment.appointment_date), 'HH:mm')}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-[#79D0B8] mr-2" />
                          <span className="text-sm">
                            {appointment.clinic_name || appointment.location}
                          </span>
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
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </Card>
                ))}
              </div>
            ) : appointments?.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-gray-500">No tienes citas anteriores</p>
              </Card>
            ) : (
              appointments?.map(appointment => (
                <Card 
                  key={appointment.id} 
                  className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => goToAppointmentDetails(appointment.id)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{appointment.provider_name}</h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-1">
                      Para: {appointment.pets?.name}
                    </p>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-[#79D0B8] mr-2" />
                        <span className="text-sm">
                          {formatDate(appointment.appointment_date)}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-[#79D0B8] mr-2" />
                        <span className="text-sm">
                          {format(new Date(appointment.appointment_date), 'HH:mm')}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-[#79D0B8] mr-2" />
                        <span className="text-sm">
                          {appointment.clinic_name || appointment.location}
                        </span>
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

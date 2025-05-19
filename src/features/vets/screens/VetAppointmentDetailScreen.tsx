
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft, Cat, Calendar, Clock, MapPin, File } from 'lucide-react';
import { Card } from '@/ui/molecules/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/ui/atoms/badge';
import { toast } from 'sonner';
import { Pet } from '@/features/pets/types';

interface AppointmentPetResponse {
  id: string;
  name: string;
  species: string;
  breed?: string;
  sex?: string;
  date_of_birth?: string;
  profile_picture_url?: string;
}

const getStatusBadge = (status: string | null) => {
  const statusConfig: Record<string, { color: string, text: string }> = {
    'programada': { color: 'bg-green-100 text-green-800', text: 'Confirmada' },
    'pendiente': { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
    'completada': { color: 'bg-blue-100 text-blue-800', text: 'Completada' },
    'cancelada': { color: 'bg-red-100 text-red-800', text: 'Cancelada' }
  };
  
  const config = status && statusConfig[status] 
    ? statusConfig[status] 
    : statusConfig.pendiente;
  
  return (
    <Badge className={`${config.color} border-0`}>
      {config.text}
    </Badge>
  );
};

const VetAppointmentDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: appointment, isLoading, error } = useQuery({
    queryKey: ['appointment', id],
    queryFn: async () => {
      if (!id) throw new Error('No appointment ID provided');
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          pets:pet_id (
            id,
            name,
            species,
            breed,
            sex,
            date_of_birth,
            profile_picture_url
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching appointment:', error);
        toast.error('Error al cargar los detalles de la cita');
        throw error;
      }
      
      return data;
    },
    enabled: !!id
  });
  
  const goBack = () => navigate(-1);
  
  if (isLoading) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Detalles de Cita</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="home" />}
      >
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </LayoutBase>
    );
  }
  
  if (error || !appointment) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Detalles de Cita</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="home" />}
      >
        <div className="p-4 text-center">
          <p className="text-gray-500 mb-3">No se encontraron detalles para esta cita</p>
          <Button 
            className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
            onClick={goBack}
          >
            Volver
          </Button>
        </div>
      </LayoutBase>
    );
  }
  
  const formatAppointmentDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, "d 'de' MMMM, yyyy", { locale: es });
    } catch (err) {
      return 'Fecha no disponible';
    }
  };
  
  const formatAppointmentTime = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, "h:mm a", { locale: es });
    } catch (err) {
      return 'Hora no disponible';
    }
  };
  
  // Transform pet data safely to a Pet object only when valid
  let pet: Pet | null = null;
  
  if (appointment.pets && 
      typeof appointment.pets === 'object' && 
      appointment.pets !== null &&
      !('error' in appointment.pets) &&
      'id' in appointment.pets) {
        
    // Now we know it's a valid pet object 
    const petData = appointment.pets as AppointmentPetResponse;
    
    pet = {
      id: petData.id,
      name: petData.name,
      species: petData.species,
      breed: petData.breed,
      sex: petData.sex,
      date_of_birth: petData.date_of_birth,
      profile_picture_url: petData.profile_picture_url,
      owner_id: appointment.owner_id || '',
      created_at: ''
    };
  }
  
  return (
    <LayoutBase
      header={
        <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
          <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
            <ArrowLeft />
          </Button>
          <h1 className="text-white font-medium text-lg ml-2">Detalles de Cita</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4 space-y-6 pb-20">
        {/* Appointment Header */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-medium">Información de la Cita</h2>
            {getStatusBadge(appointment.status)}
          </div>
          
          <Card className="p-4 space-y-3">
            <div className="flex items-center">
              <Calendar className="text-[#79D0B8] mr-2" size={18} />
              <span>{formatAppointmentDate(appointment.appointment_date)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="text-[#79D0B8] mr-2" size={18} />
              <span>{formatAppointmentTime(appointment.appointment_date)}</span>
            </div>
            {appointment.location && (
              <div className="flex items-center">
                <MapPin className="text-[#79D0B8] mr-2" size={18} />
                <span>{appointment.location}</span>
              </div>
            )}
            {appointment.service_type && (
              <div className="flex items-start">
                <File className="text-[#79D0B8] mr-2 mt-0.5" size={18} />
                <span>Tipo de servicio: {appointment.service_type}</span>
              </div>
            )}
          </Card>
        </div>
        
        {/* Pet Information */}
        {pet && (
          <div>
            <h2 className="text-xl font-medium mb-3">Información del Paciente</h2>
            <Card className="p-4">
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Cat size={32} className="text-[#4DA6A8]" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-lg">{pet.name}</p>
                  <p className="text-gray-500">
                    {pet.species}
                    {pet.breed ? ` - ${pet.breed}` : ''}
                    {pet.sex ? ` - ${pet.sex === 'male' ? 'Macho' : 'Hembra'}` : ''}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {/* Notes */}
        {appointment.notes && (
          <div>
            <h2 className="text-xl font-medium mb-3">Notas</h2>
            <Card className="p-4">
              <p>{appointment.notes}</p>
            </Card>
          </div>
        )}
        
        {/* Additional Information */}
        <div>
          <h2 className="text-xl font-medium mb-3">Detalles Adicionales</h2>
          <Card className="p-4 divide-y divide-gray-100">
            {appointment.duration && (
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Duración</span>
                <span>{appointment.duration} minutos</span>
              </div>
            )}
            {appointment.price && (
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Precio</span>
                <span>${appointment.price}</span>
              </div>
            )}
            {appointment.payment_status && (
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Estado de pago</span>
                <span className={appointment.payment_status === 'pagado' ? 'text-green-500' : 'text-yellow-500'}>
                  {appointment.payment_status === 'pagado' ? 'Pagado' : 'Pendiente'}
                </span>
              </div>
            )}
            {appointment.reason && (
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Motivo</span>
                <span>{appointment.reason}</span>
              </div>
            )}
          </Card>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            className="flex-1 bg-[#79D0B8] hover:bg-[#5FBFB3]"
            onClick={goBack}
          >
            Volver
          </Button>
        </div>
      </div>
    </LayoutBase>
  );
};

export default VetAppointmentDetailScreen;

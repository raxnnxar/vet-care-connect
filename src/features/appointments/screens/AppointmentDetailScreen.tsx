
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft, Calendar, Clock, MapPin, User, FileText, CreditCard, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/molecules/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { AppointmentStatusBadge } from '../components/AppointmentStatusBadge';
import { AppointmentStatusType } from '@/core/constants/app.constants';

const AppointmentDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: appointmentDetails, isLoading } = useQuery({
    queryKey: ['appointment', id],
    queryFn: async () => {
      if (!id) throw new Error('No appointment ID provided');

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          pets:pet_id(id, name, species, breed, sex, date_of_birth, profile_picture_url),
          veterinarians!provider_id (
            id,
            bio,
            specialization,
            years_of_experience
          ),
          service_providers!provider_id (
            id,
            business_name,
            phone_number,
            address
          ),
          profiles!provider_id (
            id,
            display_name,
            email
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching appointment:', error);
        toast.error('No se pudo cargar los detalles de la cita');
        throw error;
      }

      return data;
    },
    enabled: !!id
  });

  const goBack = () => navigate(-1);

  const formatDateFromJsonb = (dateData: any) => {
    try {
      if (typeof dateData === 'object' && dateData !== null) {
        if (dateData.date && dateData.time) {
          const date = new Date(`${dateData.date}T${dateData.time}`);
          return format(date, "d 'de' MMMM, yyyy", { locale: es });
        }
      } else if (typeof dateData === 'string') {
        const date = new Date(dateData);
        return format(date, "d 'de' MMMM, yyyy", { locale: es });
      }
      return 'Fecha no disponible';
    } catch (err) {
      return 'Fecha no disponible';
    }
  };

  const formatTimeFromJsonb = (dateData: any) => {
    try {
      if (typeof dateData === 'object' && dateData !== null) {
        if (dateData.time) {
          return dateData.time;
        }
      } else if (typeof dateData === 'string') {
        const date = new Date(dateData);
        return format(date, "HH:mm");
      }
      return 'Hora no disponible';
    } catch (err) {
      return 'Hora no disponible';
    }
  };

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
        footer={<NavbarInferior activeTab="appointments" />}
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

  if (!appointmentDetails) {
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
        footer={<NavbarInferior activeTab="appointments" />}
      >
        <div className="p-4">
          <p className="text-center text-gray-500">No se encontró la cita</p>
          <Button 
            className="w-full mt-4 bg-[#79D0B8] hover:bg-[#5FBFB3]"
            onClick={goBack}
          >
            Regresar
          </Button>
        </div>
      </LayoutBase>
    );
  }

  // Get provider information
  const providerName = appointmentDetails.profiles?.display_name || 
                      appointmentDetails.service_providers?.business_name || 
                      'Veterinario no disponible';
  
  const providerPhone = appointmentDetails.service_providers?.phone_number;
  const providerAddress = appointmentDetails.service_providers?.address || appointmentDetails.location;
  const providerEmail = appointmentDetails.profiles?.email;

  // Get service type information
  let serviceTypeDisplay = 'Servicio no especificado';
  let servicePrice: number | undefined;
  
  if (appointmentDetails.service_type) {
    try {
      if (typeof appointmentDetails.service_type === 'string') {
        serviceTypeDisplay = appointmentDetails.service_type;
      } else if (typeof appointmentDetails.service_type === 'object' && appointmentDetails.service_type !== null) {
        const serviceObj = appointmentDetails.service_type as any;
        serviceTypeDisplay = serviceObj.name || serviceObj.type || 'Servicio no especificado';
        servicePrice = serviceObj.price ? Number(serviceObj.price) : undefined;
      }
    } catch (error) {
      console.error('Error parsing service type:', error);
    }
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
      footer={<NavbarInferior activeTab="appointments" />}
    >
      <div className="p-4 space-y-4 pb-20">
        {/* Status and Date Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Estado de la Cita</CardTitle>
              <AppointmentStatusBadge status={appointmentDetails.status as AppointmentStatusType} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center">
              <Calendar className="text-[#79D0B8] mr-3" size={20} />
              <span className="font-medium">Fecha:</span>
              <span className="ml-2">{formatDateFromJsonb(appointmentDetails.appointment_date)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="text-[#79D0B8] mr-3" size={20} />
              <span className="font-medium">Hora:</span>
              <span className="ml-2">{formatTimeFromJsonb(appointmentDetails.appointment_date)}</span>
            </div>
            {providerAddress && (
              <div className="flex items-center">
                <MapPin className="text-[#79D0B8] mr-3" size={20} />
                <span className="font-medium">Ubicación:</span>
                <span className="ml-2">{providerAddress}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pet Information */}
        {appointmentDetails.pets && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información de la Mascota</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="bg-[#79D0B8] p-3 rounded-full">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{appointmentDetails.pets.name}</p>
                  <p className="text-gray-500">
                    {appointmentDetails.pets.species}
                    {appointmentDetails.pets.breed ? ` - ${appointmentDetails.pets.breed}` : ''}
                    {appointmentDetails.pets.sex ? ` - ${appointmentDetails.pets.sex === 'male' ? 'Macho' : 'Hembra'}` : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Veterinarian Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información del Veterinario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center">
              <User className="text-[#79D0B8] mr-3" size={20} />
              <span className="font-medium">Nombre:</span>
              <span className="ml-2">{providerName}</span>
            </div>
            {providerEmail && (
              <div className="flex items-center">
                <span className="font-medium">Email:</span>
                <span className="ml-2">{providerEmail}</span>
              </div>
            )}
            {providerPhone && (
              <div className="flex items-center">
                <Phone className="text-[#79D0B8] mr-3" size={20} />
                <span className="font-medium">Teléfono:</span>
                <span className="ml-2">{providerPhone}</span>
              </div>
            )}
            {appointmentDetails.veterinarians?.years_of_experience && (
              <div className="flex items-center">
                <span className="font-medium">Experiencia:</span>
                <span className="ml-2">{appointmentDetails.veterinarians.years_of_experience} años</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalles del Servicio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center">
              <FileText className="text-[#79D0B8] mr-3" size={20} />
              <span className="font-medium">Tipo de servicio:</span>
              <span className="ml-2">{serviceTypeDisplay}</span>
            </div>
            {appointmentDetails.duration && (
              <div className="flex items-center">
                <Clock className="text-[#79D0B8] mr-3" size={20} />
                <span className="font-medium">Duración:</span>
                <span className="ml-2">{appointmentDetails.duration} minutos</span>
              </div>
            )}
            {servicePrice && (
              <div className="flex items-center">
                <CreditCard className="text-[#79D0B8] mr-3" size={20} />
                <span className="font-medium">Precio:</span>
                <span className="ml-2">${servicePrice}</span>
              </div>
            )}
            {appointmentDetails.payment_status && (
              <div className="flex items-center">
                <span className="font-medium">Estado de pago:</span>
                <span className={`ml-2 ${appointmentDetails.payment_status === 'pagado' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {appointmentDetails.payment_status === 'pagado' ? 'Pagado' : 'Pendiente'}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        {appointmentDetails.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notas Adicionales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{appointmentDetails.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Action Button */}
        <Button 
          className="w-full bg-[#79D0B8] hover:bg-[#5FBFB3]"
          onClick={goBack}
        >
          Volver a Mis Citas
        </Button>
      </div>
    </LayoutBase>
  );
};

export default AppointmentDetailScreen;

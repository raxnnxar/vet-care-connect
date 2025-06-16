import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft, Cat, Calendar, Clock, MapPin, Phone, FileText, Heart, Pill, Scissors, Check, X, MessageSquare } from 'lucide-react';
import { Card } from '@/ui/molecules/card';
import { ScrollArea } from '@/ui/molecules/scroll-area';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { APPOINTMENT_STATUS } from '@/core/constants/app.constants';
import MedicalInfoViewer from '@/features/pets/components/medical/MedicalInfoViewer';

const DetallesCitaScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showFullMedicalHistory, setShowFullMedicalHistory] = useState(false);
  
  const { data: appointmentDetails, isLoading, error } = useQuery({
    queryKey: ['appointment-details', id],
    queryFn: async () => {
      if (!id) throw new Error('No appointment ID provided');
      
      // Fetch appointment with related data
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .select(`
          *,
          pets!appointments_pet_id_fkey (
            id,
            name,
            species,
            breed,
            date_of_birth,
            weight,
            sex,
            temperament,
            profile_picture_url,
            owner_id,
            created_at
          ),
          pet_owners!appointments_owner_id_fkey (
            address,
            phone_number
          )
        `)
        .eq('id', id)
        .single();
      
      if (appointmentError) {
        console.error('Error fetching appointment:', appointmentError);
        throw appointmentError;
      }
      
      // Fetch medical history if pet exists
      let medicalHistory = null;
      if (appointment.pets?.id) {
        const { data: medical, error: medicalError } = await supabase
          .from('pet_medical_history')
          .select('*')
          .eq('pet_id', appointment.pets.id)
          .maybeSingle();
        
        if (!medicalError) {
          medicalHistory = medical;
        }
      }
      
      return {
        appointment,
        medicalHistory
      };
    },
    enabled: !!id
  });
  
  const goBack = () => navigate(-1);
  
  const handleApproveAppointment = async () => {
    if (!id) return;
    
    try {
      console.log('Approving appointment:', id);
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: APPOINTMENT_STATUS.CONFIRMED })
        .eq('id', id)
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log('Appointment approved successfully:', data);
      
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['appointment-details', id] });
      queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['vet-appointments'] });
      
      toast.success('Cita confirmada correctamente');
    } catch (error) {
      console.error('Error approving appointment:', error);
      toast.error('Error al confirmar la cita');
    }
  };

  const handleRejectAppointment = async () => {
    if (!id) return;
    
    try {
      console.log('Rejecting appointment:', id);
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: APPOINTMENT_STATUS.CANCELLED })
        .eq('id', id)
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log('Appointment rejected successfully:', data);
      
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['appointment-details', id] });
      queryClient.invalidateQueries({ queryKey: ['pending-requests'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['vet-appointments'] });
      
      toast.success('Cita rechazada correctamente');
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      toast.error('Error al rechazar la cita');
    }
  };

  const handleSendMessage = () => {
    // Navigate to chat with owner
    if (appointmentDetails?.appointment?.owner_id) {
      navigate(`/vet/chats/${appointmentDetails.appointment.owner_id}`);
    } else {
      toast.error('No se pudo encontrar la información del dueño');
    }
  };

  const handleViewMedicalHistory = () => {
    if (appointmentDetails?.appointment?.pets?.id) {
      setShowFullMedicalHistory(true);
    } else {
      toast.error('No se pudo encontrar la información de la mascota');
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
        footer={<NavbarInferior activeTab="home" />}
      >
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </LayoutBase>
    );
  }
  
  if (error || !appointmentDetails) {
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
  
  const { appointment, medicalHistory } = appointmentDetails;
  
  const formatAppointmentDate = (dateData: any) => {
    try {
      if (typeof dateData === 'string') {
        const date = new Date(dateData);
        return format(date, "d 'de' MMMM, yyyy", { locale: es });
      } else if (typeof dateData === 'object' && dateData !== null) {
        if (dateData.date) {
          const date = new Date(dateData.date);
          return format(date, "d 'de' MMMM, yyyy", { locale: es });
        }
      }
      return 'Fecha no disponible';
    } catch (err) {
      return 'Fecha no disponible';
    }
  };
  
  const formatAppointmentTime = (dateData: any) => {
    try {
      if (typeof dateData === 'string') {
        const date = new Date(dateData);
        return format(date, "HH:mm", { locale: es });
      } else if (typeof dateData === 'object' && dateData !== null) {
        if (dateData.time) {
          return dateData.time;
        }
      }
      return 'Hora no disponible';
    } catch (err) {
      return 'Hora no disponible';
    }
  };
  
  const getServiceType = (serviceType: any) => {
    if (typeof serviceType === 'string') {
      return serviceType;
    } else if (typeof serviceType === 'object' && serviceType !== null) {
      return serviceType.name || serviceType.type || 'Servicio no especificado';
    }
    return 'Servicio no especificado';
  };
  
  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; color: string } } = {
      pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
      programada: { label: 'Confirmada', color: 'bg-green-100 text-green-800' },
      completada: { label: 'Completada', color: 'bg-blue-100 text-blue-800' },
      cancelada: { label: 'Cancelada', color: 'bg-red-100 text-red-800' }
    };
    
    const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };
  
  const calculateAge = (dateOfBirth: string) => {
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      const ageInMs = today.getTime() - birthDate.getTime();
      const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365));
      return ageInYears > 0 ? `${ageInYears} años` : 'Menos de 1 año';
    } catch {
      return 'Edad no disponible';
    }
  };
  
  // Show full medical history modal
  if (showFullMedicalHistory && appointment.pets) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={() => setShowFullMedicalHistory(false)}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">
              Historial Médico - {appointment.pets.name}
            </h1>
          </div>
        }
        footer={<NavbarInferior activeTab="home" />}
      >
        <ScrollArea className="h-[calc(100vh-140px)]">
          <MedicalInfoViewer pet={appointment.pets} />
        </ScrollArea>
      </LayoutBase>
    );
  }
  
  return (
    <LayoutBase
      header={
        <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
          <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
            <ArrowLeft />
          </Button>
          <h1 className="text-white font-medium text-lg ml-2">
            Detalles de Cita - {appointment.pets?.name || 'Mascota'}
          </h1>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4 space-y-6 pb-20">
        {/* Información de la Cita */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-[#1F2937] flex items-center">
              <Calendar className="mr-2 text-[#79D0B8]" size={20} />
              Información de la Cita
            </h2>
            {getStatusBadge(appointment.status)}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <Calendar className="text-[#79D0B8] mr-3" size={16} />
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-medium">{formatAppointmentDate(appointment.appointment_date)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="text-[#79D0B8] mr-3" size={16} />
              <div>
                <p className="text-sm text-gray-500">Hora</p>
                <p className="font-medium">{formatAppointmentTime(appointment.appointment_date)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FileText className="text-[#79D0B8] mr-3" size={16} />
              <div>
                <p className="text-sm text-gray-500">Tipo de servicio</p>
                <p className="font-medium">{getServiceType(appointment.service_type)}</p>
              </div>
            </div>
            {appointment.reason && (
              <div className="flex items-start">
                <FileText className="text-[#79D0B8] mr-3 mt-0.5" size={16} />
                <div>
                  <p className="text-sm text-gray-500">Motivo de la cita</p>
                  <p className="font-medium">{appointment.reason}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
        
        {/* Información de la Mascota */}
        {appointment.pets && (
          <Card className="p-4">
            <h2 className="text-xl font-medium text-[#1F2937] mb-4 flex items-center">
              <Cat className="mr-2 text-[#79D0B8]" size={20} />
              Información de la Mascota
            </h2>
            
            <div className="flex items-center mb-4">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <Cat size={32} className="text-[#4DA6A8]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{appointment.pets.name}</h3>
                <p className="text-gray-500">{appointment.pets.species}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              {appointment.pets.breed && (
                <div>
                  <p className="text-gray-500">Raza</p>
                  <p className="font-medium">{appointment.pets.breed}</p>
                </div>
              )}
              {appointment.pets.date_of_birth && (
                <div>
                  <p className="text-gray-500">Edad</p>
                  <p className="font-medium">{calculateAge(appointment.pets.date_of_birth)}</p>
                </div>
              )}
              {appointment.pets.weight && (
                <div>
                  <p className="text-gray-500">Peso</p>
                  <p className="font-medium">{appointment.pets.weight} kg</p>
                </div>
              )}
              {appointment.pets.sex && (
                <div>
                  <p className="text-gray-500">Sexo</p>
                  <p className="font-medium">{appointment.pets.sex === 'male' ? 'Macho' : 'Hembra'}</p>
                </div>
              )}
              {appointment.pets.temperament && (
                <div className="col-span-2">
                  <p className="text-gray-500">Temperamento</p>
                  <p className="font-medium">{appointment.pets.temperament}</p>
                </div>
              )}
            </div>
          </Card>
        )}
        
        {/* Historial Médico */}
        {medicalHistory && (
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-[#1F2937] flex items-center">
                <Heart className="mr-2 text-[#79D0B8]" size={20} />
                Historial Médico
              </h2>
              <Button 
                variant="outline"
                size="sm"
                className="border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8]/10"
                onClick={handleViewMedicalHistory}
              >
                Ver completo
              </Button>
            </div>
            
            <div className="space-y-4">
              {medicalHistory.allergies && (
                <div className="flex items-start">
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <Heart size={16} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Alergias</p>
                    <p className="font-medium">{medicalHistory.allergies}</p>
                  </div>
                </div>
              )}
              
              {medicalHistory.chronic_conditions && (
                <div className="flex items-start">
                  <div className="bg-orange-100 p-2 rounded-full mr-3">
                    <FileText size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Condiciones crónicas</p>
                    <p className="font-medium">{medicalHistory.chronic_conditions}</p>
                  </div>
                </div>
              )}
              
              {medicalHistory.current_medications && (
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Pill size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Medicación actual</p>
                    <div className="font-medium">
                      {Array.isArray(medicalHistory.current_medications) 
                        ? medicalHistory.current_medications.map((med: any, index: number) => (
                            <p key={index}>{med.name} - {med.dosage} ({med.frequency})</p>
                          ))
                        : <p>{JSON.stringify(medicalHistory.current_medications)}</p>
                      }
                    </div>
                  </div>
                </div>
              )}
              
              {medicalHistory.previous_surgeries && (
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <Scissors size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cirugías pasadas</p>
                    <div className="font-medium">
                      {Array.isArray(medicalHistory.previous_surgeries) 
                        ? medicalHistory.previous_surgeries.map((surgery: any, index: number) => (
                            <p key={index}>{surgery.type} ({surgery.date})</p>
                          ))
                        : <p>{JSON.stringify(medicalHistory.previous_surgeries)}</p>
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
        
        {/* Información del Dueño */}
        {appointment.pet_owners && (
          <Card className="p-4">
            <h2 className="text-xl font-medium text-[#1F2937] mb-4 flex items-center">
              <Phone className="mr-2 text-[#79D0B8]" size={20} />
              Información del Dueño
            </h2>
            
            <div className="space-y-3">
              {appointment.pet_owners.phone_number && (
                <div className="flex items-center">
                  <Phone className="text-[#79D0B8] mr-3" size={16} />
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-medium">{appointment.pet_owners.phone_number}</p>
                  </div>
                </div>
              )}
              
              {appointment.pet_owners.address && (
                <div className="flex items-start">
                  <MapPin className="text-[#79D0B8] mr-3 mt-0.5" size={16} />
                  <div>
                    <p className="text-sm text-gray-500">Dirección</p>
                    <p className="font-medium">{appointment.pet_owners.address}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {appointment.status === APPOINTMENT_STATUS.PENDING && (
            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-[#79D0B8] hover:bg-[#5FBFB3] text-white"
                onClick={handleApproveAppointment}
              >
                <Check className="mr-2" size={16} />
                Confirmar cita
              </Button>
              <Button 
                className="flex-1 bg-[#EF4444] hover:bg-red-400 text-white"
                onClick={handleRejectAppointment}
              >
                <X className="mr-2" size={16} />
                Rechazar cita
              </Button>
            </div>
          )}
          <Button 
            variant="outline"
            className="w-full border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8]/10"
            onClick={handleSendMessage}
          >
            <MessageSquare className="mr-2" size={16} />
            Enviar mensaje
          </Button>
        </div>
      </div>
    </LayoutBase>
  );
};

export default DetallesCitaScreen;

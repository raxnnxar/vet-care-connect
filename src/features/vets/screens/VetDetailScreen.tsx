
import React from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { ArrowLeft, MapPin, Phone, Mail, Calendar, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { Avatar } from '@/ui/atoms/avatar';

const VetDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleBookAppointment = () => {
    navigate(`/owner/appointments/book/${id}`);
  };

  return (
    <LayoutBase
      header={
        <div className="flex items-center p-4 bg-[#79D0B8]">
          <Button 
            variant="ghost" 
            className="text-white p-1 mr-2" 
            onClick={handleGoBack}
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-xl font-medium text-white">Perfil del Veterinario</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4 pb-20">
        <Card className="mb-6">
          <div className="p-4 flex items-center">
            <Avatar className="h-24 w-24 border-2 border-[#79D0B8]">
              <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                DR
              </div>
            </Avatar>
            
            <div className="ml-4">
              <h2 className="text-xl font-semibold">Dr. Ricardo Martínez</h2>
              <p className="text-gray-600">Veterinario General</p>
              
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-600">4.0 (24 reseñas)</span>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="mb-6">
          <div className="p-4">
            <h3 className="font-medium text-lg mb-3">Acerca de</h3>
            <p className="text-gray-600">
              Veterinario con 10 años de experiencia en el cuidado de pequeñas especies. 
              Especializado en medicina preventiva y tratamiento de enfermedades comunes.
            </p>
          </div>
        </Card>
        
        <Card className="mb-6">
          <div className="p-4">
            <h3 className="font-medium text-lg mb-3">Contacto</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="text-[#79D0B8] mr-3" size={20} />
                <span>Av. Principal #123, Col. Centro</span>
              </div>
              
              <div className="flex items-center">
                <Phone className="text-[#79D0B8] mr-3" size={20} />
                <span>+52 55 1234 5678</span>
              </div>
              
              <div className="flex items-center">
                <Mail className="text-[#79D0B8] mr-3" size={20} />
                <span>dr.martinez@vetclinic.com</span>
              </div>
            </div>
          </div>
        </Card>
        
        <Button 
          onClick={handleBookAppointment}
          className="w-full bg-[#79D0B8] hover:bg-[#68BBA3] py-3"
        >
          <Calendar className="mr-2" size={20} />
          Agendar Cita
        </Button>
      </div>
    </LayoutBase>
  );
};

export default VetDetailScreen;

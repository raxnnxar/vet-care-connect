
import React from 'react';
import { LayoutBase } from '@/frontend/navigation/components';
import { ArrowLeft, Mail, HelpCircle, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/atoms/button';
import { useToast } from '@/hooks/use-toast';

const ContactSupportScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoBack = () => {
    navigate('/owner/settings');
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('soporte@vett.com');
      toast({
        title: "Correo copiado",
        description: "La dirección de correo ha sido copiada al portapapeles",
        variant: "default"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar el correo",
        variant: "destructive"
      });
    }
  };

  const handleSendEmail = () => {
    window.location.href = 'mailto:soporte@vett.com?subject=Soporte Vett - Solicitud de ayuda';
  };

  return (
    <LayoutBase
      header={
        <div className="flex items-center justify-between p-4 bg-[#79D0B8]">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="text-white p-1 mr-2" 
              onClick={handleGoBack}
            >
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-xl font-medium text-white">Soporte</h1>
          </div>
        </div>
      }
    >
      <div className="p-4 pb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header con ícono */}
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-[#79D0B8]/10 mr-4">
              <HelpCircle className="h-6 w-6 text-[#79D0B8]" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-800">¿Necesitas ayuda?</h2>
            </div>
          </div>

          {/* Mensaje principal */}
          <div className="mb-8">
            <p className="text-gray-600 leading-relaxed text-base">
              Por ahora no tenemos un equipo de soporte en tiempo real, pero puedes escribirnos y te responderemos lo antes posible.
            </p>
          </div>

          {/* Sección de contacto por correo */}
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-blue-50 mr-3">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 mb-1">Correo electrónico</h3>
                <p className="text-gray-600 text-sm">Escríbenos y te responderemos pronto</p>
              </div>
            </div>

            {/* Email con opciones de copia y envío */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-gray-800 text-lg">soporte@vett.com</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyEmail}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copiar
                </Button>
              </div>
              
              <Button
                onClick={handleSendEmail}
                className="w-full bg-[#79D0B8] hover:bg-[#6BC4A6] text-white font-medium py-3"
              >
                <Mail className="h-4 w-4 mr-2" />
                Enviar correo
              </Button>
            </div>
          </div>

          {/* Mensaje adicional */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Nos esforzamos por responder todas las consultas dentro de las 24 horas hábiles.
            </p>
          </div>
        </div>
      </div>
    </LayoutBase>
  );
};

export default ContactSupportScreen;

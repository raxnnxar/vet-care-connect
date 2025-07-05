
import React from 'react';
import { LayoutBase } from '@/frontend/navigation/components';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/atoms/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/ui/molecules/accordion';

const FAQScreen = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/owner/settings');
  };

  const faqData = [
    {
      category: "🐾 Citas",
      questions: [
        {
          question: "¿Cómo agendo una cita con un veterinario?",
          answer: "Ve a la sección \"Salud\", elige un veterinario y selecciona un horario disponible."
        },
        {
          question: "¿Puedo cancelar o reagendar una cita?",
          answer: "Sí. En la sección \"Citas\" puedes ver, modificar o cancelar tus citas activas."
        },
        {
          question: "¿Dónde veo el estado de mis próximas citas?",
          answer: "En la pestaña \"Citas\" verás todas las futuras y pasadas con su estatus."
        }
      ]
    },
    {
      category: "👤 Perfil y mascotas",
      questions: [
        {
          question: "¿Cómo registro a mi mascota?",
          answer: "En el menú de perfil puedes añadir una nueva mascota con nombre, especie y foto."
        },
        {
          question: "¿Puedo editar los datos de mi mascota después?",
          answer: "Sí. Solo entra al perfil de la mascota y edita los datos que necesites."
        },
        {
          question: "¿Dónde veo el historial médico de mi mascota?",
          answer: "Al entrar a su perfil encontrarás el historial en la parte inferior."
        }
      ]
    },
    {
      category: "📍 Servicios",
      questions: [
        {
          question: "¿Qué servicios ofrecen además de salud?",
          answer: "También puedes agendar estética, tratamientos y encontrar negocios cercanos."
        },
        {
          question: "¿Cómo encuentro servicios cerca de mí?",
          answer: "En la sección \"Cerca de ti\" puedes ver un mapa y buscarlos por nombre o especialidad."
        }
      ]
    },
    {
      category: "💬 Contacto y soporte",
      questions: [
        {
          question: "¿Cómo contacto al veterinario?",
          answer: "Una vez agendada la cita, se activa un chat con el veterinario para coordinar."
        },
        {
          question: "¿Qué hago si tengo una emergencia?",
          answer: "Te recomendamos acudir al veterinario más cercano. Puedes usar el mapa para encontrar uno."
        }
      ]
    },
    {
      category: "🔒 Cuenta y acceso",
      questions: [
        {
          question: "¿Qué hago si olvidé mi contraseña?",
          answer: "Usa el botón \"¿Olvidaste tu contraseña?\" en la pantalla de inicio de sesión para recibir un enlace por correo."
        },
        {
          question: "¿Cómo cambio mi contraseña?",
          answer: "En ajustes, entra a \"Cambiar contraseña\" y sigue las instrucciones."
        },
        {
          question: "¿Cómo elimino mi cuenta?",
          answer: "Escríbenos a soporte@vett.com y lo haremos por ti manualmente."
        }
      ]
    },
    {
      category: "💼 Negocios",
      questions: [
        {
          question: "¿Cómo puedo anunciar mi negocio en Vett?",
          answer: "Próximamente abriremos una sección para negocios. Escríbenos a soporte si te interesa."
        }
      ]
    }
  ];

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
            <h1 className="text-xl font-medium text-white">Preguntas frecuentes</h1>
          </div>
        </div>
      }
    >
      <div className="p-4 pb-8">
        <div className="space-y-6">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50">
                <h2 className="font-medium text-gray-800">{category.category}</h2>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, questionIndex) => (
                  <AccordionItem 
                    key={`${categoryIndex}-${questionIndex}`} 
                    value={`item-${categoryIndex}-${questionIndex}`}
                    className="border-b last:border-b-0"
                  >
                    <AccordionTrigger className="px-4 py-3 text-left hover:no-underline hover:bg-gray-50/50">
                      <span className="font-medium text-gray-800">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </LayoutBase>
  );
};

export default FAQScreen;

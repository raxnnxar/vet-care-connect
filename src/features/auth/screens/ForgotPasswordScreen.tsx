
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/molecules/form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ROUTES } from '@/frontend/shared/constants/routes';

const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: 'Por favor ingresa un correo electrónico válido.',
  }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsSubmitting(true);
    
    try {
      // Send password reset email using Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: window.location.origin + ROUTES.RESET_PASSWORD.replace(':token', ''),
      });
      
      if (error) throw error;
      
      setEmailSent(true);
      toast.success('Se ha enviado un correo para restablecer tu contraseña');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast.error(error.message || 'Error al enviar el correo de recuperación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-gradient-to-b from-[#7ECEC4] to-[#79D0B8]">
      <div className="flex items-center z-10 pt-8 px-6">
        <button 
          onClick={handleBackClick}
          className="p-3 rounded-full bg-white/30 backdrop-blur-sm transition-all hover:bg-white/40"
          aria-label="Regresar"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>
      
      <div className="flex flex-col flex-1 z-10 px-6 py-4">
        <div className="text-center mt-4 mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">
            Recuperar contraseña
          </h1>
          <p className="text-white text-lg opacity-90">
            Ingresa tu correo electrónico para recibir instrucciones
          </p>
        </div>
        
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            {!emailSent ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Correo electrónico</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Ingresa tu correo electrónico" 
                            {...field} 
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    className="w-full h-12 mt-6 bg-[#79D0B8] hover:bg-[#6abfaa] text-white font-semibold rounded-lg text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      'Enviar instrucciones'
                    )}
                  </Button>
                  
                  <div className="text-center mt-4">
                    <span className="text-gray-600">¿Recordaste tu contraseña?</span>
                    <Button 
                      type="button" 
                      variant="link" 
                      onClick={() => navigate(ROUTES.LOGIN)}
                      className="text-[#79D0B8] hover:text-[#5FBFB3]"
                    >
                      Iniciar sesión
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="text-center py-6">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">Correo enviado</h2>
                <p className="text-gray-600 mb-6">
                  Hemos enviado un correo electrónico con instrucciones para restablecer tu contraseña. 
                  Por favor revisa tu bandeja de entrada.
                </p>
                <Button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="bg-[#79D0B8] hover:bg-[#6abfaa] text-white font-semibold rounded-lg px-6 py-3"
                >
                  Volver a inicio de sesión
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;

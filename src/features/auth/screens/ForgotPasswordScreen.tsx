
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
import { ROUTES } from '@/frontend/shared/constants/routes';
import { supabase } from '@/integrations/supabase/client';

const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: 'Por favor ingresa un correo electrónico válido.',
  }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleBackClick = () => {
    navigate(ROUTES.LOGIN);
  };

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: window.location.origin + ROUTES.RESET_PASSWORD.replace(':token', ''),
      });
      
      if (error) {
        throw error;
      }
      
      setEmailSent(true);
      toast.success('Se ha enviado un correo para recuperar tu contraseña');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Error al enviar correo de recuperación');
    } finally {
      setIsLoading(false);
    }
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
            Ingresa tu correo electrónico para recuperar tu contraseña
          </p>
        </div>
        
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
            {emailSent ? (
              <div className="text-center py-6">
                <div className="bg-green-100 p-4 rounded-lg mb-4">
                  <h2 className="text-green-800 text-xl font-medium mb-2">¡Correo enviado!</h2>
                  <p className="text-green-700">
                    Hemos enviado un enlace a tu correo electrónico para recuperar tu contraseña.
                    Por favor revisa tu bandeja de entrada.
                  </p>
                </div>
                <Button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="mt-4 bg-[#79D0B8] hover:bg-[#6abfaa]"
                >
                  Volver al inicio de sesión
                </Button>
              </div>
            ) : (
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
                    className="w-full h-12 mt-4 bg-[#79D0B8] hover:bg-[#6abfaa] text-white font-semibold rounded-lg text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      'Enviar correo de recuperación'
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;

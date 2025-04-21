
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
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

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: 'La contraseña debe tener al menos 6 caracteres.',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        throw error;
      }

      setResetComplete(true);
      toast.success('Contraseña actualizada exitosamente');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Error al actualizar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-gradient-to-b from-[#7ECEC4] to-[#79D0B8]">
      <div className="flex flex-col flex-1 z-10 px-6 py-12">
        <div className="text-center mt-4 mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">
            Establecer nueva contraseña
          </h1>
          <p className="text-white text-lg opacity-90">
            Ingresa tu nueva contraseña
          </p>
        </div>
        
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
            {resetComplete ? (
              <div className="text-center py-6">
                <div className="bg-green-100 p-4 rounded-lg mb-4">
                  <h2 className="text-green-800 text-xl font-medium mb-2">¡Contraseña actualizada!</h2>
                  <p className="text-green-700">
                    Tu contraseña ha sido actualizada exitosamente.
                    Serás redirigido al inicio de sesión en unos segundos.
                  </p>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Nueva contraseña</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Ingresa tu nueva contraseña"
                              {...field}
                              className="h-12 pr-10"
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Confirmar contraseña</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirma tu nueva contraseña"
                              {...field}
                              className="h-12 pr-10"
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
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
                        Actualizando...
                      </span>
                    ) : (
                      'Actualizar contraseña'
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

export default ResetPasswordScreen;

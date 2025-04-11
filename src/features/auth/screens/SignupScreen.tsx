
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
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
import { authService } from '@/integrations/supabase/supabaseService';
import { profilesService } from '@/integrations/supabase/supabaseService';
import { USER_ROLES } from '@/core/constants/app.constants';
import { ServiceTypeType } from './ServiceTypeSelectionScreen';

// Define signup form schema with validation
const signupFormSchema = z.object({
  displayName: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  email: z.string().email({
    message: 'Por favor ingresa un correo electrónico válido.',
  }),
  password: z.string().min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres.',
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

interface SignupScreenProps {
  onBack?: () => void;
  onRegisterComplete?: () => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ 
  onBack,
  onRegisterComplete,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Get role and serviceType from location state
  const state = location.state as { role?: string; serviceType?: ServiceTypeType } | undefined;
  const role = state?.role || USER_ROLES.PET_OWNER;
  const serviceType = state?.serviceType;

  // Set up form with validation
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      // Navigate back based on role
      if (role === USER_ROLES.VETERINARIAN && serviceType) {
        navigate('/service-type-selection', { state: { role } });
      } else {
        navigate('/role-selection');
      }
    }
  };

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    
    try {
      // Register user with Supabase
      const authResponse = await authService.signUp(
        data.email, 
        data.password,
        { 
          role,
          serviceType,
          displayName: data.displayName
        }
      );
      
      if (authResponse.error) {
        throw new Error(authResponse.error.message);
      }

      if (!authResponse.data?.id) {
        throw new Error("No se pudo crear la cuenta");
      }
      
      // Create profile record
      const profileData = {
        id: authResponse.data.id,
        email: data.email,
        display_name: data.displayName,
        role: role,
      };
      
      const profileResponse = await profilesService.insert(profileData);
      
      if (profileResponse.error) {
        throw new Error(profileResponse.error.message);
      }
      
      // Create service provider record if applicable
      if (role === USER_ROLES.VETERINARIAN && serviceType) {
        // We would create the service provider record here
        // This depends on the specific tables in your database
        // For now, we'll just show a success message
      }
      
      toast.success('¡Cuenta creada con éxito!');
      
      // Navigate based on role
      if (onRegisterComplete) {
        onRegisterComplete();
      } else {
        if (role === USER_ROLES.PET_OWNER) {
          navigate('/owner-dashboard');
        } else {
          navigate('/provider-dashboard');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-gradient-to-b from-[#7ECEC4] to-[#79D0B8]">
      {/* Header with back button */}
      <div className="flex items-center z-10 pt-8 px-6">
        <button 
          onClick={handleBackClick}
          className="p-3 rounded-full bg-white/30 backdrop-blur-sm transition-all hover:bg-white/40"
          aria-label="Regresar"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 z-10 px-6 py-4">
        {/* Header text */}
        <div className="text-center mt-4 mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">
            Crear cuenta
          </h1>
          <p className="text-white text-lg opacity-90">
            {role === USER_ROLES.PET_OWNER 
              ? 'Crea tu cuenta como dueño de mascota' 
              : 'Crea tu cuenta como proveedor de servicios'}
          </p>
        </div>
        
        {/* Registration form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Nombre completo</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ingresa tu nombre completo" 
                          {...field} 
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Contraseña</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Ingresa tu contraseña"
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
                            placeholder="Confirma tu contraseña"
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
                  className="w-full h-12 mt-6 bg-[#79D0B8] hover:bg-[#6abfaa] text-white font-semibold rounded-lg text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creando cuenta...
                    </span>
                  ) : (
                    'Crear cuenta'
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;

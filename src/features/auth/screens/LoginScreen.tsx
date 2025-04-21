
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { useDispatch } from 'react-redux';
import { ROUTES } from '@/frontend/shared/constants/routes';
import { AppDispatch } from '@/state/store';
import { loginUser } from '../store/authThunks';

const loginFormSchema = z.object({
  email: z.string().email({
    message: 'Por favor ingresa un correo electrónico válido.',
  }),
  password: z.string().min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres.',
  }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleBackClick = () => {
    navigate('/');
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const resultAction = await dispatch(loginUser({
        email: data.email,
        password: data.password,
      }));
      
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success('Inicio de sesión exitoso');
        // Redirect to the appropriate screen based on user role
        const user = resultAction.payload;
        if (user.role === 'pet_owner') {
          navigate(ROUTES.OWNER);
        } else if (user.role === 'service_provider') {
          navigate(ROUTES.VET);
        } else {
          navigate(ROUTES.POST_SIGNUP_ROLE);
        }
      } else {
        toast.error(resultAction.payload as string || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al iniciar sesión');
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
            Iniciar sesión
          </h1>
          <p className="text-white text-lg opacity-90">
            Ingresa tus datos para acceder a tu cuenta
          </p>
        </div>
        
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
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
                
                <div className="flex justify-end">
                  <Link to={ROUTES.FORGOT_PASSWORD} className="text-[#79D0B8] text-sm hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                
                <Button
                  type="submit"
                  className="w-full h-12 mt-2 bg-[#79D0B8] hover:bg-[#6abfaa] text-white font-semibold rounded-lg text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Iniciando sesión...
                    </span>
                  ) : (
                    'Iniciar sesión'
                  )}
                </Button>
              </form>
            </Form>
          </div>
          
          <div className="text-center">
            <p className="text-white">
              ¿No tienes una cuenta?{' '}
              <Link to={ROUTES.SIGNUP} className="font-semibold hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;


import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '@/integrations/supabase/client';

// Import types from constants to ensure consistency
import { UserRoleType } from '@/core/constants/app.constants';

// Define types for user roles
type UserRole = UserRoleType | null;
type ProviderType = 'veterinarian' | 'grooming' | null;

interface UserContextType {
  userRole: UserRole;
  providerType: ProviderType;
  isLoading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType>({
  userRole: null,
  providerType: null,
  isLoading: false,
  error: null,
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [providerType, setProviderType] = useState<ProviderType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user || !user.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // First check the profiles table for role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        // If user has admin role in profiles, set it directly
        if (profileData?.role === 'admin') {
          console.log('Admin role detected from profiles table');
          setUserRole('admin');
          setProviderType(null);
          setIsLoading(false);
          return;
        }
        
        // Check if user is a pet owner
        const { data: petOwnerData } = await supabase
          .from('pet_owners')
          .select('id')
          .eq('id', user.id)
          .single();
        
        if (petOwnerData) {
          setUserRole('pet_owner');
          setProviderType(null);
          setIsLoading(false);
          return;
        }
        
        // Check if user is a service provider
        const { data: providerData } = await supabase
          .from('service_providers')
          .select('id, provider_type')
          .eq('id', user.id)
          .single();
        
        if (providerData) {
          setUserRole('service_provider');
          setProviderType(providerData.provider_type as ProviderType);
        } else {
          setUserRole(null);
          setProviderType(null);
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
        setError('Failed to fetch user role information');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchUserRole();
    } else {
      // Reset state when user logs out
      setUserRole(null);
      setProviderType(null);
    }
  }, [user?.id]);

  return (
    <UserContext.Provider value={{ userRole, providerType, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
};

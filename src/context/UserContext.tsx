import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabaseService } from '../integrations/supabase/supabaseService';

type UserRole = 'pet_owner' | 'service_provider' | null;
type ProviderType = 'veterinarian' | 'pet_grooming' | null;

interface UserContextType {
  user: any | null;
  userRole: UserRole;
  providerType: ProviderType;
  isLoading: boolean;
  error: Error | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [providerType, setProviderType] = useState<ProviderType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseService.getCurrentUserWithProfile();
      
      if (error) throw error;
      
      if (data) {
        setUser(data.user);
        setUserRole(data.profile?.role as UserRole || null);
        setProviderType(data.profile?.provider_type as ProviderType || null);
      } else {
        setUser(null);
        setUserRole(null);
        setProviderType(null);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    
    // Set up auth state change listener
    const { data: authListener } = supabaseService.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await fetchUserData();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserRole(null);
          setProviderType(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const refreshUser = async () => {
    await fetchUserData();
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      userRole, 
      providerType,
      isLoading, 
      error, 
      refreshUser 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

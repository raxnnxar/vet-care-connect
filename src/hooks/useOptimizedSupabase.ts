
import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Hook to prevent duplicate Supabase calls and optimize performance
export const useOptimizedSupabase = () => {
  const pendingCalls = useRef<Set<string>>(new Set());

  const optimizedQuery = useCallback(async (
    queryKey: string,
    queryFn: () => Promise<any>
  ) => {
    // Prevent duplicate calls
    if (pendingCalls.current.has(queryKey)) {
      console.log(`Query ${queryKey} already in progress, skipping...`);
      return null;
    }

    pendingCalls.current.add(queryKey);
    
    try {
      console.log(`Executing optimized query: ${queryKey}`);
      const result = await queryFn();
      return result;
    } finally {
      pendingCalls.current.delete(queryKey);
    }
  }, []);

  return { optimizedQuery };
};

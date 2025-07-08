
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  display_name: string;
  email: string;
  role: string;
  created_at: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, email, role, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateUserRole = async (userId: string, newRole: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error updating user role:', err);
    return false;
  }
};

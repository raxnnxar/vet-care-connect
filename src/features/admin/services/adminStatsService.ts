
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalUsers: number;
  usersByRole: { [key: string]: number };
  totalPets: number;
  totalAppointments: number;
  weeklyAppointments: number;
}

export const fetchAdminStats = async (): Promise<AdminStats> => {
  // Get user stats
  const { data: usersData, error: usersError } = await supabase
    .from('profiles')
    .select('role');

  if (usersError) throw usersError;

  const usersByRole = usersData.reduce((acc: { [key: string]: number }, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  // Get pets count
  const { count: petsCount, error: petsError } = await supabase
    .from('pets')
    .select('*', { count: 'exact', head: true });

  if (petsError) throw petsError;

  // Get appointments count
  const { count: appointmentsCount, error: appointmentsError } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true });

  if (appointmentsError) throw appointmentsError;

  // Get weekly appointments
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { count: weeklyCount, error: weeklyError } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', oneWeekAgo.toISOString());

  if (weeklyError) throw weeklyError;

  return {
    totalUsers: usersData.length,
    usersByRole,
    totalPets: petsCount || 0,
    totalAppointments: appointmentsCount || 0,
    weeklyAppointments: weeklyCount || 0,
  };
};

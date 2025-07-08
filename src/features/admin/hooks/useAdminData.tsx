import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  totalUsers: number;
  usersByRole: { [key: string]: number };
  totalPets: number;
  totalAppointments: number;
  weeklyAppointments: number;
}

interface User {
  id: string;
  display_name: string;
  email: string;
  role: string;
  created_at: string;
}

export const useAdminData = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
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

      setStats({
        totalUsers: usersData.length,
        usersByRole,
        totalPets: petsCount || 0,
        totalAppointments: appointmentsCount || 0,
        weeklyAppointments: weeklyCount || 0,
      });
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError('Error al cargar estadísticas');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, email, role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error al cargar usuarios');
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      // Refresh data
      await fetchUsers();
      await fetchStats();
      
      return true;
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Error al actualizar rol del usuario');
      return false;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchUsers()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    stats,
    users,
    loading,
    error,
    updateUserRole,
    refreshData: () => {
      fetchStats();
      fetchUsers();
    }
  };
};
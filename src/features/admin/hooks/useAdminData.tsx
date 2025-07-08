
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

interface Pet {
  id: string;
  name: string;
  species: string;
  owner_email: string;
  owner_name: string;
}

interface Appointment {
  id: string;
  appointment_date: string;
  pet_name: string;
  owner_email: string;
  vet_email: string;
  status: string;
}

export const useAdminData = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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

  const fetchPets = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select(`
          id,
          name,
          species,
          profiles!pets_owner_id_fkey (
            email,
            display_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedPets = data?.map(pet => ({
        id: pet.id,
        name: pet.name,
        species: pet.species,
        owner_email: pet.profiles?.email || 'Sin email',
        owner_name: pet.profiles?.display_name || 'Sin nombre'
      })) || [];
      
      setPets(formattedPets);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError('Error al cargar mascotas');
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          status,
          pets!appointments_pet_id_fkey (
            name
          ),
          profiles!appointments_owner_id_fkey (
            email
          ),
          vet_profiles:profiles!appointments_provider_id_fkey (
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedAppointments = data?.map(appointment => ({
        id: appointment.id,
        appointment_date: appointment.appointment_date,
        status: appointment.status,
        pet_name: appointment.pets?.name || 'Sin nombre',
        owner_email: appointment.profiles?.email || 'Sin email',
        vet_email: appointment.vet_profiles?.email || 'Sin asignar'
      })) || [];
      
      setAppointments(formattedAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Error al cargar citas');
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
      await Promise.all([fetchStats(), fetchUsers(), fetchPets(), fetchAppointments()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    stats,
    users,
    pets,
    appointments,
    loading,
    error,
    updateUserRole,
    refreshData: () => {
      fetchStats();
      fetchUsers();
      fetchPets();
      fetchAppointments();
    }
  };
};

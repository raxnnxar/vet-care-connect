
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
          owner_id
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get owner information for each pet
      const petsWithOwners = await Promise.all(
        (data || []).map(async (pet) => {
          const { data: ownerData } = await supabase
            .from('profiles')
            .select('email, display_name')
            .eq('id', pet.owner_id)
            .single();

          return {
            id: pet.id,
            name: pet.name,
            species: pet.species,
            owner_email: ownerData?.email || 'Sin email',
            owner_name: ownerData?.display_name || 'Sin nombre'
          };
        })
      );
      
      setPets(petsWithOwners);
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
          pet_id,
          owner_id,
          provider_id
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get additional information for each appointment
      const appointmentsWithDetails = await Promise.all(
        (data || []).map(async (appointment) => {
          // Get pet name
          const { data: petData } = await supabase
            .from('pets')
            .select('name')
            .eq('id', appointment.pet_id)
            .single();

          // Get owner email
          const { data: ownerData } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', appointment.owner_id)
            .single();

          // Get vet email
          const { data: vetData } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', appointment.provider_id)
            .single();

          return {
            id: appointment.id,
            appointment_date: typeof appointment.appointment_date === 'string' 
              ? appointment.appointment_date 
              : JSON.stringify(appointment.appointment_date),
            status: appointment.status || 'Sin estado',
            pet_name: petData?.name || 'Sin nombre',
            owner_email: ownerData?.email || 'Sin email',
            vet_email: vetData?.email || 'Sin asignar'
          };
        })
      );
      
      setAppointments(appointmentsWithDetails);
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

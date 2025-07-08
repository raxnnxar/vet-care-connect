
import { useState, useEffect } from 'react';
import { fetchAdminStats, AdminStats } from '../services/adminStatsService';
import { fetchUsers, updateUserRole, User } from '../services/adminUsersService';
import { fetchPets, Pet } from '../services/adminPetsService';
import { fetchAppointments, Appointment } from '../services/adminAppointmentsService';

export const useAdminData = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      const statsData = await fetchAdminStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError('Error al cargar estadísticas');
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error al cargar usuarios');
    }
  };

  const loadPets = async () => {
    try {
      const petsData = await fetchPets();
      setPets(petsData);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError('Error al cargar mascotas');
    }
  };

  const loadAppointments = async () => {
    try {
      const appointmentsData = await fetchAppointments();
      setAppointments(appointmentsData);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Error al cargar citas');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    const success = await updateUserRole(userId, newRole);
    if (success) {
      // Refresh data
      await loadUsers();
      await loadStats();
    }
    return success;
  };

  const refreshData = async () => {
    await Promise.all([loadStats(), loadUsers(), loadPets(), loadAppointments()]);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await refreshData();
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
    updateUserRole: handleUpdateUserRole,
    refreshData
  };
};


import { useState, useEffect, useCallback } from 'react';
import { vaccinationRecordsApi } from '../api/vaccinationRecordsApi';
import { VaccinationRecord, CreateVaccinationRecord } from '../types/vaccinationTypes';
import { toast } from 'sonner';

export const useVaccinationRecords = (petId: string) => {
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fetchRecords = useCallback(async () => {
    if (!petId) return;

    setIsLoading(true);
    try {
      const { data, error } = await vaccinationRecordsApi.getVaccinationRecords(petId);

      if (error) {
        console.error('Error fetching vaccination records:', error);
        toast.error('Error al cargar los registros de vacunación');
        return;
      }

      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching vaccination records:', error);
      toast.error('Error al cargar los registros de vacunación');
    } finally {
      setIsLoading(false);
    }
  }, [petId]);

  const createRecord = useCallback(async (record: CreateVaccinationRecord): Promise<boolean> => {
    setIsCreating(true);
    try {
      const { data, error } = await vaccinationRecordsApi.createVaccinationRecord(record);

      if (error) {
        console.error('Error creating vaccination record:', error);
        toast.error('Error al crear el registro de vacunación');
        return false;
      }

      if (data) {
        setRecords(prev => [data, ...prev]);
        toast.success('Registro de vacunación creado exitosamente');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error creating vaccination record:', error);
      toast.error('Error al crear el registro de vacunación');
      return false;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const deleteRecord = useCallback(async (recordId: string): Promise<boolean> => {
    try {
      const { error } = await vaccinationRecordsApi.deleteVaccinationRecord(recordId);

      if (error) {
        console.error('Error deleting vaccination record:', error);
        toast.error('Error al eliminar el registro de vacunación');
        return false;
      }

      setRecords(prev => prev.filter(record => record.id !== recordId));
      toast.success('Registro de vacunación eliminado exitosamente');
      return true;
    } catch (error) {
      console.error('Error deleting vaccination record:', error);
      toast.error('Error al eliminar el registro de vacunación');
      return false;
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return {
    records,
    isLoading,
    isCreating,
    createRecord,
    deleteRecord,
    refetchRecords: fetchRecords
  };
};

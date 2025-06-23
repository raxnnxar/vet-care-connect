
import { supabase } from '@/integrations/supabase/client';
import { VaccinationRecord, CreateVaccinationRecord } from '../types/vaccinationTypes';

export const vaccinationRecordsApi = {
  async getVaccinationRecords(petId: string) {
    try {
      const { data, error } = await supabase
        .from('vaccination_records')
        .select('*')
        .eq('pet_id', petId)
        .order('application_date', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error fetching vaccination records:', error);
      return { data: null, error: error as Error };
    }
  },

  async createVaccinationRecord(record: CreateVaccinationRecord) {
    try {
      const { data, error } = await supabase
        .from('vaccination_records')
        .insert({
          ...record,
          administered_by: null // Owner is creating the record
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating vaccination record:', error);
      return { data: null, error: error as Error };
    }
  },

  async deleteVaccinationRecord(recordId: string) {
    try {
      const { error } = await supabase
        .from('vaccination_records')
        .delete()
        .eq('id', recordId);

      return { error };
    } catch (error) {
      console.error('Error deleting vaccination record:', error);
      return { error: error as Error };
    }
  }
};

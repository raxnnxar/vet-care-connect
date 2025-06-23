
export interface VaccinationRecord {
  id?: string;
  pet_id: string;
  vaccine_name: string;
  application_date: string;
  next_due_date?: string;
  administered_by?: string;
  manufacturer?: string;
  lot_number?: string;
  lot_expiry_date?: string;
  route?: string;
  anatomical_site?: string;
  needs_booster?: boolean;
  notes?: string;
  created_at?: string;
}

export interface CreateVaccinationRecord {
  pet_id: string;
  vaccine_name: string;
  application_date: string;
  needs_booster?: boolean;
  notes?: string;
}

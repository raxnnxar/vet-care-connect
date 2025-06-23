
-- Add indexes for better performance on existing vaccination_records table
CREATE INDEX IF NOT EXISTS vaccination_records_pet_id_idx ON public.vaccination_records(pet_id);
CREATE INDEX IF NOT EXISTS vaccination_records_application_date_idx ON public.vaccination_records(application_date);

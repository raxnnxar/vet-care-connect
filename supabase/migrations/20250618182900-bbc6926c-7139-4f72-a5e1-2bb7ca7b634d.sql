
-- Create the vet_medical_records table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.vet_medical_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID NOT NULL,
  appointment_id UUID,
  veterinarian_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.vet_medical_records ENABLE ROW LEVEL SECURITY;

-- Create policies for veterinarians to manage their own records
CREATE POLICY "Veterinarians can view their own medical records" 
  ON public.vet_medical_records 
  FOR SELECT 
  USING (veterinarian_id = auth.uid());

CREATE POLICY "Veterinarians can create their own medical records" 
  ON public.vet_medical_records 
  FOR INSERT 
  WITH CHECK (veterinarian_id = auth.uid());

CREATE POLICY "Veterinarians can update their own medical records" 
  ON public.vet_medical_records 
  FOR UPDATE 
  USING (veterinarian_id = auth.uid());

CREATE POLICY "Veterinarians can delete their own medical records" 
  ON public.vet_medical_records 
  FOR DELETE 
  USING (veterinarian_id = auth.uid());

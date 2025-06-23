
-- Add Row Level Security to vet_personal_notes table
ALTER TABLE public.vet_personal_notes ENABLE ROW LEVEL SECURITY;

-- Create policy that allows veterinarians to view their own notes
CREATE POLICY "Veterinarians can view their own notes" 
  ON public.vet_personal_notes 
  FOR SELECT 
  USING (veterinarian_id = auth.uid());

-- Create policy that allows veterinarians to create their own notes
CREATE POLICY "Veterinarians can create their own notes" 
  ON public.vet_personal_notes 
  FOR INSERT 
  WITH CHECK (veterinarian_id = auth.uid());

-- Create policy that allows veterinarians to update their own notes
CREATE POLICY "Veterinarians can update their own notes" 
  ON public.vet_personal_notes 
  FOR UPDATE 
  USING (veterinarian_id = auth.uid());

-- Create policy that allows veterinarians to delete their own notes
CREATE POLICY "Veterinarians can delete their own notes" 
  ON public.vet_personal_notes 
  FOR DELETE 
  USING (veterinarian_id = auth.uid());

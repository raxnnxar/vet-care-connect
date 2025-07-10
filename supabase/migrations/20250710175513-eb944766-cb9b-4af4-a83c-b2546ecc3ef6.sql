-- Add missing RLS policies for vaccination_records table

-- Policy for pet owners to view vaccination records of their pets
CREATE POLICY "Pet owners can view their pets' vaccination records" 
ON vaccination_records 
FOR SELECT 
USING (
  pet_id IN (
    SELECT id FROM pets WHERE owner_id = auth.uid()
  )
);

-- Policy for service providers to view vaccination records
CREATE POLICY "Service providers can view vaccination records" 
ON vaccination_records 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM service_providers 
    WHERE id = auth.uid()
  )
);

-- Policy for pet owners to insert vaccination records for their pets
CREATE POLICY "Pet owners can insert vaccination records for their pets" 
ON vaccination_records 
FOR INSERT 
WITH CHECK (
  pet_id IN (
    SELECT id FROM pets WHERE owner_id = auth.uid()
  )
);

-- Policy for service providers to insert vaccination records
CREATE POLICY "Service providers can insert vaccination records" 
ON vaccination_records 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM service_providers 
    WHERE id = auth.uid()
  )
);

-- Policy for only the veterinarian who administered the vaccine to update it
CREATE POLICY "Only administering vet can update vaccination records" 
ON vaccination_records 
FOR UPDATE 
USING (administered_by = auth.uid());

-- Policy for pet owners to delete their pets' vaccination records
CREATE POLICY "Pet owners can delete their pets' vaccination records" 
ON vaccination_records 
FOR DELETE 
USING (
  pet_id IN (
    SELECT id FROM pets WHERE owner_id = auth.uid()
  )
);

-- Add missing INSERT policy for vaccine_documents table
CREATE POLICY "Pet owners can insert vaccine documents" 
ON vaccine_documents 
FOR INSERT 
WITH CHECK (
  pet_id IN (
    SELECT id FROM pets WHERE owner_id = auth.uid()
  )
);
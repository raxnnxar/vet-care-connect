-- Add RLS policies for vaccine_documents table

-- Policy for pet owners to view vaccine documents of their pets
CREATE POLICY "Pet owners can view their pets' vaccine documents" 
ON vaccine_documents 
FOR SELECT 
USING (
  pet_id IN (
    SELECT id FROM pets WHERE owner_id = auth.uid()
  )
);

-- Policy for service providers to view vaccine documents
CREATE POLICY "Service providers can view vaccine documents" 
ON vaccine_documents 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM service_providers 
    WHERE id = auth.uid()
  )
);

-- Policy for pet owners to update their pets' vaccine documents
CREATE POLICY "Pet owners can update their pets' vaccine documents" 
ON vaccine_documents 
FOR UPDATE 
USING (
  pet_id IN (
    SELECT id FROM pets WHERE owner_id = auth.uid()
  )
);

-- Policy for pet owners to delete their pets' vaccine documents
CREATE POLICY "Pet owners can delete their pets' vaccine documents" 
ON vaccine_documents 
FOR DELETE 
USING (
  pet_id IN (
    SELECT id FROM pets WHERE owner_id = auth.uid()
  )
);
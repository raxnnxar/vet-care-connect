
-- Make veterinarian_id nullable in reviews table to allow grooming-only reviews
ALTER TABLE reviews ALTER COLUMN veterinarian_id DROP NOT NULL;

-- Add a check constraint to ensure either veterinarian_id or grooming_id is provided
ALTER TABLE reviews ADD CONSTRAINT reviews_provider_check 
CHECK (
  (veterinarian_id IS NOT NULL AND grooming_id IS NULL) OR 
  (grooming_id IS NOT NULL AND veterinarian_id IS NULL)
);


-- Add trigger to update grooming ratings when reviews are added/updated/deleted
CREATE OR REPLACE FUNCTION public.update_grooming_ratings()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  grooming_id_val UUID;
BEGIN
  -- Determinar el ID del grooming según la operación
  IF TG_OP = 'DELETE' THEN
    grooming_id_val := OLD.grooming_id;
  ELSE
    grooming_id_val := NEW.grooming_id;
  END IF;
  
  -- Solo proceder si hay un grooming_id válido
  IF grooming_id_val IS NOT NULL THEN
    -- Actualizar el promedio de calificaciones y el total de reseñas para grooming
    UPDATE pet_grooming
    SET 
      average_rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews
        WHERE grooming_id = grooming_id_val
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM reviews
        WHERE grooming_id = grooming_id_val
      )
    WHERE id = grooming_id_val;
  END IF;
  
  -- Devolver el registro apropiado según la operación
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$function$;

-- Add average_rating and total_reviews columns to pet_grooming table
ALTER TABLE pet_grooming 
ADD COLUMN IF NOT EXISTS average_rating NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Create trigger for grooming ratings (only if it doesn't exist)
DROP TRIGGER IF EXISTS update_grooming_ratings_trigger ON reviews;
CREATE TRIGGER update_grooming_ratings_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_grooming_ratings();


-- Crear vista para el historial médico unificado
CREATE OR REPLACE VIEW v_medical_history AS
SELECT
  tc.id AS event_id,
  tc.start_date AS event_date,
  'tratamiento'::text AS event_type,
  tc.diagnosis,
  p.display_name AS vet_name,
  tc.pet_id,
  tc.veterinarian_id,
  tc.instructions_for_owner,
  tc.appointment_id,
  NULL::text AS description,
  NULL::text AS title
FROM treatment_cases tc
JOIN profiles p ON p.id = tc.veterinarian_id

UNION ALL

SELECT
  vmr.id AS event_id,
  vmr.date AS event_date,
  'nota'::text AS event_type,
  vmr.title AS diagnosis,
  p.display_name AS vet_name,
  vmr.pet_id,
  vmr.veterinarian_id,
  NULL::text AS instructions_for_owner,
  vmr.appointment_id,
  vmr.description,
  vmr.title
FROM vet_medical_records vmr
JOIN profiles p ON p.id = vmr.veterinarian_id

ORDER BY event_date DESC;

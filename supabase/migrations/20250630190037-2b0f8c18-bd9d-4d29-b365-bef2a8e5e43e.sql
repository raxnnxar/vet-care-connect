
CREATE OR REPLACE VIEW public.v_veterinarians_search AS
SELECT
    v.id,
    v.profile_image_url,
    v.average_rating,
    v.total_reviews,
    v.specialization,
    v.animals_treated,
    v.emergency_services,
    v.clinic_latitude,
    v.clinic_longitude,
    /* Safe handler: wrap object into array if needed */
    (SELECT ROUND(AVG( (svc->>'precio')::numeric ), 2)
       FROM jsonb_array_elements(
             CASE
               WHEN jsonb_typeof(v.services_offered) = 'object'
                 THEN jsonb_build_array(v.services_offered)
               ELSE v.services_offered
             END
           ) AS svc
    ) AS precio_promedio,
    CASE
      WHEN (
        SELECT AVG( (svc->>'precio')::numeric )
        FROM jsonb_array_elements(
               CASE
                 WHEN jsonb_typeof(v.services_offered) = 'object'
                   THEN jsonb_build_array(v.services_offered)
                 ELSE v.services_offered
               END
             ) AS svc
      ) < 200 THEN '$'
      WHEN (
        SELECT AVG( (svc->>'precio')::numeric )
        FROM jsonb_array_elements(
               CASE
                 WHEN jsonb_typeof(v.services_offered) = 'object'
                   THEN jsonb_build_array(v.services_offered)
                 ELSE v.services_offered
               END
             ) AS svc
      ) < 350 THEN '$$'
      ELSE '$$$'
    END AS categoria_precio
FROM public.veterinarians v;

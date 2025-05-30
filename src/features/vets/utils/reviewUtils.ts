
import { supabase } from '@/integrations/supabase/client';

// Función para traducir especialidades
export function translateSpecialization(spec: string): string {
  const translations: Record<string, string> = {
    'cardiology': 'Cardiología',
    'dermatology': 'Dermatología',
    'orthopedics': 'Ortopedia',
    'neurology': 'Neurología',
    'ophthalmology': 'Oftalmología',
    'oncology': 'Oncología',
    'general': 'Medicina General',
    'surgery': 'Cirugía',
    'dentistry': 'Odontología',
    'nutrition': 'Nutrición',
    'internal_medicine': 'Medicina Interna',
    'emergency': 'Emergencias',
    'rehabilitation': 'Rehabilitación',
    'exotics': 'Animales Exóticos',
  };
  
  return translations[spec.toLowerCase()] || spec;
}

// Función para obtener iniciales de un nombre
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

// Función para enviar una reseña a la base de datos
export async function submitReview(
  veterinarianId: string | undefined,
  userId: string,
  rating: number,
  comment: string
): Promise<void> {
  if (!veterinarianId) {
    throw new Error("ID de veterinario no especificado");
  }

  const { error } = await supabase.from('reviews').insert({
    veterinarian_id: veterinarianId,
    pet_owner_id: userId,
    rating,
    comment: comment.trim() || null
  });

  if (error) throw error;
}

// Función para obtener la información básica de un veterinario
export async function fetchVetDetails(id: string | undefined) {
  if (!id) {
    throw new Error("ID de veterinario no especificado");
  }
  
  const { data, error } = await supabase
    .from('veterinarians')
    .select(`
      profile_image_url,
      specialization,
      service_providers (
        profiles (
          display_name
        )
      )
    `)
    .eq('id', id)
    .single();
    
  if (error) {
    throw new Error("Error al cargar los datos del veterinario");
  }
  
  return data;
}

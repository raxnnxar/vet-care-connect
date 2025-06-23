
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { format, startOfWeek, endOfWeek } from 'date-fns';

interface VetNote {
  id: string;
  title: string | null;
  content: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export const useVetNotes = (vetId: string | undefined, currentWeekStart: Date) => {
  const [notes, setNotes] = useState<VetNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const weekStart = format(startOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd');

  const fetchNotes = async () => {
    if (!vetId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('vet_personal_notes')
        .select('*')
        .eq('veterinarian_id', vetId)
        .gte('date', weekStart)
        .lte('date', weekEnd)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las notas",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async (noteDate: string, title: string, content: string) => {
    if (!vetId) return;

    try {
      const { data, error } = await supabase
        .from('vet_personal_notes')
        .insert({
          veterinarian_id: vetId,
          date: noteDate,
          title: title || null,
          content
        })
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => [data, ...prev]);
      toast({
        title: "Nota guardada",
        description: "La nota se ha guardado correctamente"
      });
      
      return data;
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la nota",
        variant: "destructive"
      });
    }
  };

  const updateNote = async (noteId: string, title: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('vet_personal_notes')
        .update({
          title: title || null,
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId)
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => prev.map(note => note.id === noteId ? data : note));
      toast({
        title: "Nota actualizada",
        description: "Los cambios se han guardado correctamente"
      });
      
      return data;
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la nota",
        variant: "destructive"
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('vet_personal_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== noteId));
      toast({
        title: "Nota eliminada",
        description: "La nota se ha eliminado correctamente"
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la nota",
        variant: "destructive"
      });
    }
  };

  const getNotesForDate = (date: string) => {
    return notes.filter(note => note.date === date);
  };

  const getNotesCountForDate = (date: string) => {
    return notes.filter(note => note.date === date).length;
  };

  useEffect(() => {
    fetchNotes();
  }, [vetId, weekStart, weekEnd]);

  return {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
    getNotesForDate,
    getNotesCountForDate,
    refetchNotes: fetchNotes
  };
};

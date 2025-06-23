
import React, { useState, useEffect } from 'react';
import { Card } from '@/ui/molecules/card';
import { FileText, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/frontend/shared/utils/date';

interface ClinicalNote {
  id: string;
  title: string;
  description: string;
  date: string;
  veterinarian_name: string;
}

interface ClinicalNotesSectionProps {
  petId: string;
  onCountChange: (count: number) => void;
}

const ClinicalNotesSection: React.FC<ClinicalNotesSectionProps> = ({
  petId,
  onCountChange
}) => {
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClinicalNotes();
  }, [petId]);

  useEffect(() => {
    onCountChange(notes.length);
  }, [notes.length, onCountChange]);

  const fetchClinicalNotes = async () => {
    setIsLoading(true);
    try {
      // Fetch clinical notes
      const { data: notesData, error: notesError } = await supabase
        .from('vet_medical_records')
        .select('*')
        .eq('pet_id', petId)
        .order('date', { ascending: false });

      if (notesError) throw notesError;

      // Get veterinarian names
      const vetIds = [...new Set(notesData?.map(n => n.veterinarian_id).filter(Boolean))];
      let vetProfiles: any[] = [];
      
      if (vetIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, display_name')
          .in('id', vetIds);

        if (!profilesError && profiles) {
          vetProfiles = profiles;
        }
      }

      // Transform data
      const transformedNotes: ClinicalNote[] = (notesData || []).map(note => {
        const vetProfile = vetProfiles.find(p => p.id === note.veterinarian_id);
        
        return {
          id: note.id,
          title: note.title,
          description: note.description,
          date: note.date,
          veterinarian_name: vetProfile?.display_name || 'Veterinario'
        };
      });

      setNotes(transformedNotes);
    } catch (error) {
      console.error('Error fetching clinical notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#79D0B8]" />
          Notas Clínicas
        </h3>
      </div>

      {notes.length === 0 ? (
        <Card className="p-6 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay notas clínicas registradas</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id} className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(note.date)}</span>
                  <span className="text-gray-400">•</span>
                  <span className="font-medium text-gray-800">{note.title}</span>
                  <span className="text-gray-400">•</span>
                  <span>Dr. {note.veterinarian_name}</span>
                </div>
                
                <p className="text-gray-700 mt-2">
                  {note.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClinicalNotesSection;

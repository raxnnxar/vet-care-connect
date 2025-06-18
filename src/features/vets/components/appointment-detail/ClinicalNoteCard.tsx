
import React, { useState, useEffect } from 'react';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { Stethoscope, Edit, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ClinicalNoteCardProps {
  appointmentId: string;
  petId: string;
  veterinarianId: string;
  appointmentDate: string;
}

interface ClinicalNote {
  id: string;
  title: string;
  description: string;
  date: string;
  created_at: string;
}

const ClinicalNoteCard: React.FC<ClinicalNoteCardProps> = ({
  appointmentId,
  petId,
  veterinarianId,
  appointmentDate
}) => {
  const [existingNote, setExistingNote] = useState<ClinicalNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchExistingNote();
  }, [appointmentId]);

  const fetchExistingNote = async () => {
    try {
      const { data, error } = await supabase
        .from('vet_medical_records')
        .select('*')
        .eq('appointment_id', appointmentId)
        .eq('veterinarian_id', veterinarianId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching clinical note:', error);
        return;
      }

      if (data) {
        setExistingNote(data);
        setFormData({
          title: data.title,
          description: data.description
        });
      }
    } catch (error) {
      console.error('Error fetching clinical note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setIsSaving(true);
    try {
      // Extract date from appointment_date
      let noteDate = new Date().toISOString().split('T')[0]; // fallback to today
      
      if (appointmentDate) {
        try {
          if (typeof appointmentDate === 'string') {
            noteDate = new Date(appointmentDate).toISOString().split('T')[0];
          } else if (typeof appointmentDate === 'object' && appointmentDate !== null) {
            const dateObj = appointmentDate as any;
            if (dateObj.date) {
              noteDate = dateObj.date;
            }
          }
        } catch (error) {
          console.error('Error parsing appointment date:', error);
        }
      }

      if (existingNote) {
        // Update existing note
        const { error } = await supabase
          .from('vet_medical_records')
          .update({
            title: formData.title.trim(),
            description: formData.description.trim()
          })
          .eq('id', existingNote.id);

        if (error) throw error;
        
        toast.success('Nota clínica actualizada');
        setExistingNote({
          ...existingNote,
          title: formData.title.trim(),
          description: formData.description.trim()
        });
      } else {
        // Create new note
        const { data, error } = await supabase
          .from('vet_medical_records')
          .insert({
            pet_id: petId,
            appointment_id: appointmentId,
            veterinarian_id: veterinarianId,
            title: formData.title.trim(),
            description: formData.description.trim(),
            date: noteDate
          })
          .select()
          .single();

        if (error) throw error;
        
        toast.success('Nota clínica guardada');
        setExistingNote(data);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving clinical note:', error);
      toast.error('Error al guardar la nota clínica');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    if (existingNote) {
      setFormData({
        title: existingNote.title,
        description: existingNote.description
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (existingNote) {
      setFormData({
        title: existingNote.title,
        description: existingNote.description
      });
    } else {
      setFormData({
        title: '',
        description: ''
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-20 bg-gray-200 rounded w-full"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h2 className="text-xl font-medium text-[#1F2937] mb-4 flex items-center">
        <Stethoscope className="mr-2 text-[#79D0B8]" size={20} />
        🩺 Nota clínica de esta cita
      </h2>

      {existingNote && !isEditing ? (
        // Display existing note in read-only mode
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <div className="p-3 bg-gray-50 rounded-md border">
              {existingNote.title}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <div className="p-3 bg-gray-50 rounded-md border min-h-[100px] whitespace-pre-wrap">
              {existingNote.description}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <div className="p-3 bg-gray-50 rounded-md border">
              {format(new Date(existingNote.date), 'dd/MM/yyyy')}
            </div>
          </div>
          
          <Button
            onClick={handleEdit}
            className="bg-[#79D0B8] hover:bg-[#5FBFB3] text-white"
          >
            <Edit className="mr-2" size={16} />
            Editar
          </Button>
        </div>
      ) : (
        // Show form for creating or editing
        <div className="space-y-4">
          <div>
            <label htmlFor="note-title" className="block text-sm font-medium text-gray-700 mb-1">
              Título de la nota *
            </label>
            <Input
              id="note-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Consulta general, Vacunación, etc."
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="note-description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción o detalle clínico *
            </label>
            <Textarea
              id="note-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe los hallazgos, diagnóstico, tratamiento recomendado, observaciones, etc."
              rows={6}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={isSaving || !formData.title.trim() || !formData.description.trim()}
              className="bg-[#79D0B8] hover:bg-[#5FBFB3] text-white"
            >
              <Save className="mr-2" size={16} />
              {isSaving ? 'Guardando...' : 'Guardar nota clínica'}
            </Button>
            
            {existingNote && (
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <X className="mr-2" size={16} />
                Cancelar
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ClinicalNoteCard;

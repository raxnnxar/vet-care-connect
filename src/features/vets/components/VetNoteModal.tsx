
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/molecules/dialog';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { Label } from '@/ui/atoms/label';

interface VetNote {
  id: string;
  title: string | null;
  content: string;
  date: string;
}

interface VetNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string) => Promise<void>;
  note?: VetNote | null;
  selectedDate: string;
}

const VetNoteModal: React.FC<VetNoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  note,
  selectedDate
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note, isOpen]);

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      console.log('Saving note:', { title: title.trim(), content: content.trim() });
      await onSave(title.trim(), content.trim());
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="fixed inset-0 z-50 bg-white p-0 m-0 w-full h-full max-w-none max-h-none rounded-none overflow-y-auto">
        <DialogHeader className="p-6 pb-4 bg-[#79D0B8] text-white">
          <DialogTitle className="text-white text-xl">
            {note ? 'Editar nota' : 'Nueva nota'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6 flex-1">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">Título (opcional)</Label>
            <Input
              id="title"
              placeholder="Título opcional"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content" className="text-base font-medium">Contenido</Label>
            <Textarea
              id="content"
              placeholder="Escribe tu nota..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="resize-none text-base"
            />
          </div>
        </div>
        
        <div className="p-6 pt-0 bg-white border-t">
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSaving}
              className="px-6"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!content.trim() || isSaving}
              className="bg-[#79D0B8] hover:bg-[#5FBFB3] px-6"
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VetNoteModal;

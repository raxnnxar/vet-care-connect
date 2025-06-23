
import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/ui/molecules/drawer';
import { Button } from '@/ui/atoms/button';
import { Badge } from '@/ui/atoms/badge';
import { Card } from '@/ui/molecules/card';
import { X, Plus, Edit, Trash2 } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useVetNotes } from '../hooks/useVetNotes';
import VetNoteModal from './VetNoteModal';

interface VetNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vetId: string | undefined;
  currentWeekStart: Date;
}

const VetNotesDrawer: React.FC<VetNotesDrawerProps> = ({
  isOpen,
  onClose,
  vetId,
  currentWeekStart
}) => {
  const [selectedDate, setSelectedDate] = useState(format(currentWeekStart, 'yyyy-MM-dd'));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);

  const {
    createNote,
    updateNote,
    deleteNote,
    getNotesForDate,
    getNotesCountForDate
  } = useVetNotes(vetId, currentWeekStart);

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const handleCreateNote = async (title: string, content: string) => {
    await createNote(selectedDate, title, content);
  };

  const handleUpdateNote = async (title: string, content: string) => {
    if (editingNote) {
      await updateNote(editingNote.id, title, content);
    }
  };

  const handleEditNote = (note: any) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      await deleteNote(noteId);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingNote(null);
  };

  const dayNotesForSelected = getNotesForDate(selectedDate);

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="h-[100vh] w-[70%] sm:w-[50%] ml-auto">
          <DrawerHeader className="bg-[#79D0B8] text-white">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-white">
                Notas • {format(currentWeekStart, 'd', { locale: es })} → {format(addDays(currentWeekStart, 6), 'd MMM yyyy', { locale: es })}
              </DrawerTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X size={20} />
              </Button>
            </div>
          </DrawerHeader>

          <div className="flex-1 p-4 overflow-y-auto">
            {/* Days selector */}
            <div className="space-y-2 mb-6">
              <h3 className="text-sm font-medium text-gray-600 mb-3">Seleccionar día</h3>
              {weekDays.map((day, index) => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const notesCount = getNotesCountForDate(dayStr);
                const isSelected = dayStr === selectedDate;

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(dayStr)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      isSelected 
                        ? 'bg-[#79D0B8]/10 border border-[#79D0B8] text-[#4DA6A8] font-semibold' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <span>
                      {format(day, 'EEE d', { locale: es }).charAt(0).toUpperCase() + format(day, 'EEE d', { locale: es }).slice(1)}
                    </span>
                    {notesCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {notesCount} nota{notesCount !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Notes for selected day */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-600">
                  Notas de {format(new Date(selectedDate), 'EEEE d', { locale: es })}
                </h3>
                <Button
                  size="sm"
                  onClick={() => setModalOpen(true)}
                  className="bg-[#4DA6A8] hover:bg-[#3A9B9D] text-white rounded-full p-2 h-8 w-8"
                >
                  <Plus size={16} />
                </Button>
              </div>

              {dayNotesForSelected.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No hay notas para este día</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setModalOpen(true)}
                    className="mt-2 text-[#4DA6A8] hover:text-[#3A9B9D]"
                  >
                    Crear primera nota
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {dayNotesForSelected.map((note) => (
                    <Card key={note.id} className="p-4 bg-[#F5F7FA] border-0 shadow-sm">
                      <div className="space-y-2">
                        {note.title && (
                          <h4 className="font-semibold text-gray-800 text-sm">
                            {note.title}
                          </h4>
                        )}
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {note.content}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-gray-400">
                            {format(new Date(note.updated_at), 'HH:mm')}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditNote(note)}
                              className="h-6 w-6 p-0 text-gray-500 hover:text-[#4DA6A8]"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNote(note.id)}
                              className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <VetNoteModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={editingNote ? handleUpdateNote : handleCreateNote}
        note={editingNote}
        selectedDate={selectedDate}
      />
    </>
  );
};

export default VetNotesDrawer;

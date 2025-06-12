
import React, { useState } from 'react';
import { FilePlus, FileText, Trash2, Edit3, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/ui/atoms/button';
import { Label } from '@/ui/atoms/label';
import { Textarea } from '@/ui/atoms/textarea';
import { VaccineDocument } from '../../api/vaccineDocumentsApi';
import { useVaccineDocuments } from '../../hooks/useVaccineDocuments';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

interface VaccineDocumentsListProps {
  petId: string;
  petOwnerId: string;
}

const VaccineDocumentsList: React.FC<VaccineDocumentsListProps> = ({ petId, petOwnerId }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [notes, setNotes] = useState('');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [editNotesValue, setEditNotesValue] = useState('');
  
  const {
    documents,
    isLoading,
    isUploading,
    uploadDocument,
    deleteDocument,
    updateDocumentNotes
  } = useVaccineDocuments(petId);
  
  // Check if current user is the pet owner
  const isOwner = user?.id === petOwnerId;
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    
    if (file.size > maxSizeInBytes) {
      return;
    }
    
    await uploadDocument(file, notes);
    setNotes('');
    // Reset the input
    event.target.value = '';
  };
  
  const handleDeleteDocument = async (documentId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      await deleteDocument(documentId);
    }
  };
  
  const handleEditNotes = (document: VaccineDocument) => {
    setEditingNotes(document.id);
    setEditNotesValue(document.notes || '');
  };
  
  const handleSaveNotes = async (documentId: string) => {
    const success = await updateDocumentNotes(documentId, editNotesValue);
    if (success) {
      setEditingNotes(null);
      setEditNotesValue('');
    }
  };
  
  const handleCancelEdit = () => {
    setEditingNotes(null);
    setEditNotesValue('');
  };
  
  const getFileIcon = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <img src={url} alt="Documento" className="w-12 h-12 object-cover rounded" />;
    }
    return <FileText className="h-12 w-12 text-gray-400" />;
  };
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label className="font-medium text-base">Documentos de vacunación</Label>
        <div className="text-center py-4">
          <div className="text-sm text-gray-500">Cargando documentos...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Label className="font-medium text-base">Documentos de vacunación</Label>
      
      {/* Upload section - only for owners */}
      {isOwner && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="vaccineNotes" className="text-sm">
              Notas (opcional)
            </Label>
            <Textarea
              id="vaccineNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Añade notas sobre este documento..."
              className="min-h-[60px]"
            />
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-primary transition-colors">
            <input
              id="vaccineDocument"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <Label 
              htmlFor="vaccineDocument" 
              className="cursor-pointer flex flex-col items-center gap-2 text-gray-500"
            >
              <FilePlus className="h-8 w-8 text-gray-400" />
              <span className="text-base">
                {isUploading ? 'Subiendo...' : 'Subir documento de vacunas (PDF/Imagen)'}
              </span>
              <span className="text-xs text-gray-400">Máximo 5MB</span>
            </Label>
          </div>
        </div>
      )}
      
      {/* Documents list */}
      {documents.length === 0 ? (
        <div className="text-center py-4">
          <div className="text-sm text-gray-500">
            {isOwner ? 'No hay documentos subidos aún' : 'No hay documentos disponibles'}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((document) => (
            <div key={document.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start gap-3">
                {/* File icon/thumbnail */}
                <div className="flex-shrink-0">
                  {getFileIcon(document.document_url)}
                </div>
                
                {/* Document info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-900">
                      Documento de vacunación
                    </div>
                    <div className="flex items-center gap-1">
                      {/* View button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(document.document_url, '_blank')}
                        className="p-1 h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {/* Edit/Delete buttons - only for owners */}
                      {isOwner && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditNotes(document)}
                            className="p-1 h-8 w-8"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteDocument(document.id)}
                            className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    Subido el {format(new Date(document.uploaded_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </div>
                  
                  {/* Notes section */}
                  {editingNotes === document.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editNotesValue}
                        onChange={(e) => setEditNotesValue(e.target.value)}
                        placeholder="Añade notas sobre este documento..."
                        className="min-h-[60px]"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveNotes(document.id)}
                          className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
                        >
                          Guardar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    document.notes && (
                      <div className="text-sm text-gray-700 bg-white p-2 rounded border">
                        {document.notes}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VaccineDocumentsList;

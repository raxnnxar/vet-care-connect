
import React, { useState } from 'react';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { Textarea } from '@/ui/atoms/textarea';
import { Loader2, FileMedical, Save, X } from 'lucide-react';
import { PetMedicalHistory } from '../../types';
import { toast } from 'sonner';
import { usePetFileUploads } from '@/features/pets/hooks/usePetFileUploads';
import VaccineUploadSection from './VaccineUploadSection';

interface PetMedicalInfoFormProps {
  petId: string;
  onSave: (medicalInfo: PetMedicalHistory) => Promise<void>;
  onCancel: () => void;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

interface Surgery {
  id: string;
  type: string;
  date: string;
}

const PetMedicalInfoForm: React.FC<PetMedicalInfoFormProps> = ({
  petId,
  onSave,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [allergies, setAllergies] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [uploadedDocumentUrl, setUploadedDocumentUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { uploadVaccineDoc } = usePetFileUploads();

  const handleFileUpload = async (files: FileList | null) => {
    setUploadError(null);
    if (!files || files.length === 0) {
      setUploadError("No se ha seleccionado ningún archivo");
      return;
    }

    setUploadingDocument(true);
    try {
      const documentUrl = await uploadVaccineDoc(petId, files[0]);
      if (documentUrl) {
        setUploadedDocumentUrl(documentUrl);
        toast.success("Documento subido exitosamente");
      } else {
        setUploadError("Error al subir el documento");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      setUploadError("Error al subir el documento");
    } finally {
      setUploadingDocument(false);
    }
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      { id: crypto.randomUUID(), name: '', dosage: '', frequency: '' }
    ]);
  };

  const addSurgery = () => {
    setSurgeries([
      ...surgeries,
      { id: crypto.randomUUID(), type: '', date: '' }
    ]);
  };

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const updateSurgery = (id: string, field: keyof Surgery, value: string) => {
    setSurgeries(surgeries.map(surgery => 
      surgery.id === id ? { ...surgery, [field]: value } : surgery
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const medicalInfo: PetMedicalHistory = {
        allergies: allergies || null,
        chronic_conditions: chronicConditions || null,
        vaccines_document_url: uploadedDocumentUrl,
        current_medications: medications.length > 0 ? medications : null,
        previous_surgeries: surgeries.length > 0 ? surgeries : null
      };

      await onSave(medicalInfo);
      toast.success('Información médica guardada exitosamente');
    } catch (error) {
      console.error('Error saving medical information:', error);
      toast.error('Error al guardar la información médica');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <VaccineUploadSection 
          onFileUpload={handleFileUpload}
          uploadingDocument={uploadingDocument}
          uploadedDocumentUrl={uploadedDocumentUrl}
          uploadError={uploadError}
        />

        <div className="space-y-4">
          <div>
            <Label htmlFor="allergies">Alergias</Label>
            <Textarea
              id="allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="Ingrese las alergias conocidas"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="chronicConditions">Condiciones crónicas</Label>
            <Textarea
              id="chronicConditions"
              value={chronicConditions}
              onChange={(e) => setChronicConditions(e.target.value)}
              placeholder="Ingrese las condiciones crónicas conocidas"
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <Label>Medicamentos actuales</Label>
            {medications.map((med, index) => (
              <div key={med.id} className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Nombre"
                  value={med.name}
                  onChange={(e) => updateMedication(med.id, 'name', e.target.value)}
                />
                <Input
                  placeholder="Dosis"
                  value={med.dosage}
                  onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)}
                />
                <Input
                  placeholder="Frecuencia"
                  value={med.frequency}
                  onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)}
                />
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              onClick={addMedication}
              className="w-full"
            >
              + Agregar medicamento
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Cirugías previas</Label>
            {surgeries.map((surgery, index) => (
              <div key={surgery.id} className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Tipo de cirugía"
                  value={surgery.type}
                  onChange={(e) => updateSurgery(surgery.id, 'type', e.target.value)}
                />
                <Input
                  type="date"
                  value={surgery.date}
                  onChange={(e) => updateSurgery(surgery.id, 'date', e.target.value)}
                />
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              onClick={addSurgery}
              className="w-full"
            >
              + Agregar cirugía
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          <X className="mr-2" />
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-[#79D0B8] hover:bg-[#5FBFB3]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2" />
              Guardar
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default PetMedicalInfoForm;

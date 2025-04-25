
import React, { useState } from 'react';
import { PetMedicalHistory } from '../../types';
import { Button } from '@/ui/atoms/button';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { Stethoscope, Upload, AlertTriangle, Check } from 'lucide-react';
import { toast } from 'sonner';

interface PetMedicalInfoFormProps {
  petId: string;
  onSave: (medicalInfo: PetMedicalHistory) => Promise<void>;
  onCancel: () => void;
}

const PetMedicalInfoForm: React.FC<PetMedicalInfoFormProps> = ({ petId, onSave, onCancel }) => {
  const [allergies, setAllergies] = useState<string>('');
  const [chronicConditions, setChronicConditions] = useState<string>('');
  const [medications, setMedications] = useState<string>('');
  const [surgeries, setSurgeries] = useState<string>('');
  const [vaccineFile, setVaccineFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [vaccineDocUrl, setVaccineDocUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setVaccineFile(files[0]);
    }
  };

  const parseJsonArray = (text: string) => {
    if (!text.trim()) return [];
    try {
      // Split by newlines and filter out empty lines
      return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(item => ({ description: item }));
    } catch (error) {
      console.error('Error parsing text to JSON:', error);
      return [];
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare medical history data
      const medicalInfo: PetMedicalHistory = {
        allergies: allergies || null,
        chronic_conditions: chronicConditions || null,
        current_medications: medications ? parseJsonArray(medications) : [],
        previous_surgeries: surgeries ? parseJsonArray(surgeries) : [],
        vaccines_document_url: vaccineDocUrl
      };

      await onSave(medicalInfo);
    } catch (error) {
      console.error('Error saving medical info:', error);
      toast.error('Error al guardar la información médica');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vaccineDoc">Documento de vacunas</Label>
        <div className="flex flex-col space-y-2">
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-primary transition-colors">
            <input
              id="vaccineDoc"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
            <Label 
              htmlFor="vaccineDoc" 
              className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground"
            >
              <Upload className="h-8 w-8" />
              <span>
                {uploading ? 'Subiendo...' : 'Subir documento de vacunas (PDF/Imagen)'}
              </span>
              <span className="text-xs text-muted-foreground">Máximo 5MB</span>
            </Label>
          </div>
          
          {vaccineDocUrl && (
            <div className="bg-green-50 text-green-700 p-2 rounded-md flex items-center gap-2">
              <Check className="h-4 w-4" />
              <a 
                href={vaccineDocUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm underline hover:text-green-800"
              >
                Documento subido exitosamente - Ver documento
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergies">Alergias</Label>
        <Textarea
          id="allergies"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="Ingrese cualquier alergia conocida"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="chronicConditions">Condiciones crónicas</Label>
        <Textarea
          id="chronicConditions"
          value={chronicConditions}
          onChange={(e) => setChronicConditions(e.target.value)}
          placeholder="Ingrese cualquier condición crónica"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="medications">Medicamentos actuales</Label>
        <Textarea
          id="medications"
          value={medications}
          onChange={(e) => setMedications(e.target.value)}
          placeholder="Ingrese un medicamento por línea"
          className="min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground">
          Ingrese cada medicamento en una línea separada
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="surgeries">Cirugías previas</Label>
        <Textarea
          id="surgeries"
          value={surgeries}
          onChange={(e) => setSurgeries(e.target.value)}
          placeholder="Ingrese una cirugía por línea"
          className="min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground">
          Ingrese cada cirugía en una línea separada
        </p>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center"
        >
          <Stethoscope className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Guardando...' : 'Guardar información médica'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default PetMedicalInfoForm;

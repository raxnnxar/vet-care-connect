import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Dog, Cat, Turtle, Bird, Rabbit, Info, Calendar, Plus, Minus, FilePlus, Pill, ChevronRight, ChevronDown, Syringe, Upload, AlertTriangle } from 'lucide-react';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { Textarea } from '@/ui/atoms/textarea';
import { Button } from '@/ui/atoms/button';
import { ScrollArea } from '@/ui/molecules/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/molecules/select';
import { toast } from 'sonner';
import { PET_CATEGORIES, PET_GENDER } from '@/core/constants/app.constants';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/ui/molecules/accordion';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/ui/molecules/collapsible';
import { v4 as uuidv4 } from 'uuid';
import { PetFormProps } from '@/features/pets/types/PetFormProps';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/atoms/avatar';
import { usePets } from '@/features/pets/hooks/usePets';
import { supabase } from '@/integrations/supabase/client';

const speciesMapping = {
  'Perro': PET_CATEGORIES.DOG,
  'Gato': PET_CATEGORIES.CAT,
  'Tortuga': PET_CATEGORIES.REPTILE,
  'Ave': PET_CATEGORIES.BIRD,
  'Conejo': PET_CATEGORIES.SMALL_MAMMAL,
  'Hámster': PET_CATEGORIES.SMALL_MAMMAL,
  'Otro': PET_CATEGORIES.OTHER,
};

const genderMapping = {
  'Macho': PET_GENDER.MALE,
  'Hembra': PET_GENDER.FEMALE,
};

const speciesMappingReverse = {
  [PET_CATEGORIES.DOG]: 'Perro',
  [PET_CATEGORIES.CAT]: 'Gato',
  [PET_CATEGORIES.REPTILE]: 'Tortuga',
  [PET_CATEGORIES.BIRD]: 'Ave',
  [PET_CATEGORIES.SMALL_MAMMAL]: 'Conejo/Hámster',
  [PET_CATEGORIES.OTHER]: 'Otro',
};

const genderMappingReverse = {
  [PET_GENDER.MALE]: 'Macho',
  [PET_GENDER.FEMALE]: 'Hembra',
};

interface SpeciesIconProps {
  species: string;
}

const SpeciesIcon: React.FC<SpeciesIconProps> = ({ species }) => {
  switch(species) {
    case 'Perro':
      return <Dog className="h-4 w-4" />;
    case 'Gato':
      return <Cat className="h-4 w-4" />;
    case 'Tortuga':
      return <Turtle className="h-4 w-4" />;
    case 'Ave':
      return <Bird className="h-4 w-4" />;
    case 'Conejo':
    case 'Hámster':
      return <Rabbit className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

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

interface PetFormValues {
  name: string;
  species: string;
  customSpecies?: string;
  age?: number;
  weight?: number;
  sex: string;
  temperament: string;
  additionalNotes: string;
  // Medical history fields
  allergies?: string;
  chronicConditions?: string;
  vaccineDocument?: FileList;
  medications: Medication[];
  surgeries: Surgery[];
}

const PetForm: React.FC<PetFormProps> = ({ mode, pet, onSubmit, isSubmitting, onCancel }) => {
  const [isMedicalHistoryOpen, setIsMedicalHistoryOpen] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [uploadedDocumentUrl, setUploadedDocumentUrl] = useState<string | null>(null);
  const [petPhotoPreview, setPetPhotoPreview] = useState<string | null>(null);
  const [petPhotoFile, setPetPhotoFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const vaccineDocInputRef = useRef<HTMLInputElement>(null);
  const { uploadVaccineDoc } = usePets();

  const calculateInitialValues = () => {
    if (!pet) {
      return {
        name: '',
        species: '',
        customSpecies: '',
        age: undefined,
        weight: undefined,
        sex: '',
        temperament: '',
        additionalNotes: '',
        allergies: '',
        chronicConditions: '',
        medications: [{ id: uuidv4(), name: '', dosage: '', frequency: '' }],
        surgeries: [{ id: uuidv4(), type: '', date: '' }],
      };
    }

    let species = '';
    let customSpecies = '';
    
    if (pet.species) {
      for (const [uiSpecies, dbSpecies] of Object.entries(speciesMapping)) {
        if (dbSpecies === pet.species) {
          species = uiSpecies;
          break;
        }
      }
      
      if (!species) {
        species = 'Otro';
        customSpecies = pet.breed || '';
      }
    }

    let sex = '';
    if (pet.sex) {
      for (const [uiSex, dbSex] of Object.entries(genderMapping)) {
        if (dbSex === pet.sex) {
          sex = uiSex;
          break;
        }
      }
    }

    let age = undefined;
    if (pet.date_of_birth) {
      const birthDate = new Date(pet.date_of_birth);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
    }

    return {
      name: pet.name || '',
      species: species,
      customSpecies: customSpecies,
      age: age,
      weight: pet.weight ? Number(pet.weight) : undefined,
      sex: sex,
      temperament: pet.temperament || '',
      additionalNotes: pet.additional_notes || '',
      allergies: '',
      chronicConditions: '',
      medications: [{ id: uuidv4(), name: '', dosage: '', frequency: '' }],
      surgeries: [{ id: uuidv4(), type: '', date: '' }],
    };
  };

  const initialValues = calculateInitialValues();
  
  const { register, handleSubmit, control, watch, formState: { errors }, setValue } = useForm<PetFormValues>({
    defaultValues: initialValues
  });

  useEffect(() => {
    if (pet?.profile_picture_url) {
      setPetPhotoPreview(pet.profile_picture_url);
    }
    
    if (pet?.id) {
      const fetchMedicalHistory = async () => {
        try {
          const { data, error } = await supabase
            .from('pet_medical_history')
            .select('vaccines_document_url')
            .eq('pet_id', pet.id)
            .single();
            
          if (data && data.vaccines_document_url) {
            setUploadedDocumentUrl(data.vaccines_document_url);
          }
        } catch (error) {
          console.error('Error fetching medical history:', error);
        }
      };
      
      fetchMedicalHistory();
    }
  }, [pet]);
  
  const { fields: medicationFields, append: appendMedication, remove: removeMedication } = 
    useFieldArray({ control, name: "medications" });
    
  const { fields: surgeryFields, append: appendSurgery, remove: removeSurgery } = 
    useFieldArray({ control, name: "surgeries" });
    
  const selectedSpecies = watch('species');
  
  const handleFileUpload = async (files: FileList | null) => {
    setUploadError(null);
    
    if (!files || files.length === 0) {
      setUploadError("No se ha seleccionado ningún archivo");
      toast.error("No se ha seleccionado ningún archivo");
      return;
    }
    
    if (!pet?.id) {
      setUploadError("No hay mascota asociada. Por favor, guarde la mascota primero.");
      toast.error("No hay mascota asociada. Por favor, guarde la mascota primero.");
      return;
    }
    
    const file = files[0];
    
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      setUploadError("El archivo es demasiado grande. El tamaño máximo es 5MB.");
      toast.error("El archivo es demasiado grande. El tamaño máximo es 5MB.");
      return;
    }
    
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Tipo de archivo no permitido. Use PDF o imágenes (JPG, PNG).");
      toast.error("Tipo de archivo no permitido. Use PDF o imágenes (JPG, PNG).");
      return;
    }
    
    setUploadingDocument(true);
    
    try {
      console.log('Uploading vaccine document for pet ID:', pet.id);
      
      const petId = pet.id;
      
      const documentUrl = await uploadVaccineDoc(petId, file);
      
      if (documentUrl) {
        setUploadedDocumentUrl(documentUrl);
        toast.success("Documento subido exitosamente");
      } else {
        setUploadError("Error al subir el documento al servidor");
        toast.error("Error al subir el documento");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      setUploadError("Error al subir el documento. Intenta nuevamente.");
      toast.error("Error al subir el documento. Intenta nuevamente.");
    } finally {
      setUploadingDocument(false);
    }
  };
  
  const handlePetPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPetPhotoPreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    setPetPhotoFile(file);
  };
  
  const processFormData = async (data: PetFormValues) => {
    const transformedData: any = {
      name: data.name,
      species: data.species === 'Otro' ? PET_CATEGORIES.OTHER : speciesMapping[data.species],
      breed: data.species === 'Otro' ? data.customSpecies : '',
      additional_notes: data.additionalNotes || '',
      weight: data.weight || null,
      sex: data.sex ? genderMapping[data.sex] : null,
      temperament: data.temperament || '',
    };
    
    if (mode === 'edit' && pet) {
      transformedData.id = pet.id;
    }
    
    if (petPhotoFile) {
      transformedData.petPhotoFile = petPhotoFile;
    }
    
    if (data.age) {
      const today = new Date();
      const birthYear = today.getFullYear() - data.age;
      const approximateBirthDate = new Date(birthYear, 0, 1);
      transformedData.date_of_birth = approximateBirthDate.toISOString().split('T')[0];
    }
    
    if (isMedicalHistoryOpen) {
      const medicalHistory = {
        allergies: data.allergies || null,
        chronic_conditions: data.chronicConditions || null,
        vaccines_document_url: uploadedDocumentUrl,
        current_medications: data.medications.filter(m => m.name.trim() !== '').map(med => ({
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency
        })),
        previous_surgeries: data.surgeries.filter(s => s.type.trim() !== '').map(surgery => ({
          type: surgery.type,
          date: surgery.date
        }))
      };
      
      transformedData.medicalHistory = medicalHistory;
    }
    
    try {
      console.log('Submitting pet data:', transformedData);
      const result = await onSubmit(transformedData);
      console.log('Pet submission result:', result);
      return result;
    } catch (error) {
      console.error('Error submitting pet data:', error);
      return null;
    }
  };
  
  return (
    <ScrollArea className="max-h-[70vh] pr-4 overflow-y-auto">
      <form onSubmit={handleSubmit(processFormData)} className="space-y-4 pb-4">
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="relative">
            <Avatar className="h-24 w-24 border-2 border-primary/30">
              {petPhotoPreview ? (
                <AvatarImage 
                  src={petPhotoPreview} 
                  alt="Foto de mascota" 
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-primary/10">
                  <Upload className="h-6 w-6 text-primary/50" />
                </AvatarFallback>
              )}
            </Avatar>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 shadow-md hover:bg-primary/90 transition-colors"
            >
              <Upload className="h-3 w-3" />
            </button>
            
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePetPhotoSelect}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {petPhotoPreview ? "Foto seleccionada" : "Añadir una foto de tu mascota"}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="font-medium text-base">
            Nombre *
          </Label>
          <Input
            id="name"
            {...register('name', { required: "El nombre es obligatorio" })}
            placeholder="Nombre de tu mascota"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="species" className="font-medium text-base">
            Animal *
          </Label>
          <Controller
            control={control}
            name="species"
            rules={{ required: "Debes seleccionar un tipo de animal" }}
            render={({ field }) => (
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <SelectTrigger className={errors.species ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecciona un animal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Perro">
                    <div className="flex items-center gap-2">
                      <Dog className="h-4 w-4" />
                      <span>Perro</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Gato">
                    <div className="flex items-center gap-2">
                      <Cat className="h-4 w-4" />
                      <span>Gato</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Tortuga">
                    <div className="flex items-center gap-2">
                      <Turtle className="h-4 w-4" />
                      <span>Tortuga</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Ave">
                    <div className="flex items-center gap-2">
                      <Bird className="h-4 w-4" />
                      <span>Ave</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Conejo">
                    <div className="flex items-center gap-2">
                      <Rabbit className="h-4 w-4" />
                      <span>Conejo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Hámster">
                    <div className="flex items-center gap-2">
                      <Rabbit className="h-4 w-4" />
                      <span>Hámster</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Otro">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      <span>Otro</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.species && (
            <p className="text-sm text-red-500 mt-1">{errors.species.message}</p>
          )}
        </div>
        
        {selectedSpecies === 'Otro' && (
          <div className="space-y-2">
            <Label htmlFor="customSpecies" className="font-medium text-base">
              Especifica el tipo de animal *
            </Label>
            <Input
              id="customSpecies"
              {...register('customSpecies', { 
                required: selectedSpecies === 'Otro' ? "Por favor especifica el tipo de animal" : false 
              })}
              placeholder="Tipo de animal"
              className={errors.customSpecies ? "border-red-500" : ""}
            />
            {errors.customSpecies && (
              <p className="text-sm text-red-500 mt-1">{errors.customSpecies.message}</p>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age" className="font-medium text-base">
              Edad (años)
            </Label>
            <Input
              id="age"
              type="number"
              {...register('age', { 
                valueAsNumber: true,
                min: { value: 0, message: "La edad no puede ser negativa" },
                max: { value: 100, message: "La edad parece ser demasiado alta" }
              })}
              placeholder="Edad en años"
              className={errors.age ? "border-red-500" : ""}
            />
            {errors.age && (
              <p className="text-sm text-red-500 mt-1">{errors.age.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight" className="font-medium text-base">
              Peso (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              {...register('weight', { 
                valueAsNumber: true,
                min: { value: 0, message: "El peso no puede ser negativo" },
                max: { value: 1000, message: "El peso parece ser demasiado alto" }
              })}
              placeholder="Peso en kg"
              className={errors.weight ? "border-red-500" : ""}
            />
            {errors.weight && (
              <p className="text-sm text-red-500 mt-1">{errors.weight.message}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sex" className="font-medium text-base">
            Sexo
          </Label>
          <Controller
            control={control}
            name="sex"
            render={({ field }) => (
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Macho">Macho</SelectItem>
                  <SelectItem value="Hembra">Hembra</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="temperament" className="font-medium text-base">
            Temperamento
          </Label>
          <Input
            id="temperament"
            {...register('temperament')}
            placeholder="Ej: Juguetón, Tranquilo, Cariñoso"
            className={errors.temperament ? "border-red-500" : ""}
          />
        </div>
        
        <div className="relative">
          <Collapsible
            open={isMedicalHistoryOpen}
            onOpenChange={setIsMedicalHistoryOpen}
            className="border rounded-md p-2 shadow-sm bg-gray-50"
          >
            <CollapsibleTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                className="flex w-full justify-between items-center p-2 hover:bg-gray-100"
              >
                <div className="flex items-center gap-2 text-primary">
                  <Syringe className="h-5 w-5" />
                  <span className="font-medium">Historial Médico</span>
                </div>
                {isMedicalHistoryOpen ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-2 space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="vaccineDocument" className="font-medium text-base">
                  Registro de vacunas
                </Label>
                <div className="flex flex-col gap-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-primary transition-colors">
                    <input
                      id="vaccineDocument"
                      ref={vaccineDocInputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                      disabled={uploadingDocument}
                    />
                    <Label 
                      htmlFor="vaccineDocument" 
                      className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground"
                    >
                      <Upload className="h-8 w-8" />
                      <span>{uploadingDocument ? 'Subiendo...' : 'Subir documento de vacunas (PDF/Imagen)'}</span>
                      <span className="text-xs text-muted-foreground">Máximo 5MB</span>
                    </Label>
                  </div>
                  
                  {uploadError && (
                    <div className="bg-red-50 text-red-700 p-2 rounded-md flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">{uploadError}</span>
                    </div>
                  )}
                  
                  {uploadedDocumentUrl && (
                    <div className="bg-green-50 text-green-700 p-2 rounded-md flex items-center gap-2">
                      <FilePlus className="h-4 w-4" />
                      <a 
                        href={uploadedDocumentUrl}
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
                <Label className="font-medium text-base">
                  Medicamentos actuales
                </Label>
                <div className="space-y-4">
                  {medicationFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <Input
                          {...register(`medications.${index}.name`)}
                          placeholder="Nombre del medicamento"
                          className="col-span-1"
                        />
                        <Input
                          {...register(`medications.${index}.dosage`)}
                          placeholder="Dosis (mg, ml, etc.)"
                          className="col-span-1"
                        />
                        <Input
                          {...register(`medications.${index}.frequency`)}
                          placeholder="Frecuencia"
                          className="col-span-1"
                        />
                      </div>
                      {index > 0 && (
                        <Button 
                          type="button" 
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => removeMedication(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => appendMedication({ 
                      id: uuidv4(), 
                      name: '', 
                      dosage: '', 
                      frequency: '' 
                    })}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Agregar medicamento</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="font-medium text-base">
                  Cirugías previas
                </Label>
                <div className="space-y-4">
                  {surgeryFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <Input
                          {...register(`surgeries.${index}.type`)}
                          placeholder="Tipo de cirugía"
                          className="col-span-1"
                        />
                        <Input
                          {...register(`surgeries.${index}.date`)}
                          placeholder="Fecha (MM/YYYY)"
                          className="col-span-1"
                        />
                      </div>
                      {index > 0 && (
                        <Button 
                          type="button" 
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => removeSurgery(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => appendSurgery({ 
                      id: uuidv4(), 
                      type: '', 
                      date: '' 
                    })}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Agregar cirugía</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allergies" className="font-medium text-base">
                  Alergias
                </Label>
                <Textarea
                  id="allergies"
                  {...register('allergies')}
                  placeholder="Alergias conocidas del animal"
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="chronicConditions" className="font-medium text-base">
                  Condiciones crónicas
                </Label>
                <Textarea
                  id="chronicConditions"
                  {...register('chronicConditions')}
                  placeholder="Condiciones médicas crónicas"
                  className="min-h-[80px]"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
          {isMedicalHistoryOpen && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="additionalNotes" className="font-medium text-base">
            Notas adicionales
          </Label>
          <Textarea
            id="additionalNotes"
            {...register('additionalNotes')}
            placeholder="Información adicional relevante sobre tu mascota"
            className="min-h-[100px]"
          />
        </div>
        
        <div className="sticky bottom-0 pt-4 bg-white bg-opacity-95 mt-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 px-6 text-base font-medium"
              disabled={isSubmitting || uploadingDocument}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar mascota'}
            </Button>
            {onCancel && (
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full text-center"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </form>
    </ScrollArea>
  );
};

export default PetForm;

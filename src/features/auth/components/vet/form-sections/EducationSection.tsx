
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { VeterinarianProfile } from '../../../types/veterinarianTypes';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/ui/molecules/alert-dialog';
import EmptyEducationState from './education/EmptyEducationState';
import EducationList from './education/EducationList';
import EducationForm from './education/EducationForm';
import { useEducationForm } from './education/useEducationForm';

interface EducationSectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
  setValue: any;
  userId: string;
}

const EducationSection: React.FC<EducationSectionProps> = ({
  control,
  errors,
  setValue,
  userId
}) => {
  const {
    fields,
    isDialogOpen,
    setIsDialogOpen,
    isUploading,
    newEducation,
    setNewEducation,
    newEducationFile,
    newEducationErrors,
    handleAddEducation,
    handleUploadDocument,
    handleUploadNewEducationDocument,
    remove
  } = useEducationForm(control, setValue, userId);

  return (
    <div className="space-y-6">
      {/* Check if fields exists and is an array */}
      {Array.isArray(fields) && fields.length === 0 ? (
        <EmptyEducationState onAddClick={() => setIsDialogOpen(true)} />
      ) : (
        <EducationList
          fields={fields || []}
          onAddClick={() => setIsDialogOpen(true)}
          onRemove={remove}
          onUpload={handleUploadDocument}
          isUploading={isUploading}
          control={control}
        />
      )}

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Añadir Formación Académica</AlertDialogTitle>
            <AlertDialogDescription>
              Añade detalles sobre tu formación académica para mostrar tus credenciales a los dueños de mascotas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <EducationForm
            newEducation={newEducation}
            setNewEducation={setNewEducation}
            newEducationFile={newEducationFile}
            newEducationErrors={newEducationErrors}
            onFileSelect={handleUploadNewEducationDocument}
            onSubmit={handleAddEducation}
          />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EducationSection;


import React from 'react';
import { PetBasicInfoProps } from '@/features/pets/types/formTypes';
import PetNameField from './form/fields/PetNameField';
import PetSpeciesField, { speciesMapping } from './form/fields/PetSpeciesField';
import CustomSpeciesField from './form/fields/CustomSpeciesField';
import PetMeasurementsFields from './form/fields/PetMeasurementsFields';
import PetSexField from './form/fields/PetSexField';
import PetTemperamentField from './form/fields/PetTemperamentField';

const PetBasicInfo: React.FC<PetBasicInfoProps> = ({
  control,
  register,
  errors,
  selectedSpecies
}) => {
  return (
    <>
      <PetNameField register={register} errors={errors} />
      <PetSpeciesField control={control} errors={errors} />
      <CustomSpeciesField 
        register={register} 
        errors={errors} 
        selectedSpecies={selectedSpecies} 
      />
      <PetMeasurementsFields register={register} errors={errors} />
      <PetSexField control={control} />
      <PetTemperamentField register={register} />
    </>
  );
};

export default PetBasicInfo;
export { speciesMapping };


import { PET_CATEGORIES, PET_GENDER } from '@/core/constants/app.constants';

export const mapSpeciesFromDB = (dbSpecies: string) => {
  const speciesMapping: Record<string, string> = {
    [PET_CATEGORIES.DOG]: 'Perro',
    [PET_CATEGORIES.CAT]: 'Gato',
    [PET_CATEGORIES.BIRD]: 'Ave',
    [PET_CATEGORIES.REPTILE]: 'Pez',
    [PET_CATEGORIES.SMALL_MAMMAL]: 'Conejo',
    [PET_CATEGORIES.OTHER]: 'Otro'
  };
  return speciesMapping[dbSpecies] || 'Otro';
};

export const mapSpeciesToDB = (uiSpecies: string) => {
  const speciesMapping: Record<string, string> = {
    'Perro': PET_CATEGORIES.DOG,
    'Gato': PET_CATEGORIES.CAT,
    'Ave': PET_CATEGORIES.BIRD,
    'Pez': PET_CATEGORIES.REPTILE,
    'Conejo': PET_CATEGORIES.SMALL_MAMMAL,
    'Hámster': PET_CATEGORIES.SMALL_MAMMAL,
    'Otro': PET_CATEGORIES.OTHER
  };
  return speciesMapping[uiSpecies] || PET_CATEGORIES.OTHER;
};

export const mapSexFromDB = (dbSex: string) => {
  const sexMapping: Record<string, string> = {
    [PET_GENDER.MALE]: 'Macho',
    [PET_GENDER.FEMALE]: 'Hembra'
  };
  return sexMapping[dbSex] || '';
};

export const mapSexToDB = (uiSex: string) => {
  const sexMapping: Record<string, string> = {
    'Macho': PET_GENDER.MALE,
    'Hembra': PET_GENDER.FEMALE
  };
  return sexMapping[uiSex] || null;
};

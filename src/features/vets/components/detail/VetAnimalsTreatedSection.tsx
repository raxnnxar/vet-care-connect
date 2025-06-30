
import React from 'react';
import { PawPrint, Dog, Cat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/molecules/card';
import { animalTranslationMap } from '@/utils/distanceUtils';

interface VetAnimalsTreatedSectionProps {
  animals: string[];
}

// Function to get the appropriate icon for each animal
const AnimalIcon = ({ animalType }: { animalType: string }) => {
  switch (animalType.toLowerCase()) {
    case 'dog':
      return <Dog className="w-6 h-6" />;
    case 'cat':
      return <Cat className="w-6 h-6" />;
    default:
      return <PawPrint className="w-6 h-6" />;
  }
};

const VetAnimalsTreatedSection: React.FC<VetAnimalsTreatedSectionProps> = ({ animals }) => {
  if (!animals || animals.length === 0) {
    return null;
  }
  
  // Translate animal types using the centralized map
  const translatedAnimals = animals.map(animal => 
    animalTranslationMap[animal.toLowerCase()] || animal
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <PawPrint className="mr-2 h-5 w-5 text-[#4DA6A8]" />
          Atiende a
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-2 mt-2">
          {animals.map((animal, index) => (
            <div 
              key={animal} 
              className="flex flex-col items-center p-2 rounded-md bg-[#e8f7f3]"
            >
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-1">
                <AnimalIcon animalType={animal} />
              </div>
              <span className="text-center text-sm font-medium">
                {animalTranslationMap[animal.toLowerCase()] || animal}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VetAnimalsTreatedSection;

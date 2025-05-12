
import React from 'react';

interface VetAboutSectionProps {
  bio: string | null;
}

const VetAboutSection: React.FC<VetAboutSectionProps> = ({ bio }) => {
  return (
    <div className="p-4">
      <h3 className="font-medium text-lg mb-3">Acerca de</h3>
      <p className="text-gray-600">
        {bio || "Este veterinario no ha proporcionado información adicional."}
      </p>
    </div>
  );
};

export default VetAboutSection;

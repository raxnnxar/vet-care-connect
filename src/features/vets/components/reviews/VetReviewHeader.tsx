
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/ui/atoms/button';

interface VetReviewHeaderProps {
  onBackClick: () => void;
}

const VetReviewHeader: React.FC<VetReviewHeaderProps> = ({ onBackClick }) => {
  return (
    <div className="flex items-center p-4 bg-[#79D0B8]">
      <Button 
        variant="ghost" 
        className="text-white p-1 mr-2" 
        onClick={onBackClick}
      >
        <ArrowLeft size={24} />
      </Button>
      <h1 className="text-xl font-medium text-white">Calificar Veterinario</h1>
    </div>
  );
};

export default VetReviewHeader;

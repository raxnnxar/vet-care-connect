
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { useNavigate } from 'react-router-dom';

interface GroomingDetailHeaderProps {
  title: string;
}

const GroomingDetailHeader: React.FC<GroomingDetailHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center p-4 bg-[#79D0B8]">
      <Button 
        variant="ghost" 
        className="text-white p-1 mr-2" 
        onClick={handleGoBack}
      >
        <ArrowLeft size={24} />
      </Button>
      <h1 className="text-xl font-medium text-white">{title}</h1>
    </div>
  );
};

export default GroomingDetailHeader;

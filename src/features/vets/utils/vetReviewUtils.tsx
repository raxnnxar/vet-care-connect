
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/molecules/dialog';
import { Button } from '@/ui/atoms/button';
import VetReviewsSection from '../components/detail/VetReviewsSection';

interface ReviewsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  veterinarianId: string;
  onReviewClick: () => void;
}

export const ReviewsDialog: React.FC<ReviewsDialogProps> = ({
  isOpen,
  setIsOpen,
  veterinarianId,
  onReviewClick
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[85vh] px-4 pb-6 pt-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">Reseñas</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <VetReviewsSection veterinarianId={veterinarianId} />
        </div>
        
        <div className="mt-6">
          <Button 
            onClick={() => {
              setIsOpen(false);
              onReviewClick();
            }} 
            className="w-full bg-[#79D0B8] hover:bg-[#68BBA3] text-white"
          >
            Escribir una reseña
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

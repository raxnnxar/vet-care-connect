
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/ui/atoms/button';

interface NewChatButtonProps {
  onClick: () => void;
}

export const NewChatButton: React.FC<NewChatButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-[#79D0B8] hover:bg-[#6bb3a7] shadow-lg z-10"
      size="icon"
    >
      <Plus size={24} className="text-white" />
    </Button>
  );
};

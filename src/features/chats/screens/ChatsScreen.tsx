
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { useConversations } from '../hooks/useConversations';
import { ChatsHeader } from '../components/ChatsHeader';
import { ConversationsList } from '../components/ConversationsList';
import { EmptyChatsState } from '../components/EmptyChatsState';
import { NewChatButton } from '../components/NewChatButton';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';

const ChatsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { data: conversations, isLoading, error, refetch } = useConversations();

  const handleConversationClick = (conversationId: string) => {
    // Por ahora solo mostramos un log, después se puede implementar la navegación al chat específico
    console.log('Clicked conversation:', conversationId);
    // navigate(`/chat/${conversationId}`);
  };

  const handleNewChat = () => {
    // Por ahora solo mostramos un log, después se puede implementar la lógica para nuevo chat
    console.log('New chat clicked');
  };

  const handleRetry = () => {
    refetch();
  };

  if (error) {
    return (
      <LayoutBase
        header={<ChatsHeader />}
        footer={<NavbarInferior activeTab="chats" />}
      >
        <div className="p-4">
          <Card className="p-6 text-center">
            <p className="text-gray-500 mb-4">Ocurrió un error al cargar las conversaciones</p>
            <Button 
              variant="default"
              onClick={handleRetry}
            >
              Reintentar
            </Button>
          </Card>
        </div>
      </LayoutBase>
    );
  }

  return (
    <LayoutBase
      header={<ChatsHeader />}
      footer={<NavbarInferior activeTab="chats" />}
    >
      <div className="p-4 pb-20">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : conversations && conversations.length > 0 ? (
          <ConversationsList
            conversations={conversations}
            onConversationClick={handleConversationClick}
          />
        ) : (
          <EmptyChatsState />
        )}
      </div>
      
      <NewChatButton onClick={handleNewChat} />
    </LayoutBase>
  );
};

export default ChatsScreen;

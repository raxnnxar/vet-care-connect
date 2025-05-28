
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card } from '@/ui/molecules/card';
import { ConversationWithUser } from '../hooks/useConversations';

interface ConversationsListProps {
  conversations: ConversationWithUser[];
  onConversationClick: (conversationId: string) => void;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  onConversationClick
}) => {
  const formatLastUpdated = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: es 
      });
    } catch (error) {
      return 'hace un momento';
    }
  };

  return (
    <div className="space-y-3">
      {conversations.map((conversation) => (
        <Card 
          key={conversation.id}
          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onConversationClick(conversation.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#79D0B8] rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {conversation.other_user?.display_name?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {conversation.other_user?.display_name || 'Usuario desconocido'}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.last_message || 'Sin mensajes aún'}
                  </p>
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
              {formatLastUpdated(conversation.last_updated)}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

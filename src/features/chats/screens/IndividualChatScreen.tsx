
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/ui/atoms/button';
import { LayoutBase } from '@/frontend/navigation/components';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  message: string;
  sender_id: string;
  receiver_id: string;
  timestamp: string;
}

interface OtherUser {
  id: string;
  display_name: string;
  profile_image_url?: string;
}

const IndividualChatScreen: React.FC = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConversationData = async () => {
      if (!conversationId || !user?.id) {
        console.error('Missing conversation ID or user ID');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching conversation data for:', conversationId);
        
        // Get conversation details and other user info
        const { data: conversation, error: convError } = await supabase
          .from('conversations')
          .select('user1_id, user2_id')
          .eq('id', conversationId)
          .single();

        if (convError) {
          console.error('Conversation error:', convError);
          throw convError;
        }

        console.log('Conversation data:', conversation);

        // Determine other user ID
        const otherUserId = conversation.user1_id === user.id 
          ? conversation.user2_id 
          : conversation.user1_id;

        console.log('Other user ID:', otherUserId);

        // Get other user's profile info
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, display_name')
          .eq('id', otherUserId)
          .single();

        if (profileError) {
          console.error('Profile error:', profileError);
          throw profileError;
        }

        console.log('Profile data:', profile);

        // Check if it's a veterinarian and get profile image
        const { data: vetData } = await supabase
          .from('veterinarians')
          .select('profile_image_url')
          .eq('id', otherUserId)
          .single();

        console.log('Vet data:', vetData);

        setOtherUser({
          id: profile.id,
          display_name: profile.display_name,
          profile_image_url: vetData?.profile_image_url
        });

        // Get messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('timestamp', { ascending: true });

        if (messagesError) {
          console.error('Messages error:', messagesError);
          throw messagesError;
        }

        console.log('Messages data:', messagesData);
        setMessages(messagesData || []);
      } catch (error) {
        console.error('Error fetching conversation data:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar la conversación",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConversationData();
  }, [conversationId, user?.id, toast]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !otherUser || sending) return;

    setSending(true);
    try {
      const { error } = await supabase.rpc('send_message', {
        conversation_uuid: conversationId,
        sender_uuid: user.id,
        receiver_uuid: otherUser.id,
        message_text: newMessage.trim()
      });

      if (error) throw error;

      // Add message to local state
      const newMsg: Message = {
        id: Date.now().toString(), // Temporary ID
        message: newMessage.trim(),
        sender_id: user.id,
        receiver_id: otherUser.id,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const Header = () => (
    <div className="flex items-center px-4 py-3 bg-[#79D0B8] text-white">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="text-white hover:bg-white/20 mr-3"
      >
        <ArrowLeft size={24} />
      </Button>
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
          {otherUser?.profile_image_url ? (
            <img 
              src={otherUser.profile_image_url} 
              alt={otherUser.display_name}
              className="w-full h-full object-cover" 
            />
          ) : (
            <span className="text-white font-medium text-sm">
              {otherUser ? getInitials(otherUser.display_name) : '?'}
            </span>
          )}
        </div>
        <div>
          <h1 className="font-medium text-lg">
            {otherUser?.display_name || 'Cargando...'}
          </h1>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <LayoutBase header={<Header />} footer={null}>
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#79D0B8] mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando conversación...</p>
          </div>
        </div>
      </LayoutBase>
    );
  }

  if (!otherUser) {
    return (
      <LayoutBase header={<Header />} footer={null}>
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No se pudo cargar la conversación</p>
            <Button 
              onClick={() => navigate(-1)}
              className="bg-[#79D0B8] hover:bg-[#4DA6A8]"
            >
              Volver
            </Button>
          </div>
        </div>
      </LayoutBase>
    );
  }

  return (
    <LayoutBase header={<Header />} footer={null}>
      <div className="flex flex-col h-[calc(100vh-60px)]">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-500 mb-2">No hay mensajes aún</p>
                <p className="text-gray-400 text-sm">Envía el primer mensaje para comenzar la conversación</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-2xl ${
                    message.sender_id === user.id
                      ? 'bg-[#79D0B8] text-white'
                      : 'bg-white text-gray-900 shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender_id === user.id ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje..."
              className="flex-1 min-h-[40px] max-h-[120px] p-3 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-[#79D0B8] focus:border-transparent"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              size="icon"
              className="bg-[#79D0B8] hover:bg-[#4DA6A8] text-white rounded-full h-10 w-10"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </LayoutBase>
  );
};

export default IndividualChatScreen;

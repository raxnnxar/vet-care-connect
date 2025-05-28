
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

export interface ConversationWithUser {
  id: string;
  user1_id: string;
  user2_id: string;
  last_message: string | null;
  last_updated: string;
  other_user: {
    id: string;
    display_name: string;
    email: string;
  } | null;
}

export const useConversations = () => {
  const { user } = useUser();

  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async (): Promise<ConversationWithUser[]> => {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }

      // Obtener conversaciones del usuario actual
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('last_updated', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }

      if (!conversations || conversations.length === 0) {
        return [];
      }

      // Obtener los IDs de los otros usuarios
      const otherUserIds = conversations.map(conv => 
        conv.user1_id === user.id ? conv.user2_id : conv.user1_id
      );

      // Obtener información de los otros usuarios
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, email')
        .in('id', otherUserIds);

      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
        throw profilesError;
      }

      // Combinar conversaciones con información de usuarios
      const conversationsWithUsers: ConversationWithUser[] = conversations.map(conv => {
        const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
        const otherUser = profiles?.find(profile => profile.id === otherUserId) || null;

        return {
          ...conv,
          other_user: otherUser
        };
      });

      return conversationsWithUsers;
    },
    enabled: !!user?.id,
  });
};

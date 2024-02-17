import { AddedToGroupResponse, EVENTS } from '@/lib/events';
import { pusher } from '@/lib/pusher';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { Channel } from 'pusher-js';
import { useEffect, useState } from 'react';
import { fetchChat } from './queries/useChat';
import { useProfile } from './queries/userProfile';

export const useRealtimeUpdates = () => {
  const { data: profile } = useProfile();
  const [personalChannel, setPersonalChannel] = useState<Channel | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (profile?.id) {
      const channel = pusher.subscribe(profile.id);
      setPersonalChannel(channel);
    }
    return () => {
      profile?.id && pusher.unsubscribe(profile.id);
      setPersonalChannel(null);
    };
  }, [profile?.id]);

  useEffect(() => {
    if (!personalChannel) return;
    personalChannel.bind(
      EVENTS.ADDED_TO_GROUP,
      async (data: AddedToGroupResponse) => {
        const chat = await queryClient.fetchQuery({
          queryKey: ['chat', data.chatId],
          queryFn: () => fetchChat(data.chatId, true)
        });
        const oldChatsData = queryClient.getQueryData<
          InfiniteData<Chat[]> | undefined
        >(['chats']) || { pages: [], pageParams: [] };
        const firstPage = (oldChatsData.pages[0] || []).filter(
          ({ id }) => id !== chat.id
        );
        queryClient.setQueryData<InfiniteData<Chat[]>>(['chats'], {
          ...oldChatsData,
          pages: [[chat, ...(firstPage || [])], ...oldChatsData.pages.slice(1)]
        });
      }
    );

    return () => {
      personalChannel?.unbind_all();
    };
  }, [personalChannel, queryClient]);

  return null;
};

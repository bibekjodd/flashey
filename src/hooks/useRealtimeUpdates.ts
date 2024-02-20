import { AddedToChatResponse, EVENTS, MessageSentResponse } from '@/lib/events';
import { pusher } from '@/lib/pusher';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { Channel } from 'pusher-js';
import { useEffect, useState } from 'react';
import { fetchChat } from './queries/useChat';
import { useProfile } from './queries/userProfile';

export const useRealtimeUpdates = () => {
  const { data: profile } = useProfile();
  const [channel, setChannel] = useState<Channel | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (profile?.id) {
      const channel = pusher.subscribe(profile.id);
      setChannel(channel);
    }
    return () => {
      profile?.id && pusher.unsubscribe(profile.id);
      setChannel(null);
    };
  }, [profile?.id]);

  useEffect(() => {
    if (!channel) return;
    channel.bind(EVENTS.ADDED_TO_CHAT, async (data: AddedToChatResponse) => {
      const chat = await queryClient.fetchQuery({
        queryKey: ['chat', data.chatId],
        queryFn: () => fetchChat(data.chatId)
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
    });

    /* on send message */
    channel.bind(EVENTS.MESSAGE_SENT, async (message: MessageSentResponse) => {
      const chat = queryClient.getQueryData<Chat | undefined>([
        'chat',
        message.chatId
      ]);
      if (!chat) {
        const chat = await queryClient.fetchQuery({
          queryKey: ['chat', message.chatId],
          queryFn: () => fetchChat(message.chatId)
        });
        const oldChatsData = queryClient.getQueryData<
          InfiniteData<Chat[]> | undefined
        >(['chats']) || { pages: [], pageParams: [] };
        const [firstPage, ...restPages] = oldChatsData.pages;
        queryClient.setQueryData<InfiniteData<Chat[]>>(['chats'], {
          ...oldChatsData,
          pages: [[chat, ...(firstPage || [])], ...restPages]
        });
      }

      const oldMessagesData = queryClient.getQueryData<
        InfiniteData<Message[]> | undefined
      >(['messages', message.chatId]) || { pages: [], pageParams: [] };

      const firstPage = (oldMessagesData.pages[0] || []).filter(
        ({ id }) => id !== message.id
      );
      queryClient.setQueryData<InfiniteData<Message[]>>(
        ['messages', message.chatId],
        {
          ...oldMessagesData,
          pages: [
            [message, ...(firstPage || [])],
            ...oldMessagesData.pages.slice(1)
          ]
        }
      );
      //
    });
  }, [channel, queryClient]);

  return null;
};

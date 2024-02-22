import { ChatUpdatedResponse, EVENTS, MessageSentResponse } from '@/lib/events';
import { pusher } from '@/lib/pusher';
import { updateChat, updateMessage } from '@/lib/utils';
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
    channel.bind(
      EVENTS.CHAT_UPDATED,
      async ({ chatId, image, name, removedMembers }: ChatUpdatedResponse) => {
        const oldChatsData = queryClient.getQueryData<
          InfiniteData<Chat[]> | undefined
        >(['chats']) || { pages: [], pageParams: [] };

        // if user is removed from chat
        if (removedMembers?.includes(profile?.id!)) {
          queryClient.removeQueries({ queryKey: ['chat', chatId] });
          const updatedChats = oldChatsData.pages.map((page) =>
            page.filter((chat) => chat.id !== chatId)
          );
          queryClient.setQueryData<InfiniteData<Chat[]>>(['chats'], {
            ...oldChatsData,
            pages: updatedChats
          });
          return;
        }

        // check if chat is fetched or not
        let chat = queryClient.getQueryData<Chat | undefined>(['chat', chatId]);
        if (!chat) {
          chat = await queryClient.fetchQuery({
            queryKey: ['chat', chatId],
            queryFn: () => fetchChat(chatId)
          });
          if (!chat) return;
        }

        // on name/image update
        const updatedChat: Chat = {
          ...chat,
          name: name || chat.name,
          image: image === null ? null : chat.image,
          updatedAt: new Date().toISOString()
        };
        updateChat({ queryClient, chat: updatedChat });
      }
    );

    /* on send message */
    channel.bind(EVENTS.MESSAGE_SENT, async (message: MessageSentResponse) => {
      let chat = queryClient.getQueryData<Chat | undefined>([
        'chat',
        message.chatId
      ]);
      if (!chat) {
        chat = await queryClient.fetchQuery({
          queryKey: ['chat', message.chatId],
          queryFn: () => fetchChat(message.chatId)
        });
        if (!chat) return;
      }
      updateMessage({ message, queryClient });
      const sender = chat.members.find(
        (member) => member.id === message.senderId
      );
      if (sender) {
        const lastMessage: Chat['lastMessage'] = {
          message: message.text || 'sent an image',
          sender: sender.name,
          senderId: sender.id
        };
        const updatedChat: Chat = {
          ...chat,
          lastMessage,
          updatedAt: new Date().toISOString()
        };
        updateChat({ queryClient, chat: updatedChat });
      }
      //
    });

    return () => {
      channel.unbind_all();
    };
  }, [channel, queryClient, profile?.id]);

  return null;
};

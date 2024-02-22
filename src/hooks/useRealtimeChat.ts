import { emojis } from '@/lib/constants';
import {
  EVENTS,
  MessageDeletedResponse,
  MessageSeenResponse,
  ReactionAddedResponse
} from '@/lib/events';
import { updateChat } from '@/lib/utils';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Channel } from 'pusher-js';
import { useEffect } from 'react';
import { useProfile } from './queries/userProfile';

export const useRealtimeChat = ({
  chatId,
  isGroupChat,
  channel
}: {
  chatId: string;
  isGroupChat: boolean;
  channel: Channel;
}) => {
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();
  const router = useRouter();

  useEffect(() => {
    // chat deleted
    channel.bind(EVENTS.CHAT_DELETED, () => {
      if (location.pathname === `/chat/${chatId}`) router.replace('/');
      queryClient.removeQueries({ queryKey: ['chat', chatId] });
      queryClient.removeQueries({ queryKey: ['messages', chatId] });

      const chatsData = queryClient.getQueryData<
        InfiniteData<Chat[]> | undefined
      >(['chats']) || { pages: [], pageParams: [] };

      const updatedChats = chatsData.pages.map((page) =>
        page.filter((chat) => chat.id !== chatId)
      );
      queryClient.setQueryData<InfiniteData<Chat[]>>(['chats'], {
        ...chatsData,
        pages: updatedChats
      });
    });

    /* on message seen */
    channel.bind(
      EVENTS.MESSAGE_SEEN,
      ({ messageId, userId }: MessageSeenResponse) => {
        const oldMessagesData = queryClient.getQueryData<
          InfiniteData<Message[]> | undefined
        >(['messages', chatId]) || { pages: [], pageParams: [] };

        const updatedMessages: Message[][] = oldMessagesData.pages.map(
          (page) => {
            return page.map((message) => {
              if (message.id !== messageId) return message;
              const updatedViewers = message.viewers.filter(
                (viewer) => viewer !== userId
              );
              return {
                ...message,
                viewers: [...updatedViewers, userId]
              };
            });
          }
        );

        queryClient.setQueryData<InfiniteData<Message[]>>(
          ['messages', chatId],
          { ...oldMessagesData, pages: updatedMessages }
        );
        //
      }
    );

    /* on message deleted */
    channel.bind(
      EVENTS.MESSAGE_DELETED,
      ({ messageId, sender, senderId }: MessageDeletedResponse) => {
        const oldMessagesData = queryClient.getQueryData<
          InfiniteData<Message[]> | undefined
        >(['messages', chatId]) || { pages: [], pageParams: [] };

        const updatedMessages = oldMessagesData.pages.map((page) => {
          return page.filter((message) => message.id !== messageId);
        });

        queryClient.setQueryData<InfiniteData<Message[]>>(
          ['messages', chatId],
          { ...oldMessagesData, pages: updatedMessages }
        );

        const chat = queryClient.getQueryData<Chat | undefined>([
          'chat',
          chatId
        ]);
        if (!chat) return;
        const updatedChat: Chat = {
          ...chat,
          lastMessage: { message: 'deleted a message', sender, senderId },
          updatedAt: new Date().toISOString()
        };
        updateChat({ queryClient, chat: updatedChat });
        //
      }
    );

    /* reaction added/removed */
    channel.bind(
      EVENTS.REACTION_ADDED,
      ({ messageId, reaction, userId }: ReactionAddedResponse) => {
        const oldMessagesData = queryClient.getQueryData<
          InfiniteData<Message[]> | undefined
        >(['messages', chatId]) || { pages: [], pageParams: [] };

        const updatedMessages: Message[][] = oldMessagesData.pages.map(
          (page) => {
            return page.map((message) => {
              if (message.id !== messageId) return message;
              const updatedReactions = message.reactions.filter(
                (current) => current.userId !== userId
              );
              if (reaction) updatedReactions.push({ userId, reaction });
              return {
                ...message,
                reactions: updatedReactions
              };
            });
          }
        );

        queryClient.setQueryData<InfiniteData<Message[]>>(
          ['messages', chatId],
          { ...oldMessagesData, pages: updatedMessages }
        );

        // update chat state
        const chat = queryClient.getQueryData<Chat | undefined>([
          'chat',
          chatId
        ]);
        if (!chat || !reaction) return;

        const reactor = chat.members.find((member) => member.id === userId);
        if (!reactor) return;
        const lastMessage: Chat['lastMessage'] = {
          message: `reacted ${emojis[reaction]} to a message`,
          sender: reactor.name,
          senderId: reactor.id
        };
        const updatedChat: Chat = {
          ...chat,
          updatedAt: new Date().toISOString(),
          lastMessage
        };
        updateChat({ queryClient, chat: updatedChat });
        //
      }
    );

    return () => {
      channel.unbind_all();
    };
  }, [channel, queryClient, chatId, isGroupChat, profile, router]);
};

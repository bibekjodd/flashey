import {
  EVENTS,
  MessageDeletedResponse,
  MessageSeenResponse,
  MessageSentResponse,
  ReactionAddedResponse
} from '@/lib/events';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { Channel } from 'pusher-js';
import { useEffect } from 'react';
import { useProfile } from './queries/userProfile';

export const useRealtimeMessages = ({
  chatId,
  isGroupChat,
  channel
}: {
  chatId: string;
  isGroupChat: boolean;
  channel: Channel;
}) => {
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();

  useEffect(() => {
    /* on send message */
    channel.bind(EVENTS.MESSAGE_SENT, (message: MessageSentResponse) => {
      const oldMessagesData = queryClient.getQueryData<
        InfiniteData<Message[]> | undefined
      >(['messages', chatId]) || { pages: [], pageParams: [] };

      const firstPage = (oldMessagesData.pages[0] || []).filter(
        ({ id }) => id !== message.id
      );
      queryClient.setQueryData<InfiniteData<Message[]>>(['messages', chatId], {
        ...oldMessagesData,
        pages: [
          [message, ...(firstPage || [])],
          ...oldMessagesData.pages.slice(1)
        ]
      });
      //
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
      ({ messageId }: MessageDeletedResponse) => {
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

        const updatedMessages = oldMessagesData.pages.map((page) => {
          return page.map((message) => {
            if (message.id !== messageId) return message;
            const updatedReactions = [...message.reactions].filter(
              (current) => current.userId !== userId
            );
            if (reaction) updatedReactions.push({ reaction, userId });
            return {
              ...message,
              reactions: [...updatedReactions]
            };
          });
        });

        queryClient.setQueryData<InfiniteData<Message[]>>(
          ['messages', chatId],
          { ...oldMessagesData, pages: updatedMessages }
        );

        //
      }
    );

    return () => {
      channel?.unbind_all();
    };
  }, [chatId, channel, isGroupChat, profile?.id, queryClient]);

  return null;
};

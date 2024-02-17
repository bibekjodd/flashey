import {
  EVENTS,
  GroupUpdatedResponse,
  RemovedFromGroupResponse
} from '@/lib/events';
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
    /* on group update */
    channel.bind(EVENTS.GROUP_UPDATED, (data: GroupUpdatedResponse) => {
      const oldChat = queryClient.getQueryData<Chat | undefined>([
        'chat',
        chatId
      ]);
      if (!oldChat) return;
      queryClient.setQueryData<Chat>(['chat', chatId], {
        ...oldChat,
        image: data.image || oldChat.image,
        name: data.name || oldChat.name
      });
    });

    /* on remove from group */
    channel.bind(
      EVENTS.REMOVED_FROM_GROUP,
      (data: RemovedFromGroupResponse) => {
        // if the current user is removed
        if (data.removedMembersId.includes(profile?.id!)) {
          router.replace('/');
          queryClient.setQueryData(['chat', chatId], null);
          const oldChatsData = queryClient.getQueryData<
            InfiniteData<Chat[]> | undefined
          >(['chats']) || { pageParams: [], pages: [] };
          const updatedchats = oldChatsData.pages.map((page) => {
            return page.filter((chat) => chat.id !== chatId);
          });

          queryClient.setQueryData<InfiniteData<Chat[]>>(['chats'], {
            ...oldChatsData,
            pages: updatedchats
          });
          return;
        }

        const oldChat = queryClient.getQueryData<Chat | null>(['chat', chatId]);
        if (!oldChat) return;
        const updatedMembers = oldChat.members.filter(
          (member) => !data.removedMembersId.includes(member.id)
        );
        queryClient.setQueryData<Chat>(['chat', chatId], {
          ...oldChat,
          members: updatedMembers
        });
      }
    );

    // group deleted
    channel.bind(EVENTS.GROUP_DELETED, () => {
      queryClient.setQueryData(['chat', chatId], null);
      queryClient.setQueryData(['messages', chatId], null);
      const chatsData = queryClient.getQueryData<
        InfiniteData<Chat[]> | undefined
      >(['chats']) || { pages: [], pageParams: [] };

      const updatedChats = chatsData.pages.map((page) => {
        return page.filter((chat) => chat.id !== chatId);
      });
      queryClient.setQueryData<InfiniteData<Chat[]>>(['chats'], {
        ...chatsData,
        pages: updatedChats
      });
    });

    return () => {
      channel?.unbind_all();
    };
  }, [channel, queryClient, chatId, isGroupChat, profile, router]);
};

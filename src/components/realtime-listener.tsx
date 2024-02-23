'use client';
import { useChats } from '@/hooks/queries/useChats';
import { usePrevious } from '@/hooks/usePrevious';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { pusher } from '@/lib/pusher';
import { memo, useEffect, useMemo } from 'react';

export default function RealtimeListener() {
  useRealtimeUpdates();
  const { data } = useChats();
  const chats = useMemo(() => data?.pages.flat(1) || [], [data?.pages]);
  const chatIds = useMemo(() => chats.map((chat) => chat.id), [chats]);
  const previousChatIds = usePrevious(chatIds);

  useEffect(() => {
    if (!previousChatIds) return;

    const previousChats = [...previousChatIds].sort().join('');
    const currentChats = [...chatIds].sort().join('');
    if (previousChats === currentChats) return;

    // unsub from removed/deleted chats
    for (const id of previousChatIds) {
      if (!chatIds.includes(id)) {
        pusher.unsubscribe(id);
      }
    }
  }, [chatIds, previousChatIds]);

  return chats.map((chat) => (
    <Listener key={chat.id} chatId={chat.id} isGroupChat={chat.isGroupChat} />
  ));
}

const Listener = memo(function Component({
  chatId,
  isGroupChat
}: {
  chatId: string;
  isGroupChat: boolean;
}) {
  const channel = pusher.subscribe(chatId);
  useRealtimeChat({ channel, chatId, isGroupChat });
  return null;
});

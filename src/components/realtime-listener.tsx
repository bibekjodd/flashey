'use client';
import { useChats } from '@/hooks/queries/useChats';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { pusher } from '@/lib/pusher';
import { memo, useEffect, useMemo, useState } from 'react';

export default function RealtimeListener() {
  useRealtimeUpdates();
  const { data } = useChats();
  const chats = useMemo(() => data?.pages.flat(1) || [], [data?.pages]);
  const [chatIds, setChatIds] = useState<string[]>([]);

  useEffect(() => {
    const allChatIds = chats.map((chat) => chat.id).sort();
    const isChanged = chatIds.join('') === allChatIds.join('');
    if (isChanged) setChatIds(allChatIds);
  }, [chats, chatIds]);

  useEffect(() => {
    return () => {
      for (const id of chatIds) pusher.unsubscribe(id);
    };
  }, [chatIds]);

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

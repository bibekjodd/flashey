'use client';

import { useChats } from '@/hooks/queries/useChats';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { pusher } from '@/lib/pusher';
import { memo, useEffect } from 'react';

export default function RealtimeListener() {
  useRealtimeUpdates();
  const { data } = useChats();
  const chats = data?.pages.flat(1) || [];

  const chatIds = chats.map((chat) => chat.id);

  useEffect(() => {
    return () => {
      for (const id of chatIds) {
        pusher.unsubscribe(id);
      }
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
  useRealtimeMessages({ channel, chatId, isGroupChat });
  return null;
});

'use client';
import ChatHeader from '@/components/chat/header';
import Messages from '@/components/chat/messages';
import SendMessage from '@/components/chat/send-message';
import { useChat } from '@/hooks/queries/useChat';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

type Props = {
  params: {
    'chat-type': string;
    id: string;
  };
};
export default function Page({ params }: Props) {
  const isGroupChat = params['chat-type'] === 'group';
  const chatId = params.id;
  if (!['messages', 'group'].includes(params['chat-type'])) {
    redirect('/');
  }
  const { data: chat, error } = useChat(chatId, isGroupChat);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.replace('/');
      toast.dismiss();
      toast.error(error.message);
    }
  }, [chat, error, router]);

  if (!chat) return null;
  return <Main chat={chat} />;
}

function Main({ chat }: { chat: Chat }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const oldChatsData = queryClient.getQueryData<InfiniteData<Chat[]> | null>([
      'chats'
    ]) || { pages: [], pageParams: [] };

    const chatExists = oldChatsData.pages
      .flat(1)
      .find(({ id }) => id === chat.id);
    if (chatExists) return;

    const [firstPage, ...restPages] = oldChatsData.pages;
    queryClient.setQueryData<InfiniteData<Chat[]>>(['chats'], {
      ...oldChatsData,
      pages: [[chat, ...(firstPage || [])], ...restPages]
    });
  }, [queryClient, chat]);

  return (
    <main className="flex h-full w-full flex-col">
      <ChatHeader chat={chat} />
      <div className="flex-grow overflow-y-auto">
        <Messages chat={chat} />
      </div>
      <SendMessage chatId={chat.id} />
    </main>
  );
}

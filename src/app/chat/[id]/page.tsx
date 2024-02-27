'use client';
import ChatHeader from '@/components/chat/header';
import Messages from '@/components/chat/messages';
import SendMessage from '@/components/chat/send-message';
import { useChat } from '@/hooks/queries/useChat';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

type Props = {
  params: {
    id: string;
  };
};
export default function Page({ params }: Props) {
  const chatId = params.id;
  const { data: chat, error, isFetching } = useChat(chatId);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.replace('/');
      toast.dismiss();
      toast.error(error.message);
    }
    if (!isFetching && !chat) {
      router.replace('/');
    }
  }, [chat, error, router, isFetching]);

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
    <main className="sticky left-0 top-0 flex h-screen w-full flex-col overflow-y-hidden dark:bg-gray-950">
      <ChatHeader chat={chat} />
      <Messages chat={chat} />
      <SendMessage chatId={chat.id} />
    </main>
  );
}

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
    <main className="flex h-full w-full flex-col dark:bg-neutral-900">
      <ChatHeader chat={chat} />
      <div className="flex-grow overflow-y-auto">
        <Messages chat={chat} />
      </div>
      <SendMessage chatId={chat.id} />
    </main>
  );
}

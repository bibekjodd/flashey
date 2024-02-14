'use client';
import ChatHeader from '@/components/chat/header';
import Messages from '@/components/chat/messages';
import SendMessage from '@/components/chat/send-message';
import { useChat } from '@/hooks/queries/useChat';
import { redirect } from 'next/navigation';

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
    return redirect('/');
  }
  return <Main chatId={chatId} isGroupChat={isGroupChat} />;
}

type MainProps = {
  chatId: string;
  isGroupChat: boolean;
};
function Main({ chatId, isGroupChat }: MainProps) {
  const { data: chat } = useChat(chatId, isGroupChat);
  if (!chat) return null;
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

'use client';
import { useChat } from '@/hooks/queries/useChat';
import ChatHeader from './header';
import Messages from './messages';
import SendMessage from './send-message';

type Props = { isGroupChat: boolean; chatId: string };
export default function ChatPage({ isGroupChat, chatId }: Props) {
  const { data: chat } = useChat(chatId, isGroupChat);
  if (!chat) return null;
  return (
    <div className="flex h-full w-full flex-col">
      <ChatHeader chat={chat} />
      <div className="flex-grow overflow-y-auto">
        <Messages chat={chat} />
      </div>
      <SendMessage chatId={chat.id} />
    </div>
  );
}

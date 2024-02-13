'use client';
import { useChat } from '@/hooks/queries/useChat';
import ChatHeader from './header';
import Messages from './messages';

type Props = { isGroupChat: boolean; chatId: string };
export default function ChatPage({ isGroupChat, chatId }: Props) {
  const { data: chat } = useChat(chatId, isGroupChat);
  if (!chat) return null;
  return (
    <div className="w-full">
      <ChatHeader chat={chat} />
      <Messages chat={chat} />
    </div>
  );
}

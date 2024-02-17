'use client';
import { useChat } from '@/hooks/queries/useChat';
import { useChats } from '@/hooks/queries/useChats';
import { useProfile } from '@/hooks/queries/userProfile';
import { getChatImage, getChatTitle } from '@/lib/utils';
import { formatRelative } from 'date-fns';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';
import Avatar from '../ui/avatar';

export default function ChatsList() {
  const { data, isLoading } = useChats();
  const chats = data?.pages.flat(1) || [];

  return (
    <section>
      <h3 className="text-lg font-semibold text-gray-800">Chats</h3>
      <div className="flex flex-col space-y-2">
        {isLoading &&
          new Array(4).fill('nothing').map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-2">
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200/50" />
              <div className="flex-grow space-y-2">
                <div className="h-6 w-full animate-pulse rounded-full bg-gray-200/50" />
                <div className="h-5 w-full animate-pulse rounded-full bg-gray-200/50" />
              </div>
            </div>
          ))}

        {chats.map((chat) => (
          <Chat key={chat.id} chatId={chat.id} isGroupChat={chat.isGroupChat} />
        ))}
      </div>
    </section>
  );
}

type ChatItemProps = {
  chatId: string;
  isGroupChat: boolean;
};
const Chat = memo(function Component({ chatId, isGroupChat }: ChatItemProps) {
  const { data: chat } = useChat(chatId, isGroupChat);
  const pathname = usePathname();
  const { data: profile } = useProfile();
  if (!chat) return null;
  const otherUser = chat.members.find((member) => member.id !== profile?.id);
  const chatLink = chat.isGroupChat
    ? `/group/${chat.id}`
    : `/messages/${otherUser?.id}`;
  let lastMessage: string | null = null;
  const lastMessageSender = chat.members.find(
    (member) => member.id === chat.lastMessage?.senderId
  );
  if (chat.lastMessage) {
    lastMessage = '';
    if (chat.lastMessage.senderId === profile?.id) {
      lastMessage += 'You';
    } else {
      lastMessage += (lastMessageSender?.name || '').split(' ')[0];
    }
    lastMessage += ': ';
    lastMessage += chat.lastMessage.message;
  }

  return (
    <Link
      href={chatLink}
      className={`group flex w-full items-center space-x-3 rounded-lg p-2 text-left transition hover:bg-gray-200/40 focus:bg-gray-200/40 focus:outline-none active:bg-gray-200/20 ${pathname === chatLink ? 'bg-gray-200/40' : ''}`}
    >
      <Avatar src={getChatImage(chat, profile?.id)} />
      <section className="relative flex flex-grow flex-col">
        <span className="line-clamp-1 text-sm font-semibold">
          {getChatTitle(chat, profile?.id)}
        </span>
        {lastMessage && (
          <span className="line-clamp-1 text-[13px] font-medium text-gray-600 group-hover:text-neutral-800 group-focus:text-neutral-800">
            {lastMessage}
          </span>
        )}
        <span className="line-clamp-1 pt-0.5 text-xs text-gray-400">
          {formatRelative(new Date(chat.updatedAt), new Date())}
        </span>
      </section>
    </Link>
  );
});

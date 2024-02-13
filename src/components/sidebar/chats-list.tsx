'use client';
import { useChats } from '@/hooks/queries/useChats';
import { useProfile } from '@/hooks/queries/userProfile';
import { getChatImage, getChatTitle } from '@/lib/utils';
import { formatRelative } from 'date-fns';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';
import Avatar from '../ui/avatar';

export default function ChatsList() {
  const { data } = useChats();
  const chats = data?.pages.flat(1) || [];

  return (
    <section className="flex flex-col space-y-2 pt-3">
      {chats.map((chat) => (
        <Chat key={chat.id} chat={chat} />
      ))}
    </section>
  );
}

type ChatItemProps = {
  chat: Chat;
};
const Chat = memo(function Component({ chat }: ChatItemProps) {
  const pathname = usePathname();
  const { data: profile } = useProfile();
  const otherUser = chat.participants.find(
    (participant) => participant.id !== profile?.id
  );
  const chatLink = chat.isGroupChat
    ? `/group/${chat.id}`
    : `/messages/${otherUser?.id}`;
  let lastMessage: string | null = null;
  if (chat.lastMessage) {
    lastMessage = '';
    if (chat.lastMessage.senderId === profile?.id) {
      lastMessage += 'You';
    } else {
      lastMessage += chat.lastMessage.sender.split(' ')[0];
    }
    lastMessage += ': ';
    lastMessage += chat.lastMessage.message;
  }

  return (
    <Link
      href={chatLink}
      className={`group flex w-full items-center space-x-3 rounded-lg p-2 text-left hover:bg-gray-200/40 focus:bg-gray-200/40 focus:outline-none ${pathname === chatLink ? 'bg-gray-200/40' : ''}`}
    >
      <Avatar src={getChatImage(chat, profile?.id)} />
      <section className="relative flex flex-col">
        <span className="line-clamp-1 font-semibold">
          {getChatTitle(chat, profile?.id)}
        </span>
        {lastMessage && (
          <span className="line-clamp-1 text-sm font-medium text-gray-600 group-hover:text-neutral-800 group-focus:text-neutral-800">
            {lastMessage}
          </span>
        )}
        <span className="line-clamp-1 text-xs text-gray-400">
          {formatRelative(new Date(chat.updatedAt), new Date())}
        </span>
      </section>
    </Link>
  );
});

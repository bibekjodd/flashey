'use client';
import { useChat } from '@/hooks/queries/useChat';
import { useChats } from '@/hooks/queries/useChats';
import { useProfile } from '@/hooks/queries/useProfile';
import { poppins } from '@/lib/fonts';
import { getChatImage, getChatTitle } from '@/lib/utils';
import { formatRelative } from 'date-fns';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';
import ScrollObserver from '../scroll-observer';
import Avatar from '../ui/avatar';

export default function ChatsList() {
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } =
    useChats();
  const chats = data?.pages.flat(1) || [];

  return (
    <section>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
        Chats
      </h3>
      <div className="flex flex-col space-y-2 py-2">
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
          <Chat key={chat.id} chatId={chat.id} />
        ))}
        <ScrollObserver
          fetchNextPage={fetchNextPage}
          isFetching={isFetching}
          hasNextPage={hasNextPage}
        />
      </div>
    </section>
  );
}

type ChatItemProps = {
  chatId: string;
};
const Chat = memo(function Component({ chatId }: ChatItemProps) {
  const { data: chat } = useChat(chatId);
  const pathname = usePathname();
  const { data: profile } = useProfile();
  if (!chat) return null;
  const chatLink = `/chat/${chatId}`;

  let lastMessage: string | null = null;
  const lastMessageSender = chat.members.find(
    (member) => member.id === chat.lastMessage?.senderId
  );
  if (chat.lastMessage) {
    lastMessage = '';
    if (chat.lastMessage.senderId === profile?.id) {
      lastMessage += 'You';
    } else {
      lastMessage += (lastMessageSender?.name || 'user').split(' ')[0];
    }
    lastMessage += ': ';
    lastMessage += chat.lastMessage.message;
  }

  return (
    <Link
      href={chatLink}
      className={`${poppins.className} group flex w-full items-center space-x-3 rounded-lg p-2 text-left transition hover:bg-gray-200/40 focus:bg-gray-200/40 focus:outline-none active:bg-gray-200/20 dark:hover:bg-gray-700/40 dark:focus:bg-gray-700/40 dark:active:bg-gray-700/40
       ${pathname === chatLink ? 'bg-gray-200/40 dark:bg-gray-700/40' : ''}`}
    >
      <Avatar src={getChatImage(chat, profile?.id)} />
      <section className="relative flex flex-grow flex-col">
        <span className={`line-clamp-1 text-sm font-medium`}>
          {getChatTitle(chat, profile?.id)}
        </span>
        {lastMessage && (
          <span className="line-clamp-1 text-[13px] text-gray-600 group-hover:text-neutral-800 group-focus:text-neutral-800 dark:text-neutral-200/80 dark:group-hover:text-neutral-200/80 dark:group-focus:text-neutral-100">
            {lastMessage}
          </span>
        )}
        <span className="line-clamp-1 pt-0.5 text-xs text-gray-400 dark:text-neutral-400">
          {formatRelative(new Date(chat.updatedAt), new Date())}
        </span>
      </section>
    </Link>
  );
});

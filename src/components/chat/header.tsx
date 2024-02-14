import { useProfile } from '@/hooks/queries/userProfile';
import { getChatImage, getChatTitle } from '@/lib/utils';
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Avatar from '../ui/avatar';

type Props = { chat: Chat };
export default function ChatHeader({ chat }: Props) {
  const { data: profile } = useProfile();
  return (
    <header className="sticky left-0 top-0 z-10 flex h-16 w-full items-center bg-white/90 px-4 py-2 shadow-sm shadow-neutral-200/70 filter backdrop-blur-3xl md:h-20">
      <Link href="/" className="pr-3 lg:hidden">
        <ArrowLeftIcon className="h-5 w-5 " />
      </Link>
      <Avatar src={getChatImage(chat, profile?.id)} variant="lg" />
      <div className="flex w-fit flex-col pl-2.5">
        <span className="line-clamp-1 font-semibold">
          {getChatTitle(chat, profile?.id)}
        </span>
        {chat.isGroupChat && (
          <span className="line-clamp-1 text-sm text-gray-600">
            {chat.participants.length} members
          </span>
        )}
      </div>

      <button className="ml-auto h-full px-3">
        <EllipsisVerticalIcon className="h-5 w-5" />
      </button>
    </header>
  );
}

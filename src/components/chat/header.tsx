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
    <header className="flex h-16 w-full items-center border-b-2 px-4 py-2 md:h-20">
      <Link href="/" className="pr-3 lg:hidden">
        <ArrowLeftIcon className="h-5 w-5 " />
      </Link>
      <Avatar src={getChatImage(chat, profile?.id)} variant="lg" />
      <div className="flex w-fit flex-col pl-2">
        <span className="font-semibold">{getChatTitle(chat, profile?.id)}</span>
        {chat.isGroupChat && (
          <span className="text-sm text-gray-600">
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

'use client';
import { useProfile } from '@/hooks/queries/useProfile';
import { concertOne } from '@/lib/fonts';
import {
  ChatBubbleOvalLeftIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import CreateOrUpdateChatModal from '../modals/create-update-chat';
import ProfileModal from '../modals/profile-modal';
import { ThemeToggle } from '../theme-toggle';
import Avatar from '../ui/avatar';
import ChatsList from './chats-list';
import FriendsList from './friends-list';
import Search from './search';

export default function Sidebar() {
  const { data: profile } = useProfile();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'chat' | 'friends'>('chat');

  return (
    <aside
      className={`flex h-screen w-full flex-col overflow-y-auto border-neutral-200/50 pb-0 scrollbar-thin dark:border-neutral-600/50 dark:bg-gray-900 lg:w-96 lg:border-r-2
         ${pathname === '/' ? '' : 'hidden w-0 lg:flex'}`}
    >
      <section className="sticky left-0 top-0 z-10 space-y-3 bg-white/90 px-4 pt-2 filter backdrop-blur-3xl dark:bg-gray-900">
        <div className="flex items-center pb-2">
          <Link href="/" className="mr-auto text-4xl font-bold">
            <span
              className={`${concertOne.className} bg-gradient-to-r from-pink-500 via-fuchsia-500
            to-sky-400 bg-clip-text text-transparent
            `}
            >
              Flashey
            </span>
          </Link>
          <ProfileModal>
            <button>
              <Avatar src={profile?.image} variant="sm" />
            </button>
          </ProfileModal>
          <div className="ml-3">
            <ThemeToggle />
          </div>
        </div>
        <Search />
      </section>

      <section className="flex-grow px-4">
        <div className={`${activeTab === 'chat' ? '' : 'hidden'}`}>
          <ChatsList />
        </div>
        <div className={`${activeTab === 'friends' ? '' : 'hidden'}`}>
          <FriendsList />
        </div>
      </section>

      <section className="sticky bottom-0 left-0 border-neutral-200/50 bg-white text-xs font-medium text-gray-900 dark:bg-gray-900 dark:text-white">
        <div className="my-auto flex h-20 items-center space-x-0.5 py-2">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex h-full flex-1 flex-col items-center justify-center space-y-2 rounded-lg py-2 transition hover:bg-gray-200/40  active:scale-95 dark:hover:bg-gray-700/40
          ${activeTab === 'friends' ? 'bg-gray-200/40 dark:bg-gray-700/40' : ''}
          `}
          >
            <UsersIcon className="h-5 w-5 text-gray-700 dark:text-neutral-200" />
            <span>Friends</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex h-full flex-1 flex-col items-center justify-center space-y-2 rounded-lg py-2 transition hover:bg-gray-200/40  active:scale-95 dark:hover:bg-gray-700/40
          ${activeTab === 'chat' ? 'bg-gray-200/40 dark:bg-gray-700/40' : ''}
          `}
          >
            <ChatBubbleOvalLeftIcon className="h-5 w-5 text-gray-700 dark:text-neutral-200" />
            <span>Chat</span>
          </button>

          <CreateOrUpdateChatModal chat={null}>
            <button className="flex h-full flex-1 flex-col items-center justify-center space-y-2 rounded-lg py-2 transition hover:bg-gray-200/40  active:scale-95 dark:hover:bg-gray-700/40">
              <UserGroupIcon className="h-5 w-5 text-gray-700 dark:text-neutral-200" />
              <span>Create Group</span>
            </button>
          </CreateOrUpdateChatModal>
        </div>
      </section>
    </aside>
  );
}

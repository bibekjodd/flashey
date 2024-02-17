'use client';
import { useProfile } from '@/hooks/queries/userProfile';
import {
  ChatBubbleOvalLeftIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import CreateGroup from '../modals/create-group';
import ProfileModal from '../modals/profile-modal';
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
      className={`flex h-full w-full flex-col overflow-y-auto border-neutral-200/50 pb-0 scrollbar-thin lg:w-[360px] lg:border-r-2
         ${pathname === '/' ? '' : 'hidden w-0 lg:flex'}`}
    >
      <section className="sticky left-0 top-0 z-10 space-y-3 bg-white/90 px-4 pt-4 filter backdrop-blur-3xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="pt-1 text-2xl font-bold">
            Flashey
          </Link>
          <ProfileModal>
            <button>
              <Avatar src={profile?.image} variant="sm" />
            </button>
          </ProfileModal>
        </div>
        <Search />
      </section>

      <section className="flex-grow px-4 pt-3">
        <div className={`${activeTab === 'chat' ? '' : 'hidden'}`}>
          <ChatsList />
        </div>
        <div className={`${activeTab === 'friends' ? '' : 'hidden'}`}>
          <FriendsList />
        </div>
      </section>

      <section className="sticky bottom-0 left-0 border-neutral-200/50 bg-white/90 text-xs font-medium text-gray-900 filter backdrop-blur-3xl">
        <div className="my-auto flex h-20 items-center space-x-0.5 px-4">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex h-full flex-1 flex-col items-center justify-center space-y-2 rounded-lg py-2 transition hover:bg-gray-200/40 active:scale-95
          ${activeTab === 'friends' ? 'bg-gray-200/40' : ''}
          `}
          >
            <UsersIcon className="h-5 w-5 text-gray-700" />
            <span>Friends</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex h-full flex-1 flex-col items-center justify-center space-y-2 rounded-lg py-2 transition hover:bg-gray-200/40 active:scale-95
          ${activeTab === 'chat' ? 'bg-gray-200/40' : ''}
          `}
          >
            <ChatBubbleOvalLeftIcon className="h-5 w-5 text-gray-700" />
            <span>Chat</span>
          </button>

          <CreateGroup>
            <button className="flex h-full flex-1 flex-col items-center justify-center space-y-2 rounded-lg py-2 transition hover:bg-gray-200/40 active:scale-95">
              <UserGroupIcon className="h-5 w-5 text-gray-700" />
              <span>Create Group</span>
            </button>
          </CreateGroup>
        </div>
      </section>
    </aside>
  );
}

'use client';
import { useProfile } from '@/hooks/queries/userProfile';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProfileModal from '../modals/profile-modal';
import Avatar from '../ui/avatar';
import ChatsList from './chats-list';
import Search from './search';

export default function Sidebar() {
  const { data: profile } = useProfile();
  const pathname = usePathname();
  return (
    <aside
      className={`sticky left-0 top-0 flex h-screen min-h-screen w-full flex-col overflow-y-auto border-r-2 border-neutral-200 p-4 lg:w-80 ${pathname === '/' ? '' : 'hidden lg:block'}`}
    >
      <div className="mb-3">
        <Link href="/" className="text-xl font-bold md:text-2xl">
          Flashey
        </Link>
      </div>
      <Search />
      <ChatsList />

      <div className="absolute bottom-4 left-4 mt-auto">
        <ProfileModal>
          <button className="flex w-full items-center space-x-2 text-sm font-medium">
            <Avatar src={profile?.image} />
            <div className="flex flex-col items-start">
              <span className="font-semibold">{profile?.name}</span>
              <span className="text-xs text-gray-600">{profile?.email}</span>
            </div>
          </button>
        </ProfileModal>
      </div>
    </aside>
  );
}

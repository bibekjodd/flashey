'use client';
import { useProfile } from '@/hooks/queries/userProfile';
import { dummyUserImage } from '@/lib/constants';
import ProfileModal from '../modals/profile-modal';

export default function Sidebar() {
  const { data: profile } = useProfile();
  return (
    <aside className="sticky left-0 top-0 flex h-screen min-h-screen w-full flex-col overflow-y-auto border-r-2 p-4 lg:w-72">
      <div className="text-xl font-bold md:text-2xl">Messages</div>

      <div className="mt-auto">
        <ProfileModal>
          <button className="flex w-full items-center space-x-2 text-sm font-medium">
            <img
              src={profile?.image || dummyUserImage}
              alt="profile image"
              className="h-10 w-10 rounded-full object-cover"
            />
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

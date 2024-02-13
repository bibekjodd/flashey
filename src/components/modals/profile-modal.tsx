import { useProfile } from '@/hooks/queries/userProfile';
import React from 'react';
import { DeleteAccountDialog } from '../dialogs/delete-account-dialog';
import { LogoutDialog } from '../dialogs/logout-dialog';
import Avatar from '../ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import UpdateProfileModal from './update-profile-modal';

type Props = {
  children?: React.ReactNode;
};
export default function ProfileModal({ children }: Props) {
  const { data: profile } = useProfile();
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <button>
            <Avatar src={profile?.image} />
          </button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Your Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col">
          <div className="flex items-center space-x-3">
            <Avatar src={profile?.image} variant="2xl" />
            <div className="flex flex-col">
              <span className="text-lg font-semibold">{profile?.name}</span>
              <span className="text-gray-500">{profile?.email}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2 text-sm font-medium">
          <UpdateProfileModal>
            <button className="rounded-md bg-green-100 px-4 py-2 text-green-700">
              Update Profile
            </button>
          </UpdateProfileModal>
          <LogoutDialog>
            <button className="rounded-md bg-red-100 px-4 py-2 text-red-700">
              Logout
            </button>
          </LogoutDialog>
          <DeleteAccountDialog>
            <button className="rounded-md bg-red-100 px-4 py-2 text-red-700">
              Delete Account
            </button>
          </DeleteAccountDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}

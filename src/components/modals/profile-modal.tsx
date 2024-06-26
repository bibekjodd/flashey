import { useProfile } from '@/hooks/queries/useProfile';
import React from 'react';
import { DeleteAccountDialog } from '../dialogs/delete-account-dialog';
import { LogoutDialog } from '../dialogs/logout-dialog';
import Avatar from '../ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import UpdateProfileModal from './update-profile-modal';
import { Button } from '../ui/button';

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
              <span className="line-clamp-1 text-gray-500">
                {profile?.email}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-y-1">
          <UpdateProfileModal>
            <Button>Update Profile</Button>
          </UpdateProfileModal>
          <LogoutDialog>
            <Button variant="outline">Logout</Button>
          </LogoutDialog>
          <DeleteAccountDialog>
            <Button variant="destructive">Delete Account</Button>
          </DeleteAccountDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

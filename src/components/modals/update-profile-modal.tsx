import { useUserMutation } from '@/hooks/mutations/useUserMutation';
import { useProfile } from '@/hooks/queries/userProfile';
import React, { useState } from 'react';
import { BiLoader } from 'react-icons/bi';
import Avatar from '../ui/avatar';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type Props = {
  children?: React.ReactNode;
};
export default function UpdateProfileModal({ children }: Props) {
  const { data: profile } = useProfile();
  const { isPending, mutate } = useUserMutation();
  const [name, setName] = useState(profile?.name || '');

  const updateProfile = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    mutate(
      { type: 'update-profile', data: { name } },
      {
        onSuccess() {
          document.getElementById('close-edit-profile-modal')?.click();
        }
      }
    );
  };

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
          <DialogTitle className="text-center">Update Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={updateProfile}>
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              autoFocus
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild id="close-edit-profile-modal">
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={updateProfile} className="relative">
            <span className={`${isPending ? 'opacity-0' : ''}`}>
              Save Changes
            </span>
            {isPending && (
              <span className="absolute inset-0 grid place-items-center">
                <BiLoader className="h-4.5 w-4.5 animate-spin text-neutral-200" />
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

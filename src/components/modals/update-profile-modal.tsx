import { useUserMutation } from '@/hooks/mutations/useUserMutation';
import { useProfile } from '@/hooks/queries/useProfile';
import { imageToDataUri, uploadImage } from '@/lib/image-service';
import React, { useRef, useState } from 'react';
import { BiLoader } from 'react-icons/bi';
import { toast } from 'sonner';
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
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const imagePickerRef = useRef<null | HTMLInputElement>(null);
  const closeModalButtonRef = useRef<HTMLButtonElement | null>(null);

  const onImagePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setImageDataUri(null);
      return;
    }
    const result = await imageToDataUri(file);
    setImageDataUri(result || null);
  };

  const updateProfile = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (name !== profile?.name) {
      mutate(
        { type: 'update-profile', data: { name } },
        {
          onSuccess() {
            closeModalButtonRef.current?.click();
          },
          onError(err) {
            toast.error(`Could not update name! ${err.message}`);
          }
        }
      );
    }

    const imageFile =
      imagePickerRef.current?.files && imagePickerRef.current.files[0];
    closeModalButtonRef.current?.click();
    if (!imageFile) return;
    const uploadedImageUrl = await uploadImage(imageFile);
    if (!uploadedImageUrl) return;
    mutate(
      { type: 'update-profile', data: { image: uploadedImageUrl } },
      {
        onError(err) {
          toast.error(`Could not update profile image! ${err.message}`);
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
        <section className="flex flex-col space-y-5">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              autoFocus
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="image">Display Image</Label>
            <div className="flex items-center space-x-3">
              <Input
                type="file"
                accept="image/*"
                id="image"
                ref={imagePickerRef}
                onChange={onImagePicked}
                placeholder="Enter name"
              />
              {imageDataUri && <Avatar src={imageDataUri} variant="lg" />}
            </div>
          </div>
        </section>

        <DialogFooter className="gap-y-1">
          <DialogClose asChild id="close-update-profile-modal">
            <Button ref={closeModalButtonRef} variant="outline">
              Cancel
            </Button>
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

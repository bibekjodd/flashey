import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateChat } from '@/hooks/mutations/useCreateChat';
import { useUpdateChat } from '@/hooks/mutations/useUpdateChat';
import { imageToDataUri, uploadImage } from '@/lib/image-service';
import { Loader2 } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import SearchMembers from './search-members';
import SelectedMembers from './selected-members';

type Props = { chat: Chat | null; children: React.ReactNode };
export default function CreateOrUpdateChatModal({ chat, children }: Props) {
  const [name, setName] = useState(chat?.name || '');
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const { mutate: updateChat, isPending: isUpdatingChat } = useUpdateChat();
  const { mutate: createChat, isPending: isCreatingChat } = useCreateChat();
  const imagePickerRef = useRef<HTMLInputElement | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const closeChatButtonRef = useRef<any>(null);

  const onImagePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setImageDataUri(null);
      return;
    }
    const result = await imageToDataUri(file);
    setImageDataUri(result || null);
  };

  const selectMember = (user: User) => {
    let isSelected = selectedMembers.find(({ id }) => id === user.id);
    if (isSelected) return;
    isSelected = (chat?.members || []).find(({ id }) => id === user.id);
    if (isSelected) return;
    setSelectedMembers([...selectedMembers, user]);
  };

  const deselectMember = (user: User) => {
    setSelectedMembers((members) => {
      return members.filter((member) => member.id !== user.id);
    });
  };

  const createOrUpdateChat = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if ((chat?.members.length || 0) + selectedMembers.length > 10) {
      toast.error(`Chat can't have more than 10 members`);
      return;
    }

    const imageFile =
      imagePickerRef.current?.files && imagePickerRef.current.files[0];
    const imageUploadPromise = imageFile ? uploadImage(imageFile) : null;

    // create chat
    if (!chat) {
      const members: string[] = selectedMembers.map((member) => member.id);
      createChat(
        { name, members },
        {
          async onSuccess(data) {
            setName('');
            setSelectedMembers([]);
            closeChatButtonRef.current?.click();
            const uploadedImage = await imageUploadPromise;
            if (uploadedImage)
              updateChat({ chatId: data.id, image: uploadedImage });
          },
          onError(err) {
            toast.error(`Could not create group! ${err.message}`);
          }
        }
      );
      return;
    }

    // update chat
    if (name.length < 4) {
      toast.error(`Chat name must be at least 4 letters`);
    }
    const addMembers = selectedMembers.map((member) => member.id);
    updateChat(
      {
        chatId: chat.id,
        addMembers,
        name: name === chat.name ? undefined : name
      },
      {
        async onSuccess(data) {
          closeChatButtonRef.current?.click();
          setSelectedMembers([]);
          const uploadedImage = await imageUploadPromise;
          if (uploadedImage)
            updateChat({ chatId: data.id, image: uploadedImage });
        },
        onError(err) {
          toast.error(`Could not update chat! ${err.message}`);
        }
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            {chat ? 'Update Chat' : 'Create Group'}
          </DialogTitle>
        </DialogHeader>

        <section className="flex flex-col space-y-5">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter chat name..."
            />
          </div>
          <div className="space-y-2">
            <Label>Image</Label>
            <div className="flex items-center space-x-3">
              <Input
                ref={imagePickerRef}
                type="file"
                accept="image/*"
                onChange={onImagePicked}
              />
              {imageDataUri && <Avatar src={imageDataUri} variant="2xl" />}
            </div>
          </div>

          <SelectedMembers
            deselectMember={deselectMember}
            selectedMembers={selectedMembers}
          />

          <SearchMembers
            selectMember={selectMember}
            selectedMembers={[...selectedMembers, ...(chat?.members || [])]}
          />
        </section>

        <DialogFooter className="gap-y-1">
          <DialogClose asChild ref={closeChatButtonRef}>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={isUpdatingChat || isCreatingChat}
            onClick={createOrUpdateChat}
            className="relative"
          >
            <span className={`${isUpdatingChat ? 'opacity-0' : ''}`}>
              {chat ? 'Save Changes' : 'Create Group'}
            </span>
            {isUpdatingChat && (
              <span className="absolute inset-0 grid place-items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

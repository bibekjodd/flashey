import { useProfile } from '@/hooks/queries/useProfile';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { DeleteChatDialog } from '../dialogs/delete-chat.dialog';
import RemoveUserFromChatDialog from '../dialogs/remove-user-from-chat-dialog';
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
import CreateOrUpdateChatModal from './create-update-chat';

type Props = { chat: Chat };
export default function ChatModal({ chat }: Props) {
  const { data: profile } = useProfile();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="ml-auto h-10 px-4">
          <EllipsisVerticalIcon className="h-5 w-5" />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            {chat.name || 'Private Chat'}
          </DialogTitle>
        </DialogHeader>

        {/* members */}
        <section className="h-fit max-h-[300px] space-y-5 overflow-y-auto scrollbar-thin">
          <p className="text-sm font-semibold">Members</p>
          {chat.members.map((member) => {
            const canRemoveMember =
              profile?.id === chat.admin &&
              member.id !== profile.id &&
              chat.members.length > 2;

            return (
              <div key={member.id} className="flex items-center pr-3">
                <Avatar src={member.image} variant="sm" />
                <span className="ml-3 line-clamp-1 text-sm font-medium">
                  {member.name}{' '}
                  {member.id === chat.admin && (
                    <span className="text-xs italic text-gray-500">
                      (admin)
                    </span>
                  )}
                </span>
                {canRemoveMember && (
                  <RemoveUserFromChatDialog
                    chatId={chat.id}
                    userId={member.id}
                  />
                )}
              </div>
            );
          })}
        </section>

        <DialogFooter className="gap-y-1">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          {chat.isGroupChat && chat.admin === profile?.id && (
            <CreateOrUpdateChatModal chat={chat}>
              <Button variant="outline">Update</Button>
            </CreateOrUpdateChatModal>
          )}
          {(!chat.isGroupChat || profile?.id === chat.admin) && (
            <DeleteChatDialog chatId={chat.id} />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

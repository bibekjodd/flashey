import { useProfile } from '@/hooks/queries/userProfile';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
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
import { DeleteChatDialog } from '../dialogs/delete-chat.dialog';

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
        <section className="h-fit max-h-[200px] space-y-3 overflow-y-auto scrollbar-thin">
          <p className="text-sm font-semibold">Members</p>
          {chat.members.map((member) => (
            <div key={member.id} className="flex items-center space-x-3">
              <Avatar src={member.image} variant="sm" />
              <span className="line-clamp-1 text-sm font-medium">
                {member.name}{' '}
                {member.id === chat.admin && (
                  <span className="italic text-gray-700">(admin)</span>
                )}
              </span>
            </div>
          ))}
        </section>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          {(!chat.isGroupChat || profile?.id === chat.admin) && (
            <DeleteChatDialog chatId={chat.id} />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

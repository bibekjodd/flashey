import { useUpdateChat } from '@/hooks/mutations/useUpdateChat';
import { UserRoundMinus } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../ui/alert-dialog';

type Props = { chatId: string; userId: string };

export default function RemoveUserFromChatDialog({ chatId, userId }: Props) {
  const { mutate } = useUpdateChat();

  const removeUser = () => {
    mutate(
      { chatId, removeMembers: [userId] },
      {
        onError(err) {
          toast.error(`Failed to remove user from the chat. ${err.message}`);
        }
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="ml-auto">
          <UserRoundMinus className="h-4 w-4" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will remove this user from the chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={removeUser}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

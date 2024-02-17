import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useDeleteChat } from '@/hooks/mutations/useDeleteChat';
import { Loader2 } from 'lucide-react';

type Props = {
  chatId: string;
};
export function DeleteChatDialog({ chatId }: Props) {
  const { mutate, isPending } = useDeleteChat(chatId);
  const deleteChat = () => {
    mutate(undefined, {
      onSuccess() {
        document.getElementById('close-delete-chat-dialog')?.click();
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Chat</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete entire
            chat history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel id="close-delete-chat-dialog">
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={deleteChat}
            className="relative"
            disabled={isPending}
          >
            <span className={`${isPending ? 'opacity-0' : ''}`}>Continue</span>
            {isPending && (
              <span className="absolute inset-0 grid place-items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </span>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

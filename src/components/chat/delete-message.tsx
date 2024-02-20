import { useDeleteMessage } from '@/hooks/mutations/useDeleteMessage';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction, useRef } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

type Props = {
  message: Message;
  isHovering: boolean;
  setIsPopoverOpen: Dispatch<SetStateAction<boolean>>;
};
export default function DeleteMessage({
  message,
  isHovering,
  setIsPopoverOpen
}: Props) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { mutate } = useDeleteMessage({
    chatId: message.chatId,
    messageId: message.id
  });

  return (
    <Popover onOpenChange={(isOpen) => setIsPopoverOpen(isOpen)}>
      <PopoverTrigger asChild>
        <button>
          <EllipsisVerticalIcon className="h-5 w-5 dark:text-gray-200" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={`h-fit w-fit border-none p-0 ${isHovering ? 'block' : 'lg:hidden'}`}
      >
        <Button onClick={() => mutate()} ref={buttonRef} variant="outline">
          Delete Message
        </Button>
      </PopoverContent>
    </Popover>
  );
}

import { useAddReaction } from '@/hooks/mutations/useAddReaction';
import { useProfile } from '@/hooks/queries/userProfile';
import { emojis, reactions } from '@/lib/constants';
import { FaceSmileIcon } from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

type Props = {
  message: Message;
  isHovering: boolean;
  setIsPopoverOpen: Dispatch<SetStateAction<boolean>>;
};
export default function AddReaction({
  message,
  isHovering,
  setIsPopoverOpen
}: Props) {
  const { data: profile } = useProfile();
  const { mutate } = useAddReaction({
    chatId: message.chatId,
    messageId: message.id
  });
  const addOrRemoveReaction = (reaction: Reaction) => {
    mutate(reaction);
  };
  const myReaction = message.reactions.find(
    (reaction) => reaction?.userId === profile?.id
  );

  return (
    <Popover onOpenChange={(isOpen) => setIsPopoverOpen(isOpen)}>
      <PopoverTrigger id={`reaction-button-${message.id}`} asChild>
        <button>
          <FaceSmileIcon className="h-5 w-5" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className={`h-fit w-fit space-x-2 rounded-full p-2 text-lg ${isHovering ? 'block' : 'lg:hidden'}`}
      >
        {reactions.map((reaction) => (
          <button
            onClick={() => addOrRemoveReaction(reaction)}
            key={reaction}
            className={`transition ease-in hover:scale-125 active:scale-90
             ${myReaction?.reaction === reaction ? 'hidden' : ''}`}
          >
            {emojis[reaction]}
          </button>
        ))}
        {myReaction?.reaction && (
          <button
            onClick={() => addOrRemoveReaction(null)}
            className="inline-flex items-center"
          >
            <span className="text-sm text-gray-800">Remove</span>{' '}
            {emojis[myReaction.reaction]}
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}

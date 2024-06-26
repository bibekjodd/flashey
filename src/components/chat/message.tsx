import { useUser } from '@/hooks/queries/useUser';
import { emojis } from '@/lib/constants';
import { formatRelative } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { memo, useState } from 'react';
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import Avatar from '../ui/avatar';
import AddReaction from './add-reaction';
import DeleteMessage from './delete-message';
// import MessageSeenObserver from './message-seen-observer';

type Props = {
  message: Message;
  profile: User | null | undefined;
};
export const Message = memo(function Component({ message, profile }: Props) {
  const isSent = profile?.id === message.senderId;
  const { data: sender } = useUser(message.senderId);
  const [isHovering, setIsHovering] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const isSeenByOthers =
    message.senderId === profile?.id &&
    message.viewers.find((viewer) => viewer !== profile?.id);

  const isPendingMessage = message.status === 'sending';
  const hasAttribute = isPendingMessage || isSeenByOthers;

  return (
    <div
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`group flex w-full py-2 ${isSent ? 'flex-row-reverse self-end' : 'flex-row self-start'}`}
    >
      {/* <MessageSeenObserver message={message} /> */}
      <Avatar src={sender?.image} isOnline={sender?.id === profile?.id} />
      <div className="w-3" />
      <div
        className={`flex flex-grow flex-col space-y-2 ${isSent ? 'items-end' : 'items-start'}`}
      >
        <div className={`flex items-center space-x-2`}>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {sender?.name}
          </span>
          <span className="text-xs text-gray-400">
            {formatRelative(new Date(message.sentAt), new Date())}
          </span>
        </div>

        <section
          className={`flex w-full max-w-fit ${isSent ? 'flex-row-reverse self-end' : 'flex-row self-start'}`}
        >
          <div className="relative flex-grow">
            {message.image && (
              <img
                src={message.image}
                alt=""
                className="max-h-[40vh] rounded-sm"
                loading="lazy"
                decoding="async"
              />
            )}
            {message.text && (
              <p
                className={`relative whitespace-pre-wrap rounded-3xl px-4 py-2 text-sm 
                ${
                  isSent
                    ? ' rounded-tr-none bg-rose-500 text-white dark:bg-rose-600'
                    : 'rounded-tl-none bg-gray-200/60 text-black dark:bg-gray-200'
                }
                  ${hasAttribute ? 'pr-8' : ''}
                  ${message.image ? 'mt-1' : ''}
                  `}
              >
                {message.text}
                {hasAttribute && (
                  <span className="absolute bottom-2 right-2 flex">
                    {isSeenByOthers && (
                      <IoCheckmarkDoneOutline className="h-4 w-4 text-white" />
                    )}
                    {isPendingMessage && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </span>
                )}
              </p>
            )}
            {message.reactions.length > 0 && (
              <div
                className={`absolute right-3 top-full -m-2 w-fit rounded-full bg-white p-0 text-sm dark:bg-gray-200`}
              >
                {message.reactions.slice(0, 3).map((reaction) => (
                  <span key={reaction?.userId}>
                    {reaction?.reaction && emojis[reaction?.reaction]}
                    {message.reactions.length > 3 && (
                      <span className="pr-1">{message.reactions.length}</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="w-3" />

          {/* reactions and delete message*/}
          <div
            className={`flex items-center py-2 text-gray-700 group-hover:opacity-100 ${isPopoverOpen ? '' : 'lg:opacity-0'} ${isSent ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <AddReaction
              profile={profile}
              message={message}
              isHovering={isHovering}
              setIsPopoverOpen={setIsPopoverOpen}
            />

            <div className="w-3" />
            {message.senderId === profile?.id && (
              <DeleteMessage
                isHovering={isHovering}
                message={message}
                setIsPopoverOpen={setIsPopoverOpen}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
});

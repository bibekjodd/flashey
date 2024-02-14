import { useUser } from '@/hooks/queries/useUser';
import { useProfile } from '@/hooks/queries/userProfile';
import { emojis } from '@/lib/constants';
import { formatRelative } from 'date-fns';
import { memo, useState } from 'react';
import Avatar from '../ui/avatar';
import AddReaction from './add-reaction';
import DeleteMessage from './delete-message';

export const Message = memo(function Component({
  message
}: {
  message: Message;
}) {
  const { data: profile } = useProfile();
  const isSent = profile?.id === message.senderId;
  const { data: sender } = useUser(message.senderId);
  const [isHovering, setIsHovering] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <div
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`group flex w-full py-2 ${isSent ? 'flex-row-reverse self-end' : 'flex-row self-start'}`}
    >
      <Avatar src={sender?.image} isOnline={sender?.id === profile?.id} />
      <div className="w-3" />
      <div
        className={`flex flex-grow flex-col space-y-2 ${isSent ? 'items-end' : 'items-start'}`}
      >
        <div className={`flex items-center space-x-2`}>
          <span className="text-sm font-medium text-gray-700">
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
            {message.text && (
              <p
                className={`whitespace-pre-wrap rounded-full px-4 py-2 text-sm ${isSent ? ' rounded-tr-none bg-rose-500 text-white' : 'rounded-tl-none bg-gray-200/60 text-black'}`}
              >
                {message.text}
              </p>
            )}
            {message.image && <img src={message.image} alt="image" />}
            {message.reactions.length > 0 && (
              <div
                className={`absolute right-3 top-full -m-2 w-fit rounded-full bg-white p-0 text-sm`}
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

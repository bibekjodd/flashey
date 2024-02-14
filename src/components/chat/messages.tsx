import { useMessages } from '@/hooks/queries/useMessages';
import { useUser } from '@/hooks/queries/useUser';
import { useProfile } from '@/hooks/queries/userProfile';
import { formatRelative } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import Avatar from '../ui/avatar';

type Props = { chat: Chat };
export default function Messages({ chat }: Props) {
  const { data } = useMessages(chat.id);
  const messages = data?.pages.flat(1) || [];

  return (
    <section className="flex h-full flex-col-reverse space-y-5 overflow-y-auto bg-neutral-50/30 p-4">
      <AnimatePresence initial={false} mode="popLayout">
        {messages?.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </AnimatePresence>
    </section>
  );
}

function Message({ message }: { message: Message }) {
  const { data: profile } = useProfile();
  const isSent = profile?.id === message.senderId;
  const { data: sender } = useUser(message.senderId);
  return (
    <motion.section
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      style={{
        originX: isSent ? 1 : 0
      }}
      transition={{
        type: 'spring',
        opacity: { duration: 0.2 }
      }}
      className={`flex w-fit max-w-[70%] ${isSent ? 'flex-row-reverse self-end' : 'flex-row self-start'}`}
    >
      <Avatar src={sender?.image} isOnline={sender?.id === profile?.id} />
      <div className="w-3" />
      <div
        className={`flex flex-col space-y-2 ${isSent ? 'items-end' : 'items-start'}`}
      >
        <div className={`flex items-center space-x-2`}>
          <span className="text-sm font-medium text-gray-700">
            {sender?.name}
          </span>
          <span className="text-xs text-gray-400">
            {formatRelative(new Date(message.sentAt), new Date())}
          </span>
        </div>
        <div>
          {message.text && (
            <p
              className={`whitespace-pre-wrap rounded-full px-4 py-2 text-sm ${isSent ? 'bg-rose-500 text-white ' : 'bg-gray-200/60 text-black'}`}
            >
              {message.text}
            </p>
          )}
          {message.image && <img src={message.image} alt="image" />}
        </div>
      </div>
    </motion.section>
  );
}

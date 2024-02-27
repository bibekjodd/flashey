import { useMessages } from '@/hooks/queries/useMessages';
import { useProfile } from '@/hooks/queries/useProfile';
import { AnimatePresence, motion } from 'framer-motion';
import ScrollObserver from '../scroll-observer';
import { Message } from './message';

type Props = { chat: Chat };
export default function Messages({ chat }: Props) {
  const { data: profile } = useProfile();
  const { data, fetchNextPage, isFetching, hasNextPage } = useMessages(chat.id);
  const messages = data?.pages.flat(1) || [];

  return (
    <ul
      id="messages-container"
      className="relative flex h-full w-full flex-col-reverse overflow-x-hidden bg-neutral-50/30 p-4 dark:bg-gray-800/50"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {messages.map((message) => (
          <motion.li
            key={message.id}
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{
              originX: profile?.id === message.senderId ? 1 : 0
            }}
            transition={{
              type: 'spring',
              stiffness: 90,
              opacity: { duration: 0.2 }
            }}
          >
            {message.status === 'failed' || message.status === 'sending' ? (
              <PreventInteractivity>
                <Message message={message} profile={profile} />
              </PreventInteractivity>
            ) : (
              <Message message={message} profile={profile} />
            )}
          </motion.li>
        ))}
      </AnimatePresence>
      <ScrollObserver
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
        hasNextPage={hasNextPage}
      />
    </ul>
  );
}

function PreventInteractivity({ children }: { children: React.ReactNode }) {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="relative opacity-50"
    >
      {children}
    </div>
  );
}

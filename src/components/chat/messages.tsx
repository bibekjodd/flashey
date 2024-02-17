import { useMessages } from '@/hooks/queries/useMessages';
import { useProfile } from '@/hooks/queries/userProfile';
import { AnimatePresence, motion } from 'framer-motion';
import { Message } from './message';

type Props = { chat: Chat };
export default function Messages({ chat }: Props) {
  const { data: profile } = useProfile();
  const { data } = useMessages(chat.id);
  const messages = data?.pages.flat(1) || [];

  return (
    <ul className="flex h-full w-full flex-col-reverse overflow-y-auto overflow-x-hidden bg-neutral-50/30 p-4">
      <AnimatePresence initial={false} mode="popLayout">
        {messages?.map((message) => (
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
            <Message message={message} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

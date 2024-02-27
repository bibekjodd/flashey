import { useMessageSeen } from '@/hooks/mutations/useMessageSeen';
import { useProfile } from '@/hooks/queries/useProfile';
import { useEffect, useRef } from 'react';

type Props = {
  message: Message;
};
export default function MessageSeenObserver({ message }: Props) {
  const { data: profile } = useProfile();
  const isSeenByMe =
    profile?.id === message.senderId ||
    message.viewers.find((viewer) => viewer === profile?.id);

  if (isSeenByMe) return null;
  return Observer({ messageId: message.id, chatId: message.chatId });
}

function Observer({
  messageId,
  chatId
}: {
  messageId: string;
  chatId: string;
}) {
  const observerRef = useRef<HTMLSpanElement | null>(null);
  const { mutate, isPending } = useMessageSeen({ messageId, chatId });

  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.at(0)?.isIntersecting) {
          if (isPending) return;
          mutate();
        }
      },
      { threshold: 1 }
    );
    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [messageId, observerRef, mutate, isPending]);

  return (
    <span ref={observerRef}>
      <span>hi</span>
      <span>hello</span>
    </span>
  );
}

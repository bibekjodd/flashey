import { useMessages } from '@/hooks/queries/useMessages';
import { useProfile } from '@/hooks/queries/useProfile';
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
      {messages.map((message) => (
        <li key={message.id}>
          {message.status === 'failed' || message.status === 'sending' ? (
            <PreventInteractivity>
              <Message message={message} profile={profile} />
            </PreventInteractivity>
          ) : (
            <Message message={message} profile={profile} />
          )}
        </li>
      ))}
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

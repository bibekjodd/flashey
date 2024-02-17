import { useSendMessage } from '@/hooks/mutations/useSendMessage';
import { PaperAirplaneIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { LucideLoader2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

type Props = { chatId: string };
export default function SendMessage({ chatId }: Props) {
  const [text, setText] = useState('');
  const { isPending, mutate } = useSendMessage(chatId);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text) return;
    const textToSend = text;
    setText('');
    mutate(
      { image: undefined, text },
      {
        onError(err) {
          toast.dismiss();
          toast.error(`Could not send message! ${err.message}`);
          setText(textToSend);
        }
      }
    );
  };

  return (
    <section className="sticky bottom-0 left-0 bg-white/90 backdrop-blur-3xl">
      <form
        onSubmit={sendMessage}
        className="flex h-16 items-center space-x-3 border-t-2 border-neutral-200/50 px-4 py-2 md:h-20"
      >
        <input
          type="file"
          id="image-input"
          accept="image/*"
          className="hidden"
        />
        <label htmlFor="image-input">
          <PhotoIcon className="h-6 w-6 text-rose-500" />
        </label>
        <input
          disabled={isPending}
          type="text"
          placeholder="Write a text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="h-10 w-full rounded-full bg-neutral-100 px-5 disabled:opacity-50"
        />
        <button
          disabled={!text || isPending}
          type="submit"
          className="space-x-2 rounded-full bg-rose-500 p-2  text-white disabled:opacity-50"
        >
          {isPending ? (
            <LucideLoader2 className="h-5 w-5 animate-spin text-white" />
          ) : (
            <PaperAirplaneIcon className="h-5 w-5 text-white" />
          )}
        </button>
      </form>
    </section>
  );
}

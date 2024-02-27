import { useSendMessage } from '@/hooks/mutations/useSendMessage';
import { imageToDataUri } from '@/lib/image-service';
import { scrollToBottom } from '@/lib/utils';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { PaperAirplaneIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

type Props = { chatId: string };
export default function SendMessage({ chatId }: Props) {
  const [text, setText] = useState('');
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { mutate, isPending } = useSendMessage(chatId);

  const onImagePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files && e.target.files[0];
    e.target.value = '';
    setImageFile(imageFile);
    if (!imageFile) {
      setImageDataUri(null);
      return;
    }
    const imageDataUri = await imageToDataUri(imageFile);
    setImageDataUri(imageDataUri);
  };

  const unpickImage = () => {
    setImageDataUri('');
    setImageFile(null);
  };

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) {
      toast.loading('Waiting for previous message to be sent');
      return;
    }
    if (!text && !imageFile) {
      return;
    }
    const textToSend = text;
    const imageToSend = imageFile;
    setText('');
    setImageDataUri('');
    setImageFile(null);

    scrollToBottom();
    const tempId = Math.random().toString();
    mutate(
      {
        image: undefined,
        text: textToSend || undefined,
        id: tempId,
        imageFile: imageToSend
      },
      {
        onError(err) {
          toast.dismiss();
          toast.error(`Could not send message! ${err.message}`);
          setText(textToSend);
          setImageFile(imageToSend);
          if (imageToSend) {
            imageToDataUri(imageToSend).then((res) => setImageDataUri(res));
          }
        },
        onSuccess() {
          toast.dismiss();
        }
      }
    );
    scrollToBottom();
  };

  return (
    <section className="sticky bottom-0 left-0 bg-white/90 backdrop-blur-3xl dark:bg-gray-900/50">
      <form
        onSubmit={sendMessage}
        className="relative flex h-16 items-center space-x-3 border-t-2 border-neutral-200/50 px-4 py-2 dark:border-neutral-700/50 md:h-20"
      >
        <input
          type="file"
          id="image-input"
          accept="image/*"
          className="hidden"
          onChange={onImagePicked}
        />
        {imageDataUri && (
          <button
            onClick={unpickImage}
            className="absolute bottom-full mb-2 transition hover:scale-90 hover:brightness-75"
          >
            <div className="relative h-fit w-fit">
              <XMarkIcon className="absolute bottom-full left-full z-50 -m-6 h-6 w-6 bg-black/50 text-gray-400" />
              <img
                src={imageDataUri}
                alt="picked image"
                className="h-40 rounded-sm object-contain"
              />
            </div>
          </button>
        )}
        <label htmlFor="image-input">
          <PhotoIcon className="h-6 w-6 text-rose-500" />
        </label>
        <input
          type="text"
          placeholder="Write a text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="h-10 w-full rounded-full bg-neutral-100 px-5 disabled:opacity-50 dark:bg-gray-700/30"
        />
        <button
          disabled={(!text && !imageDataUri) || isPending}
          type="submit"
          className="relative space-x-2 rounded-full bg-rose-500  p-2 text-white disabled:opacity-50"
        >
          {!isPending ? (
            <PaperAirplaneIcon className={`h-5 w-5 text-white`} />
          ) : (
            <Loader2 className="h-5 w-5 animate-spin" />
          )}
        </button>
      </form>
    </section>
  );
}

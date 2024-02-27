import { backend_url } from '@/lib/constants';
import { uploadImage } from '@/lib/image-service';
import {
  extractErrorMessage,
  onUpdateMessage,
  scrollToBottom
} from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useSendMessage = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['send-message', chatId],
    mutationFn: (data: Data) => sendMessage(chatId, data),

    onError() {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onSuccess(message) {
      onUpdateMessage({ message, queryClient, onUpdateChat: true });
      scrollToBottom();
      return;
    }
  });
};

type Data = {
  id: string;
  image?: string | null;
  text?: string | null;
  imageFile: File | null;
};
const sendMessage = async (chatId: string, data: Data): Promise<Message> => {
  try {
    const imageUrl = data.imageFile
      ? await uploadImage(data.imageFile)
      : undefined;
    const res = await axios.post(
      `${backend_url}/api/message/${chatId}`,
      { ...data, id: undefined, image: imageUrl },
      {
        withCredentials: true
      }
    );
    return res.data.message;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

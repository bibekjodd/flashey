import { backend_url } from '@/lib/constants';
import { extractErrorMessage, updateMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useSendMessage = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['send-message', chatId],
    mutationFn: (data: Data) => sendMessage(chatId, data),
    onError() {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
    },
    onSuccess(message) {
      if (!message) return;
      updateMessage({ message, queryClient, updateChat: true });
    }
  });
};

type Data = {
  image?: string | null;
  text?: string | null;
};
const sendMessage = async (chatId: string, data: Data): Promise<Message> => {
  try {
    const res = await axios.post(`${backend_url}/api/message/${chatId}`, data, {
      withCredentials: true
    });
    return res.data.message;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

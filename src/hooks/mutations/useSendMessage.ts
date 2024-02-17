import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useProfile } from '../queries/userProfile';

export const useSendMessage = (chatId: string) => {
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();

  return useMutation({
    mutationKey: ['send-message', chatId],
    mutationFn: (data: Data) => sendMessage(chatId, data),
    onError() {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
    },
    onSuccess(message) {
      if (!message) return;
      queryClient.setQueryData(
        ['messages', chatId],
        (
          data: null | { pages: Message[][]; pageParams: number[] }
        ): typeof data => {
          if (!data) return null;
          const [firstPage, ...restPages] = data.pages;
          return {
            ...data,
            pages: [[message, ...(firstPage || [])], ...restPages]
          };
        }
      );

      queryClient.setQueryData(['chat', chatId], (data: Chat): Chat => {
        return {
          ...data,
          lastMessage: {
            sender: profile?.name!,
            message: message.text || 'sent an image',
            senderId: profile?.id!
          }
        };
      });
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

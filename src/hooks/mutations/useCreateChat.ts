import { backend_url } from '@/lib/constants';
import { extractErrorMessage, onUpdateChat } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useCreateChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-group'],
    mutationFn: createChat,
    onSuccess(chat) {
      onUpdateChat({ queryClient, chat });
    }
  });
};

type Options = {
  name: string;
  members: string[];
};
const createChat = async (options: Options): Promise<Chat> => {
  try {
    const { data } = await axios.post(`${backend_url}/api/chat`, options, {
      withCredentials: true
    });
    return data.chat;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

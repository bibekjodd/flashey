import { backend_url } from '@/lib/constants';
import { extractErrorMessage, updateChat } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-group'],
    mutationFn: createGroup,
    onSuccess(chat) {
      updateChat({ queryClient, chat });
    }
  });
};

type Options = {
  name: string;
  members: string[];
};
const createGroup = async (options: Options): Promise<Chat> => {
  try {
    const { data } = await axios.post(`${backend_url}/api/group`, options, {
      withCredentials: true
    });
    return data.chat;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

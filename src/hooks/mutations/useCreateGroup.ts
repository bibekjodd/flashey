import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import {
  InfiniteData,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import axios from 'axios';

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['create-group'],
    mutationFn: createGroup,
    onSuccess(chat) {
      queryClient.setQueryData(
        ['chats'],
        (data: InfiniteData<Chat[]>): typeof data => {
          if (!data) return data;
          const [firstPage, ...restPages] = data.pages;
          return {
            ...data,
            pages: [[chat, ...firstPage], ...restPages]
          };
        }
      );
    }
  });
};

type Options = {
  title: string;
  participants: string[];
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

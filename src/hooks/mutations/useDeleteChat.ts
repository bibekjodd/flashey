import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import {
  InfiniteData,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const useDeleteChat = (chatId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ['delete-chat', chatId],
    mutationFn: () => deleteChat(chatId),
    onSuccess() {
      router.replace('/');

      queryClient.setQueryData(['chat', chatId], null);
      queryClient.setQueryData(['messages', chatId], null);
      const oldChatsData = queryClient.getQueryData<
        InfiniteData<Chat[]> | undefined
      >(['chats']) || { pages: [], pageParams: [] };
      const updatedChats = oldChatsData.pages.map((page) =>
        page.filter((chat) => chat.id !== chatId)
      );
      queryClient.setQueryData<InfiniteData<Chat[]>>(['chats'], {
        ...oldChatsData,
        pages: updatedChats
      });
    }
  });
};

const deleteChat = async (chatId: string) => {
  try {
    return axios.delete(`${backend_url}/api/chat/${chatId}`, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { InfiniteData, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useChat = (chatId: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => fetchChat(chatId),
    initialData(): Chat | undefined {
      const chatsData = queryClient.getQueryData<
        InfiniteData<Chat[]> | undefined
      >(['chats']);
      if (!chatsData) return undefined;
      const allChats = chatsData.pages.flat(1);
      const chat = allChats.find((chat) => chat.id === chatId);
      return chat || undefined;
    }
  });
};

export const fetchChat = async (chatId: string): Promise<Chat> => {
  try {
    const url = `${backend_url}/api/chat/${chatId}`;
    const { data } = await axios.get(url, { withCredentials: true });
    return data.chat;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

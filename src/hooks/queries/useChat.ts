import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { InfiniteData, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useChat = (chatId: string, isGroupChat: boolean | undefined) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => fetchChat(chatId, isGroupChat || false),
    initialData(): Chat | undefined {
      const chatsData = queryClient.getQueryData(['chats']) as
        | InfiniteData<Chat[]>
        | undefined;
      if (!chatsData) return undefined;
      const allChats = chatsData.pages.flat(1);
      const chat = allChats.find((chat) => chat.id === chatId);
      return chat || undefined;
    }
  });
};

export const fetchChat = async (
  chatId: string,
  isGroupChat: boolean
): Promise<Chat> => {
  try {
    let url = `${backend_url}/api/chat`;
    if (isGroupChat) url += `/group/${chatId}`;
    else url += `/friend/${chatId}`;
    const { data } = await axios.get(url, { withCredentials: true });
    return data.chat;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

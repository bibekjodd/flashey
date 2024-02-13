import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useChat = (chatId: string, isGroupChat: boolean) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => fetchChat(chatId, isGroupChat),
    initialData() {
      const allChats = queryClient.getQueryData(['chats']) as
        | { pages: Chat[][] }
        | undefined;

      if (allChats) {
        for (const page of allChats.pages) {
          const chat = page.find((chat) => chat.id === chatId);
          if (chat) return chat;
        }
      }

      return undefined;
    }
  });
};

const fetchChat = async (
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

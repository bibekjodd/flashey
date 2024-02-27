import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useMessages = (chatId: string) => {
  return useInfiniteQuery({
    queryKey: ['messages', chatId],
    queryFn: ({ pageParam }) => fetchMessages(chatId, pageParam),
    initialPageParam: new Date().toISOString(),

    getNextPageParam(lastPage) {
      if (!lastPage) return new Date().toISOString();
      const cursor = lastPage.at(lastPage.length - 1)?.sentAt || undefined;
      return cursor;
    }
  });
};

const fetchMessages = async (
  chatId: string,
  cursor: string
): Promise<Message[]> => {
  try {
    const { data } = await axios.get(
      `${backend_url}/api/messages/${chatId}?cursor=${cursor}`,
      {
        withCredentials: true
      }
    );
    return data.messages;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

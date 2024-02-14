import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useMessages = (chatId: string) => {
  return useInfiniteQuery({
    queryKey: ['messages', chatId],
    queryFn: ({ pageParam }) => fetchMessages(chatId, pageParam),
    initialPageParam: 1,
    getNextPageParam(lastPage, allPages, lastPageParam) {
      if (!lastPage || lastPage.length < 10) return undefined;
      return lastPageParam + 1;
    }
  });
};

const fetchMessages = async (
  chatId: string,
  page: number | string
): Promise<Message[]> => {
  try {
    const { data } = await axios.get(
      `${backend_url}/api/messages/${chatId}?page=${page}`,
      {
        withCredentials: true
      }
    );
    return data.messages;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

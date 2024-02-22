import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useChats = () => {
  return useInfiniteQuery({
    queryKey: ['chats'],
    queryFn: ({ pageParam }) => fetchChats(pageParam),
    initialPageParam: new Date().toISOString(),
    getNextPageParam(lastPage) {
      const cursor = lastPage[lastPage.length - 1]?.updatedAt;
      return cursor || undefined;
    }
  });
};

const fetchChats = async (cursor: string): Promise<Chat[]> => {
  try {
    const { data } = await axios.get(
      `${backend_url}/api/chats?cursor=${cursor}&limit=10`,
      {
        withCredentials: true
      }
    );
    return data.chats;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

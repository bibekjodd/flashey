import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useChats = () => {
  return useInfiniteQuery({
    queryKey: ['chats'],
    queryFn: ({ pageParam }) => fetchChats(pageParam),
    initialPageParam: 1,
    getNextPageParam(lastPage, allPages, lastPageParam) {
      if (!lastPage || lastPage.length < 10) return undefined;
      return lastPageParam + 1;
    }
  });
};

const fetchChats = async (page: number): Promise<Chat[]> => {
  try {
    const { data } = await axios.get(`${backend_url}/api/chats?page=${page}`, {
      withCredentials: true
    });
    return data.chats;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

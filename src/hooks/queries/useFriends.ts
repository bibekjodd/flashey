import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useFriends = () => {
  return useInfiniteQuery({
    queryKey: ['friends'],
    queryFn: ({ pageParam }) => fetchFriends(pageParam),
    initialPageParam: 1,
    getNextPageParam(lastPage, allPages, lastPageParam) {
      if (lastPage.length > 10) return lastPageParam + 1;
      return undefined;
    }
  });
};

const fetchFriends = async (page: number): Promise<User[]> => {
  try {
    const { data } = await axios.get(
      `${backend_url}/api/friends?page=${page}&page_size=10`,
      {
        withCredentials: true
      }
    );
    return data.friends;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useFriends = () => {
  return useInfiniteQuery({
    queryKey: ['friends'],
    queryFn: fetchFriends,
    initialPageParam: 1,
    getNextPageParam(lastPage, allPages, lastPageParam) {
      if (lastPage.length) return lastPageParam + 1;
      return undefined;
    }
  });
};

const fetchFriends = async (): Promise<User[]> => {
  try {
    const { data } = await axios.get(`${backend_url}/api/friends`, {
      withCredentials: true
    });
    return data.friends;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

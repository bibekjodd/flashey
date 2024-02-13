import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useSearch = (query: string, enabled = true) => {
  return useInfiniteQuery({
    queryKey: ['search', query],
    queryFn: () => searchQuery({ q: query }),
    initialPageParam: 1,
    getNextPageParam(lastPage, allPages, lastPageParam) {
      if (!lastPage || lastPage.length < 10) return undefined;
      return lastPageParam + 1;
    },
    enabled: enabled && !!query
  });
};

type Options = {
  q: string;
  page?: string | number;
  page_size?: string | number;
};
const searchQuery = async ({
  q,
  page,
  page_size
}: Options): Promise<User[]> => {
  try {
    page = page || '';
    page_size = page_size || '';
    const { data } = await axios.get(
      `${backend_url}/api/search?q=${q}&page=${page}&page_size=${page_size}`,
      { withCredentials: true }
    );
    return data.users;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

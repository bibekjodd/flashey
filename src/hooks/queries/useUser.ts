import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { InfiniteData, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useUser = (userId: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    initialData() {
      const chatsData = queryClient.getQueryData<
        InfiniteData<Chat[]> | undefined
      >(['chats']) || { pages: [], pageParams: [] };
      const chats = chatsData.pages.flat(1);
      for (const chat of chats) {
        const user = chat.members.find((user) => user.id === userId);
        if (user) return user;
      }

      const usersData = queryClient.getQueryData<
        InfiniteData<User[]> | undefined
      >(['friends']) || { pages: [], pageParams: [] };
      const users = usersData.pages.flat(1);
      const user = users.find(({ id }) => id === userId);
      return user || undefined;
    }
  });
};

const fetchUser = async (userId: string): Promise<User> => {
  try {
    const { data } = await axios.get(`${backend_url}/api/user/${userId}`, {
      withCredentials: true
    });
    return data.user;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

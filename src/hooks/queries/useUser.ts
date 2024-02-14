import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useUser = (userId: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    initialData() {
      const data = queryClient.getQueryData(['chats']) as
        | undefined
        | { pages: Chat[][] };
      if (!data) return undefined;
      const allChats = data.pages.flat(1) || [];
      for (const chat of allChats) {
        const user = chat.participants.find((user) => user.id === userId);
        if (user) {
          return user;
        }
      }

      return undefined;
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

import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const useUserMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ['mutate-user'],
    mutationFn: mutateUser,
    onMutate() {
      router.replace('/');
    },
    onSuccess(user, { type, data }) {
      queryClient.setQueryData(['profile'], user);
      if (type === 'update-profile' && !user) {
        queryClient.setQueryData(
          ['profile'],
          (oldData: User | null): User | null => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              name: data.name || oldData.name,
              image: data.image || oldData.image
            };
          }
        );
      }
    }
  });
};
type LoginOptions = {
  type: 'login';
  data: {
    email: string;
    password: string;
  };
};

type RegisterOptions = {
  type: 'register';
  data: {
    name: string;
    email: string;
    password: string;
    image?: string;
  };
};

type UpdateProfileOptions = {
  type: 'update-profile';
  data: {
    name?: string;
    image?: string;
  };
};

type DeleteProfileOptions = {
  type: 'delete-profile';
  data?: undefined;
};

type LogoutUserOptions = {
  type: 'logout';
  data?: undefined;
};

export type MutateUserOptions =
  | LoginOptions
  | RegisterOptions
  | UpdateProfileOptions
  | DeleteProfileOptions
  | LogoutUserOptions;

const mutateUser = async (options: MutateUserOptions): Promise<User | null> => {
  const { type, data } = options;
  try {
    if (type === 'login') {
      const res = await axios.post(`${backend_url}/api/login`, data, {
        withCredentials: true
      });
      return res.data.user;
    } else if (type === 'register') {
      const res = await axios.post(`${backend_url}/api/register`, data, {
        withCredentials: true
      });
      return res.data.user;
    } else if (type === 'update-profile') {
      const res = await axios.put(`${backend_url}/api/profile`, data, {
        withCredentials: true
      });
      return res.data.user;
    } else if (type === 'delete-profile') {
      await axios.delete(`${backend_url}/api/profile`, {
        withCredentials: true
      });
    } else if (type === 'logout') {
      await axios.get(`${backend_url}/api/logout`, { withCredentials: true });
    }
    return null;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });
};

const fetchProfile = async (): Promise<User> => {
  try {
    const { data } = await axios.get(`${backend_url}/api/profile`, {
      withCredentials: true
    });
    return data.user;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

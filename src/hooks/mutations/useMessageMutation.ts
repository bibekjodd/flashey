import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useMessageMutation = (messageId: string) => {
  return useMutation({
    mutationKey: ['mutate-message', messageId],
    mutationFn: mutateMessage
  });
};

type EditMessage = {
  type: 'edit-message';
  messageId: string;
  data: {
    image?: string | null;
    text?: string | null;
  };
};
type DeleteMessage = {
  messageId: string;
  type: 'delete-message';
  data?: undefined;
};
type MutationOptions = EditMessage | DeleteMessage;
const mutateMessage = async (options: MutationOptions) => {
  try {
    if (options.type === 'edit-message') {
      return axios.put(
        `${backend_url}/api/message/${options.messageId}`,
        options.data,
        { withCredentials: true }
      );
    }
    if (options.type === 'delete-message') {
      return axios.delete(`${backend_url}/api/message/${options.messageId}`, {
        withCredentials: true
      });
    }
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

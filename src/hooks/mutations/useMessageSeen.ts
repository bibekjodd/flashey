import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import {
  InfiniteData,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import axios from 'axios';
import { useProfile } from '../queries/useProfile';

export const useMessageSeen = ({
  messageId,
  chatId
}: {
  messageId: string;
  chatId: string;
}) => {
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();

  return useMutation({
    mutationKey: ['message-seen', chatId],
    mutationFn: async () => {
      return 'hi';
      return updateOnServer(messageId);
    },
    async onMutate() {
      return;
      const oldMessagesData = queryClient.getQueryData<
        InfiniteData<Message[]> | undefined
      >(['messages', chatId]) || { pages: [], pageParams: [] };
      const updatedMessages: Message[][] = oldMessagesData.pages.map((page) =>
        page.map((message) => {
          if (message.id !== messageId) return message;
          const updatedViewers = message.viewers.filter(
            (viewer) => viewer !== profile?.id
          );
          updatedViewers.push(profile?.id!);
          return { ...message, viewers: updatedViewers };
        })
      );

      queryClient.setQueryData<InfiniteData<Message[]>>(['messages', chatId], {
        ...oldMessagesData,
        pages: updatedMessages
      });
    }
  });
};

const updateOnServer = async (messageId: string) => {
  try {
    return axios.put(
      `${backend_url}/api/seen/${messageId}`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import {
  InfiniteData,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import axios from 'axios';

export const useDeleteMessage = ({
  chatId,
  messageId
}: {
  chatId: string;
  messageId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-message', messageId],
    mutationFn: () => deleteMessage(messageId),
    onMutate(): InfiniteData<Message[]> {
      // optimistic update
      const oldMessagesData = queryClient.getQueryData([
        'messages',
        chatId
      ]) as InfiniteData<Message[]>;
      if (!oldMessagesData) return oldMessagesData;

      const updatedMessages: Message[][] = oldMessagesData.pages.map(
        (messages) => {
          return messages.filter((message) => message.id !== messageId);
        }
      );
      queryClient.setQueryData(['messages', chatId], {
        ...oldMessagesData,
        pages: updatedMessages
      });

      return oldMessagesData;
    },
    onSuccess() {
      queryClient.setQueryData(
        ['chat', chatId],
        (data: Chat): Chat => ({ ...data, lastMessage: null })
      );
    },
    onError(err, variables, oldMessagesData) {
      queryClient.setQueryData(['messages', chatId], oldMessagesData);
    }
  });
};

const deleteMessage = async (messageId: string) => {
  try {
    await axios.delete(`${backend_url}/api/message/${messageId}`, {
      withCredentials: true
    });
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

import { backend_url } from '@/lib/constants';
import { extractErrorMessage, onUpdateChat } from '@/lib/utils';
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
      const oldMessagesData = queryClient.getQueryData<
        InfiniteData<Message[]> | undefined
      >(['messages', chatId]) || { pages: [], pageParams: [] };

      const updatedMessages: Message[][] = oldMessagesData.pages.map(
        (messages) => messages.filter((message) => message.id !== messageId)
      );
      queryClient.setQueryData(['messages', chatId], {
        ...oldMessagesData,
        pages: updatedMessages
      });
      return oldMessagesData;
    },
    onSuccess() {
      const chat = queryClient.getQueryData<Chat | undefined>(['chat', chatId]);
      if (chat) {
        const updatedChat: Chat = {
          ...chat,
          updatedAt: new Date().toISOString(),
          lastMessage: null
        };
        onUpdateChat({ queryClient, chat: updatedChat });
      }
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

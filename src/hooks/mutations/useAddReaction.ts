import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import {
  InfiniteData,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import axios from 'axios';
import { useProfile } from '../queries/userProfile';

export const useAddReaction = ({
  messageId,
  chatId
}: {
  messageId: string;
  chatId: string;
}) => {
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['reaction', messageId],
    mutationFn: (reaction: Reaction) => addReaction(messageId, reaction),
    onMutate(userReaction): InfiniteData<Message[]> {
      // optimistic update
      document.getElementById(`reaction-button-${messageId}`)?.click();
      const oldMessagesData = queryClient.getQueryData([
        'messages',
        chatId
      ]) as InfiniteData<Message[]>;
      if (!oldMessagesData || !profile) return oldMessagesData;

      const updatedPages: Message[][] = { ...oldMessagesData }.pages.map(
        (page) => {
          return page.map((message) => {
            if (messageId !== message.id) return message;
            message.reactions = message.reactions.filter(
              (reaction) => reaction?.userId !== profile.id
            );
            if (userReaction) {
              message.reactions.push({
                reaction: userReaction,
                userId: profile.id
              });
            }
            return message;
          });
        }
      );

      queryClient.setQueryData(['messages', chatId], {
        ...oldMessagesData,
        pages: updatedPages
      });
      return oldMessagesData;
    },
    onError(err, variables, oldMessagesData) {
      queryClient.setQueryData(['messages', chatId], oldMessagesData);
    }
  });
};

const addReaction = async (messageId: string, reaction: Reaction | null) => {
  try {
    await axios.put(
      `${backend_url}/api/reaction/${messageId}`,
      { reaction },
      { withCredentials: true }
    );
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

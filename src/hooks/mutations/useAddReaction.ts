import { backend_url } from '@/lib/constants';
import { extractErrorMessage, updateMessage } from '@/lib/utils';
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
      const oldMessagesData = queryClient.getQueryData<
        InfiniteData<Message[]> | undefined
      >(['messages', chatId]) || { pages: [], pageParams: [] };

      const message = oldMessagesData.pages
        .flat(1)
        .find((message) => message.id === messageId);
      if (message) {
        const reactions = message.reactions.filter(
          (reaction) => reaction.userId !== profile?.id
        );
        if (userReaction) {
          reactions.push({ userId: profile?.id!, reaction: userReaction });
        }
        const updatedMessage = { ...message, reactions };
        updateMessage({
          message: updatedMessage,
          queryClient,
          updateChat: !!userReaction
        });
      }
      return oldMessagesData;
    },
    onError(err, variables, oldMessagesData) {
      queryClient.setQueryData<InfiniteData<Message[]>>(
        ['messages', chatId],
        oldMessagesData
      );
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

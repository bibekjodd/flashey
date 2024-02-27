import { backend_url } from '@/lib/constants';
import { imageToDataUri, uploadImage } from '@/lib/image-service';
import { extractErrorMessage, onUpdateChat, scrollToBottom } from '@/lib/utils';
import {
  InfiniteData,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import axios from 'axios';
import { useProfile } from '../queries/useProfile';

export const useSendMessage = (chatId: string) => {
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();

  return useMutation({
    mutationKey: ['send-message', chatId],
    mutationFn: (data: Data) => sendMessage(chatId, data),
    async onMutate({ id, text, imageFile }) {
      const image = imageFile ? await imageToDataUri(imageFile) : null;
      const optimisticMessage: Message = {
        id,
        text: text || null,
        image: image,
        chatId,
        isEdited: false,
        reactions: [],
        senderId: profile?.id!,
        sentAt: new Date().toISOString(),
        totalReactions: 0,
        totalViews: 0,
        viewers: [],
        status: 'sending'
      };

      const oldMessagesData = queryClient.getQueryData<InfiniteData<Message[]>>(
        ['messages', chatId]
      ) || { pages: [], pageParams: [] };
      const [firstPage, ...restPages] = oldMessagesData.pages;
      queryClient.setQueryData<InfiniteData<Message[]>>(['messages', chatId], {
        ...oldMessagesData,
        pages: [[optimisticMessage, ...(firstPage || [])], ...restPages]
      });
    },
    onError() {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onSuccess(message, optimisticMessage) {
      // replace the optimistic message
      const messagesData = queryClient.getQueryData<InfiniteData<Message[]>>([
        'messages',
        chatId
      ]) || { pages: [], pageParams: [] };
      const updatedMessages = messagesData.pages.map((page) =>
        page.map((currentMessage) => {
          if (currentMessage.id !== optimisticMessage.id) return currentMessage;
          return { ...message, status: undefined };
        })
      );
      queryClient.setQueryData<InfiniteData<Message[]>>(['messages', chatId], {
        ...messagesData,
        pages: updatedMessages
      });

      const chat = queryClient.getQueryData<Chat>(['chat', chatId]);
      if (!chat) return;
      const lastMessage: Chat['lastMessage'] = {
        message: message.text || 'sent an image',
        sender: profile?.name!,
        senderId: profile?.id!
      };
      const updatedChat: Chat = {
        ...chat,
        lastMessage,
        updatedAt: new Date().toISOString()
      };
      onUpdateChat({ queryClient, chat: updatedChat });
      scrollToBottom();
    }
  });
};

type Data = {
  id: string;
  image?: string | null;
  text?: string | null;
  imageFile: File | null;
};
const sendMessage = async (chatId: string, data: Data): Promise<Message> => {
  try {
    const imageUrl = data.imageFile
      ? await uploadImage(data.imageFile)
      : undefined;
    const res = await axios.post(
      `${backend_url}/api/message/${chatId}`,
      { ...data, id: undefined, image: imageUrl },
      {
        withCredentials: true
      }
    );
    return res.data.message;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

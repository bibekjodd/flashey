import { backend_url } from '@/lib/constants';
import { extractErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useUpdateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-chat'],
    mutationFn: onUpdateChat,

    onMutate(data) {
      const chat = queryClient.getQueryData<Chat>(['chat', data.chatId]);
      if (!chat) return null;

      const chatMembers = chat.members.filter(
        (member) => !data.removeMembers?.includes(member.id)
      );
      const updatedChat: Chat = {
        ...chat,
        name: data.name || chat.name,
        image: data.image || chat.image,
        members: chatMembers
      };
      queryClient.setQueryData<Chat>(['chat', data.chatId], updatedChat);
      return chat;
    },

    onSuccess(chat) {
      if (!chat) return;
      queryClient.setQueryData<Chat>(['chat', chat.id], chat);
    },

    onError(err, vars, chat) {
      if (!chat) return;
      queryClient.setQueryData<Chat>(['chat', chat.id], { ...chat });
      queryClient.invalidateQueries({ queryKey: ['chat', chat.id] });
    }
  });
};

type Options = {
  chatId: string;
  name?: string;
  image?: string | null;
  addMembers?: string[];
  removeMembers?: string[];
};
const onUpdateChat = async (data: Options): Promise<Chat> => {
  try {
    const res = await axios.put(
      `${backend_url}/api/chat/${data.chatId}`,
      data,
      {
        withCredentials: true
      }
    );
    return res.data.chat;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

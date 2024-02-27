import { InfiniteData, QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { dummyGroupImage, dummyUserImage } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractErrorMessage = (err: unknown): string => {
  if (err instanceof AxiosError) {
    return err.response?.data.message || err.message;
  } else if (err instanceof Error) {
    return err.message;
  }
  return 'Unknown error occurred!';
};

export const scrollToBottom = () => {
  const messagesContainer = document.getElementById('messages-container');
  if (messagesContainer) {
    const { scrollTop } = messagesContainer;
    if (scrollTop > -300)
      messagesContainer.scroll({ behavior: 'smooth', top: 0 });
  }
};

export const wait = (timeout?: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res('ok');
    }, timeout || 1000);
  });
};

export const getChatTitle = (
  chat: Chat,
  userId: string | undefined | null
): string => {
  if (chat.isGroupChat) return chat.name || 'Group Chat';
  const otherUser = chat.members.find((member) => member.id !== userId);
  return otherUser?.name || 'Chat';
};

export const getChatImage = (
  chat: Chat,
  userId: string | undefined | null
): string => {
  if (chat.isGroupChat) return chat.image || dummyGroupImage;
  const otherUser = chat.members.find((member) => member.id !== userId);
  return otherUser?.image || dummyUserImage;
};

export const onUpdateChat = ({
  queryClient,
  chat
}: {
  queryClient: QueryClient;
  chat: Chat;
}) => {
  const oldChatsData = queryClient.getQueryData<
    InfiniteData<Chat[]> | undefined
  >(['chats']) || { pages: [], pageParams: [] };
  queryClient.setQueryData<Chat>(['chat', chat.id], { ...chat });

  const filteredChats = oldChatsData.pages.map((page) =>
    page.filter(({ id }) => id !== chat.id)
  );
  const [firstPage, ...restPages] = filteredChats;
  queryClient.setQueryData<InfiniteData<Chat[]>>(['chats'], {
    ...oldChatsData,
    pages: [[chat, ...(firstPage || [])], ...restPages]
  });
};

export const onUpdateMessage = ({
  message,
  queryClient,
  onUpdateChat: shouldUpdateChat
}: {
  message: Message;
  queryClient: QueryClient;
  onUpdateChat?: boolean;
}) => {
  const oldMessagesData = queryClient.getQueryData<
    InfiniteData<Message[]> | undefined
  >(['messages', message.chatId]) || { pages: [], pageParams: [] };

  let messageExists = false;
  const updatedMessages: Message[][] = oldMessagesData.pages.map((page) =>
    page.map((data) => {
      if (data.id !== message.id) return data;
      messageExists = true;
      return { ...message };
    })
  );
  if (messageExists) {
    queryClient.setQueryData<InfiniteData<Message[]>>(
      ['messages', message.chatId],
      { ...oldMessagesData, pages: updatedMessages }
    );
  } else {
    const [firstPage, ...restPages] = oldMessagesData.pages;
    queryClient.setQueryData<InfiniteData<Message[]>>(
      ['messages', message.chatId],
      {
        ...oldMessagesData,
        pages: [[message, ...(firstPage || [])], ...restPages]
      }
    );
  }
  if (!shouldUpdateChat) return;

  const chat = queryClient.getQueryData<Chat | undefined>([
    'chat',
    message.chatId
  ]);
  if (chat) {
    const updatedChat: Chat = {
      ...chat,
      updatedAt: new Date().toISOString()
    };
    onUpdateChat({ queryClient, chat: updatedChat });
  }
};

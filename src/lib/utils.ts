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
  if (chat.isGroupChat) return chat.title || 'Group Chat';
  const otherUser = chat.participants.find(
    (participant) => participant.id !== userId
  );
  return otherUser?.name || 'Chat';
};

export const getChatImage = (
  chat: Chat,
  userId: string | undefined | null
): string => {
  if (chat.isGroupChat) return chat.image || dummyGroupImage;
  const otherUser = chat.participants.find(
    (participant) => participant.id !== userId
  );
  return otherUser?.image || dummyUserImage;
};

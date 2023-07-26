import { dummyUserImage } from "./constants";

export const getChatName = (chat: Chat | null, user: User | null): string => {
  if (chat?.name) return chat?.name;

  const otherUser = chat?.users.find((chatUser) => chatUser._id !== user?._id);
  return otherUser?.name || "";
};

export const isGroupAdmin = (chat: Chat | null, user: User | null): boolean => {
  if (!chat || !user) return false;

  return chat.groupAdmin === user._id;
};

export const getChatImage = (chat: Chat | null, user: User | null): string => {
  const otherUser = chat?.users.find((chatUser) => chatUser._id !== user?._id);
  return otherUser?.picture?.url || dummyUserImage;
};

const sortMessages = (messages: Message[]): Message[] => {
  messages.sort((a, b) => {
    if (a.updatedAt < b.updatedAt) return 1;
    else if (a.updatedAt > b.updatedAt) return -1;
    return 0;
  });

  return messages;
};

const filterMessages = (messages: Message[]): Message[] => {
  const includedMessages: string[] = [];
  messages = messages.filter((message) => {
    if (includedMessages.includes(message._id)) {
      return false;
    }
    includedMessages.push(message._id);
    return true;
  });
  return messages;
};

const sortChat = (chats: Chat[]): Chat[] => {
  chats.sort((a, b) => {
    if (a.updatedAt < b.updatedAt) return 1;
    else if (a.updatedAt > b.updatedAt) return -1;
    return 0;
  });

  chats.map((chat) => ({
    ...chat,
    messages: filterMessages(sortMessages(chat.messages || [])),
  }));

  return chats;
};

const filterChat = (chats: Chat[]): Chat[] => {
  const includedChat: string[] = [];
  chats = chats.filter((chat) => {
    if (includedChat.includes(chat._id)) return false;

    includedChat.push(chat._id);
    return true;
  });

  return chats;
};

export const prepareChat = (chats: Chat[]): Chat[] => {
  return sortChat(filterChat(chats));
};

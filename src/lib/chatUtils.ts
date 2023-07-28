import { dummyGroupImage, dummyUserImage } from "./constants";

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
  if (chat?.isGroupChat) {
    return chat?.image?.url || dummyGroupImage;
  }
  if (chat?.image?.url) return chat.image.url;
  const otherUser = chat?.users.find((chatUser) => chatUser._id !== user?._id);
  return otherUser?.picture?.url || dummyUserImage;
};

const sortMessages = (messages: Message[]): Message[] => {
  messages.sort((a, b) => {
    if (a.createdAt < b.createdAt) return 1;
    else if (a.createdAt > b.createdAt) return -1;
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
  chats = formatMessages(chats);
  chats = filterChat(chats);
  chats = sortChat(chats);
  return chats;
};

function populateUser(chat: Chat, userId: string | User): User | undefined {
  if (typeof userId === "string") {
    const foundUser = chat.users.find((user) => user._id === userId);
    return foundUser;
  }
  return undefined;
}

function formatMessages(chats: Chat[]): Chat[] {
  chats = chats.map((chat) => {
    chat.messages = chat.messages?.map((message) => {
      // populate viewers
      message.viewers = message.viewers?.map((viewer) => {
        viewer = populateUser(chat, viewer) || viewer;
        return viewer;
      });

      // populate sender
      message.sender = populateUser(chat, message.sender) || message.sender;

      // populate reaction
      message.reactions = message.reactions?.map((reaction) => {
        reaction = {
          ...reaction,
          user: populateUser(chat, reaction.user) || reaction.user,
        };
        return reaction;
      });

      return message;
    });

    return chat;
  });
  return chats;
}

export const updateChatOnMessageArrived = (
  chats: Chat[],
  chatId: string,
  message: Message
): Chat[] => {
  chats = chats.map((chat) => {
    if (chat._id !== chatId) return chat;

    chat.messages = chat.messages || [];
    chat.messages.unshift(message);
    return chat;
  });
  return chats;
};

export const updateChatOnReactionAdded = ({
  chatId,
  chats,
  messageId,
  reaction,
}: ReactionAdded & { chats: Chat[] }): Chat[] => {
  chats = chats.map((chat) => {
    if (chat._id === chatId) {
      chat.messages = chat.messages?.map((message) => {
        if (message._id === messageId) {
          message.reactions = message.reactions?.filter((currentReaction) => {
            return currentReaction.user._id !== reaction.userId;
          });

          const user = populateUser(chat, reaction.userId);
          if (user) {
            message.reactions?.push({ user, value: reaction.value });
          }
        }

        return message;
      });
    }

    return chat;
  });

  return chats;
};

export function updateChatOnMessageViewed({
  chatId,
  chats,
  messageId,
  viewerId,
}: MessageViewed & { chats: Chat[] }): Chat[] {
  chats = chats.map((chat) => {
    if (chat._id === chatId) {
      chat.messages = chat.messages?.map((message) => {
        if (message._id === messageId) {
          message.viewers = message.viewers?.filter(
            (viewer) => viewer._id !== viewerId
          );

          const newViewer = populateUser(chat, viewerId);
          if (newViewer) message.viewers?.push(newViewer);
        }
        return message;
      });
    }

    return chat;
  });

  return chats;
}

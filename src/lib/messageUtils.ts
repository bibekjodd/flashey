import { dummyUserImage } from "./constants";

export const isSentByMe = (user: User | null, message?: Message): boolean => {
  if (!user || !message) return false;
  return message?.sender?._id === user?._id;
};

export const getViewersIds = (message: Message): string[] => {
  if (!message.viewers) return [];
  const viewers = message.viewers?.map((viewer) => {
    return viewer._id;
  });
  return viewers;
};

export const messageHighlight = (
  user: User | null,
  message?: Message
): string => {
  if (!message) return "";

  if (message.sender?._id === user?._id) {
    if (message.image) return "You sent a photo";
    if (message.text) return `You: ${message.text}`;
  } else {
    if (message.image) return `${message.sender.name} sent a photo`;
    if (message.text) return `${message.sender.name}: ${message.text}`;
  }

  return "";
};

export const haveIReadMessage = (user: User | null, chat: Chat): boolean => {
  if (!chat.messages) return true;
  const message = chat.messages[0];
  if (!user || !message) return true;
  const viewers = message.viewers?.map((viewer) => viewer._id);
  if (viewers?.includes(user._id)) return true;
  return false;
};

export const hasOtherUsersReadMessage = (
  user: User | null,
  chat: Chat
): boolean => {
  if (!chat.messages) return false;
  const message = chat.messages[0];
  if (!user || !message) return true;

  const viewers = getViewersIds(message);
  const otherViewer = viewers.find((viewer) => viewer !== user._id);
  return !!otherViewer;
};

export const lastViewersImage = (user: User | null, chat: Chat): string => {
  if (!chat.messages) return dummyUserImage;
  const message = chat.messages[0];
  if (!user || !message) return dummyUserImage;

  const otherViewer = message.viewers?.find(
    (viewer) => viewer._id !== user._id
  );
  if (otherViewer) return otherViewer.picture?.url || dummyUserImage;
  return dummyUserImage;
};

export const haveIReactedToMessage = (
  message: Message,
  user: User | null
): boolean => {
  if (!user) return false;

  return !!message.reactions?.find(
    (reaction) => reaction.user._id === user._id
  );
};

export const prepareReactions = (reactions: Reaction[]): string[][] => {
  const currentReactions = {
    haha: 0,
    wow: 0,
    angry: 0,
    sad: 0,
    love: 0,
  };

  for (const reaction of reactions) {
    if (reaction.value === "haha") currentReactions.haha++;
    if (reaction.value === "wow") currentReactions.wow++;
    if (reaction.value === "angry") currentReactions.angry++;
    if (reaction.value === "sad") currentReactions.sad++;
    if (reaction.value === "love") currentReactions.love++;
  }

  const preparedReactions: string[][] = [];

  for (const [key, value] of Object.entries(currentReactions)) {
    if (value !== 0) preparedReactions.push([key, value.toString()]);
  }

  return preparedReactions;
};

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
  if (message.text && message.text !== "") {
    return message.text;
  }

  if (message.image) {
    if (message.sender._id === user?._id) return "You sent a photo";
    const indexOfSpace = message.sender.name.indexOf(" ");
    const senderName = message.sender.name.slice(0, indexOfSpace);
    return `${senderName} sent a photo`;
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

export const isSentByMe = (messsage: Message, user: User | null): boolean => {
  return messsage.sender._id === user?._id;
};

export const getViewersIds = (message: Message): string[] => {
  const viewers = message.viewers?.map((viewer) => viewer._id);
  return viewers || [];
};

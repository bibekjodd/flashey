export const isSentByMe = (messsage: Message, user: User | null): boolean => {
  return messsage.sender._id === user?._id;
};

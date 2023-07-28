type MessageViewed = { chatId: string; viewerId: string; messageId: string };
type ReactionAdded = {
  chatId: string;
  messageId: string;
  reaction: { userId: string; value: string };
};

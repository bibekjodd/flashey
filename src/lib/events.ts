export const EVENTS = {
  ADDED_TO_CHAT: 'added-to-chat',
  CHAT_UPDATED: 'chat-updated',
  CHAT_DELETED: 'chat-deleted',

  MESSAGE_TYPING: 'message-typing',
  MESSAGE_SENT: 'message-sent',
  MESSAGE_SEEN: 'message-seen',
  REACTION_ADDED: 'reaction-added',
  MESSAGE_DELETED: 'message-deleted',

  USER_ONLINE: 'user-online'
};

export type AddedToChatResponse = {
  chatId: string;
};
export type ChatUpdatedResponse = {
  name?: string;
  image?: string | null;
  removedMembersId?: string[];
  addedMembersId?: string[];
};
export type ChatDeletedResponse = unknown;
export type MessageSentResponse = Message;
export type MessageSeenResponse = {
  messageId: string;
  userId: string;
};
export type MessageDeletedResponse = {
  messageId: string;
};
export type ReactionAddedResponse = {
  messageId: string;
  reaction: Reaction;
  userId: string;
};
export type UserOnlineResponse = unknown;

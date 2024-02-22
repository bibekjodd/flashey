type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: 'user' | 'admin';
  createdAt: string | null;
  lastOnline: string;
};

type Chat = {
  members: User[];
  id: string;
  name: string | null;
  image: string | null;
  admin: string;
  isGroupChat: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessage: {
    sender: string;
    message: string;
    senderId: string;
  } | null;
  isTyping?: {
    at: string;
    user: string;
  };
};

type Message = {
  id: string;
  text: string | null;
  image: string | null;
  chatId: string;
  senderId: string;
  isEdited: boolean;
  sentAt: string;
  totalViews: number;
  totalReactions: number;
  viewers: string[];
  reactions: {
    userId: string | null;
    reaction: Reaction;
  }[];
};

type Reaction =
  | 'wow'
  | 'like'
  | 'love'
  | 'haha'
  | 'angry'
  | 'wow'
  | 'sad'
  | null;

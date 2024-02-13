type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: 'user' | 'admin';
  createdAt: string | null;
};

type Chat = {
  participants: User[];
  id: string;
  title: string | null;
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
};

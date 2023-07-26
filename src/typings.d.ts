interface UserShort {
  _id: string;
  name: string;
  picture: Picture;
  email: string;
}

interface User {
  _id: string;
  name: string;
  picture: Picture;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

type Picture =
  | undefined
  | {
      public_id?: string;
      url?: string;
    };

interface Chat {
  _id: string;
  name?: string;
  users: User[];
  isGroupChat: boolean;
  groupAdmin?: string;
  createdAt: string;
  updatedAt: string;
  latestMessage?: Message;
  messages?: Message[];
  image?: Picture;
}

interface Message {
  _id: string;
  text?: string;
  sender: UserShort;
  viewers?: User[];
  chat: string;
  reactions: any[];
  createdAt: string;
  updatedAt: string;
  image?: Picture;
}

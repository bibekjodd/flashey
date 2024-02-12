type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: 'user' | 'admin';
  createdAt: string | null;
};

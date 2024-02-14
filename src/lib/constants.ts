export const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
export const dummyUserImage =
  'https://avatars.githubusercontent.com/u/110604197?v=4';
export const dummyGroupImage =
  'https://img.freepik.com/free-vector/young-people-being-friends_23-2148460046.jpg?w=740&t=st=1707792619~exp=1707793219~hmac=467389b38e069ecd8bc0a4345daabfd2f7148e60be3ffa89a4e335f5d5eb578e';
export const reactions = [
  'like',
  'love',
  'haha',
  'angry',
  'wow',
  'sad'
] as const;

export const emojis = {
  like: '👍',
  love: '❤️',
  haha: '😂',
  angry: '😡',
  wow: '😲',
  sad: '🥲'
} as const;

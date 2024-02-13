import ChatPage from '@/components/chat/page';

type Props = { params: { id: string } };
export default function page({ params }: Props) {
  return <ChatPage chatId={params.id} isGroupChat />;
}

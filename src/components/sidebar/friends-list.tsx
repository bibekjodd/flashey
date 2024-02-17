import { useFriends } from '@/hooks/queries/useFriends';
import { formatRelative } from 'date-fns';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Avatar from '../ui/avatar';

export default function FriendsList() {
  const { data, isLoading } = useFriends();
  const friends = data?.pages.flat(1) || [];

  return (
    <section>
      <h3 className="pb-2 text-lg font-semibold text-gray-800">Friends</h3>
      <div className="flex flex-col space-y-2">
        {isLoading &&
          new Array(4).fill('nothing').map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-2">
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200/50" />
              <div className="flex-grow space-y-2">
                <div className="h-5 w-full animate-pulse rounded-full bg-gray-200/50" />
                <div className="h-3 w-full animate-pulse rounded-full bg-gray-200/50" />
              </div>
            </div>
          ))}

        {friends.length > 0 &&
          friends.map((user) => <Friend key={user.id} user={user} />)}
      </div>
    </section>
  );
}

function Friend({ user }: { user: User }) {
  {
    const chatLink = `/messages/${user.id}`;
    const pathname = usePathname();
    return (
      <Link
        key={user.id}
        href={chatLink}
        className={`flex items-center space-x-3 rounded-md p-2 transition hover:bg-gray-200/40 focus:bg-gray-200/40 active:scale-95
        ${pathname === chatLink ? 'bg-gray-200/40' : ''}
        `}
      >
        <Avatar src={user.image} isOnline />
        <div className="flex flex-col">
          <span className="line-clamp-1 text-sm font-medium">{user.name}</span>
          <span className="text-xs text-gray-500">
            <span>last seen: </span>
            {formatRelative(new Date(user.lastOnline), new Date())}
          </span>
        </div>
      </Link>
    );
  }
}

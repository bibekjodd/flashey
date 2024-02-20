import { useCreateGroup } from '@/hooks/mutations/useCreateGroup';
import { useSearch } from '@/hooks/queries/useSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import Avatar from '../ui/avatar';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type Props = {
  children?: React.ReactNode;
};
export default function CreateGroup({ children }: Props) {
  const [query, setQuery] = useState('');
  const [name, setTitle] = useState('');
  const [members, setMembers] = useState<User[]>([]);
  const isSearchEnabled = useDebounce(query, 250);
  const { data } = useSearch(query, isSearchEnabled);
  const { mutate, isPending } = useCreateGroup();
  const searchResults = data?.pages.flat(1);

  const addMember = (user: User) => {
    setMembers([...members, user]);
  };

  const remmoveMember = (user: User) => {
    const otherMembers = members.filter((member) => member.id !== user.id);
    setMembers([...otherMembers]);
  };

  const createGroup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    if (!name) {
      toast.dismiss();
      toast.error('Add a group name to create group');
      return;
    }

    if (!members.length) {
      toast.dismiss();
      toast.error('Groupt must have at least 2 members');
      return;
    }

    const membersId = members.map((member) => member.id);
    mutate(
      { name, members: membersId },
      {
        onSuccess() {
          document.getElementById('close-create-group')?.click();
          setQuery('');
          setTitle('');
          setMembers([]);
        }
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <button className="p-2 text-gray-800">
            <UserGroupIcon className="h-5 w-5" />
          </button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Create Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={createGroup} className="flex flex-col space-y-3">
          <div className="space-y-2">
            <Label htmlFor="name">Title</Label>
            <Input
              placeholder="Enter group name..."
              value={name}
              onChange={(e) => setTitle(e.target.value)}
              className="dark:border-white/30"
            />
          </div>

          {/* members */}
          {members.length > 0 && (
            <section className="space-y-1">
              <Label>Added members:</Label>
              <div className="flex w-full flex-wrap">
                {members.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => remmoveMember(member)}
                    className="p-2"
                  >
                    <Avatar src={member.image} variant="sm" />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-2">
            <Label htmlFor="name">Add Members</Label>
            <Input
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="dark:border-white/30"
            />
          </section>

          {/* search results */}
          {searchResults && searchResults.length > 0 && (
            <section className="flex h-fit max-h-[200px] flex-col overflow-y-auto py-3">
              <Label className="mb-2">Search results</Label>
              {searchResults?.map((user) => {
                const isUserAdded = members.find(({ id }) => id === user.id);
                if (isUserAdded) return null;
                return (
                  <div
                    key={user.id}
                    onClick={() => addMember(user)}
                    className="flex cursor-pointer items-center space-x-3 rounded-md p-2 transition hover:bg-gray-200/50 active:scale-95 dark:hover:bg-neutral-700/50"
                  >
                    <Avatar src={user.image} variant="sm" />
                    <p className="line-clamp-1 text-sm font-medium">
                      {user.name}
                    </p>
                  </div>
                );
              })}
            </section>
          )}

          <DialogFooter>
            <DialogClose id="close-create-group" asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              disabled={isPending}
              className="relative flex items-center justify-center"
            >
              <span className={`${isPending ? 'opacity-0' : ''}`}>
                Create Group
              </span>
              {isPending && (
                <span className="absolute inset-0 grid place-items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

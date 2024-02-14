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

export default function CreateGroup() {
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('');
  const [participants, setParticipants] = useState<User[]>([]);
  const isSearchEnabled = useDebounce(query, 250);
  const { data } = useSearch(query, isSearchEnabled);
  const { mutate, isPending } = useCreateGroup();
  const searchResults = data?.pages.flat(1);

  const addParticipant = (user: User) => {
    setParticipants([...participants, user]);
  };

  const remmoveParticipant = (user: User) => {
    const otherParticipants = participants.filter(
      (participant) => participant.id !== user.id
    );
    setParticipants([...otherParticipants]);
  };

  const createGroup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    if (!title) {
      toast.dismiss();
      toast.error('Add a group title to create group');
      return;
    }

    if (!participants.length) {
      toast.dismiss();
      toast.error('Groupt must have at least 2 participants');
      return;
    }

    const participantsId = participants.map((participant) => participant.id);
    mutate(
      { title, participants: participantsId },
      {
        onSuccess() {
          document.getElementById('close-create-group')?.click();
          setQuery('');
          setTitle('');
          setParticipants([]);
        }
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 text-gray-800">
          <UserGroupIcon className="h-5 w-5" />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Create Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={createGroup} className="flex flex-col space-y-3">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              placeholder="Enter group title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* participants */}
          {participants.length > 0 && (
            <section className="space-y-1">
              <Label>Added members:</Label>
              <div className="flex w-full flex-wrap">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    onClick={() => remmoveParticipant(participant)}
                    className="p-2"
                  >
                    <Avatar src={participant.image} variant="sm" />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-2">
            <Label htmlFor="title">Add Members</Label>
            <Input
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </section>

          {/* search results */}
          {searchResults && searchResults.length > 0 && (
            <section className="flex h-fit max-h-[200px] flex-col overflow-y-auto py-3">
              <Label className="mb-2">Search results</Label>
              {searchResults?.map((user) => {
                const isUserAdded = participants.find(
                  ({ id }) => id === user.id
                );
                if (isUserAdded) return null;
                return (
                  <div
                    key={user.id}
                    onClick={() => addParticipant(user)}
                    className="flex cursor-pointer items-center space-x-3 rounded-md p-2 hover:bg-gray-200/50"
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

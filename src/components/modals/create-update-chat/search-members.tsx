import Avatar from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSearch } from '@/hooks/queries/useSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { InfoIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

type Props = {
  selectedMembers: User[];
  selectMember: (user: User) => void;
};

export default function SearchMembers({
  selectMember,
  selectedMembers
}: Props) {
  const [query, setQuery] = useState('');
  const searchEnabled = useDebounce(query, 250);
  const { data } = useSearch(query, searchEnabled);
  const searchResults = useMemo(() => {
    const result = data?.pages.flat(1) || [];
    const filteredResult = result.filter((user) => {
      const isSelected = selectedMembers.find(({ id }) => id === user.id);
      return !isSelected;
    });
    return filteredResult;
  }, [data?.pages, selectedMembers]);

  return (
    <>
      <div className="space-y-2">
        <Label>Add members</Label>
        <div className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search user..."
            className="pr-3"
          />
          {query && (
            <XMarkIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-400" />
          )}
        </div>
      </div>

      {searchResults.length > 0 && (
        <section className="max-h-[200px] space-y-1 overflow-y-auto">
          <span className="flex items-center space-x-1 pb-1 text-xs italic text-gray-500">
            <InfoIcon className="h-3 w-3" />
            <span>Click on avatar to select member</span>
          </span>
          {searchResults.map((user) => (
            <div
              key={user.id}
              onClick={() => selectMember(user)}
              className="flex cursor-pointer items-center space-x-3 rounded-md p-2 text-sm transition hover:bg-gray-200 active:scale-95 dark:hover:bg-gray-700/40"
            >
              <Avatar variant="xs" src={user.image} />
              <span>{user.name}</span>
            </div>
          ))}
        </section>
      )}
    </>
  );
}

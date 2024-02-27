import Avatar from '@/components/ui/avatar';
import { InfoIcon } from 'lucide-react';

type Props = {
  selectedMembers: User[];
  deselectMember: (user: User) => void;
};

export default function SelectedMembers({
  selectedMembers,
  deselectMember
}: Props) {
  if (!selectedMembers.length) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Selected members:</h3>
      <div className="flex items-center space-x-1 text-xs text-gray-500">
        <InfoIcon className="h-3 w-3" />
        <span className="italic">Click on avatar to deselect member</span>
      </div>
      <div className="flex w-full flex-wrap">
        {selectedMembers.map((user) => (
          <button
            type="button"
            onClick={() => deselectMember(user)}
            key={user.id}
            className="m-2 transition hover:opacity-50 active:scale-95"
          >
            <Avatar variant="sm" src={user.image} />
          </button>
        ))}
      </div>
    </div>
  );
}

import { dummyUserImage } from '@/lib/constants';

type Props = {
  variant?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  src: string | undefined | null;
  isOnline?: boolean;
};
export default function Avatar({ src, variant, isOnline }: Props) {
  return (
    <div className="inline h-fit w-fit">
      <div
        className={`relative
        ${variant === 'sm' ? 'h-8 w-8' : ''}
        ${variant === 'md' || !variant ? 'h-10 w-10' : ''}
        ${variant === 'lg' ? 'h-12 w-12' : ''}
        ${variant === 'xl' ? 'h-14 w-14' : ''}
        ${variant === '2xl' ? 'h-16 w-16' : ''}
      `}
      >
        <img
          src={src || dummyUserImage}
          alt="profile image"
          className={`h-full w-full rounded-full object-cover`}
        />
        {isOnline && (
          <div
            className={`absolute right-0.5 top-0.5 rounded-full bg-green-500 ring-2 ring-white
          ${variant === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5'}
          `}
          />
        )}
      </div>
    </div>
  );
}

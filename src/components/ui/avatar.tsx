import { dummyUserImage } from '@/lib/constants';

type Props = {
  variant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  src: string | undefined | null;
};
export default function Avatar({ src, variant }: Props) {
  return (
    <img
      src={src || dummyUserImage}
      alt="profile image"
      className={`rounded-full object-cover 
        ${variant === 'xs' ? 'h-6 w-6' : ''}
        ${variant === 'sm' ? 'h-8 w-8' : ''}
        ${variant === 'md' || !variant ? 'h-10 w-10' : ''}
        ${variant === 'lg' ? 'h-12 w-12' : ''}
        ${variant === 'xl' ? 'h-14 w-14' : ''}
        ${variant === '2xl' ? 'h-16 w-16' : ''}
  `}
    />
  );
}

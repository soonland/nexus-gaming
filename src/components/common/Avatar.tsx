'use client';

import { CldImage } from 'next-cloudinary';

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 96,
} as const;

interface IAvatarProps {
  src?: string | null;
  alt: string;
  size?: keyof typeof sizeMap;
  className?: string;
}

export const Avatar = ({
  src,
  alt,
  size = 'md',
  className = '',
}: IAvatarProps) => {
  const dimension = sizeMap[size];

  if (!src) {
    return (
      <div
        className={`bg-violet-100 flex items-center justify-center rounded-full ${className}`}
        style={{ width: dimension, height: dimension }}
      >
        <span className='text-violet-700 font-medium'>
          {alt.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className={`rounded-full overflow-hidden ${className}`}>
      <CldImage
        alt={alt}
        className='object-cover'
        height={dimension}
        src={src}
        width={dimension}
      />
    </div>
  );
};

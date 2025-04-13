'use client';

import { useState } from 'react';

import { Avatar } from '@/components/common/Avatar';
import { ImageUpload } from '@/components/common/ImageUpload';

interface IAvatarUploadProps {
  currentAvatarUrl?: string | null;
  username: string;
  onUpload: (url: string) => void;
  className?: string;
}

export const AvatarUpload = ({
  currentAvatarUrl,
  username,
  onUpload,
  className = '',
}: IAvatarUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentAvatarUrl || null
  );

  const handleUpload = (url: string) => {
    setPreviewUrl(url);
    onUpload(url);
  };

  return (
    <div className={className}>
      <div className='flex flex-col items-center gap-4'>
        <Avatar alt={username} className='mb-2' size='lg' src={previewUrl} />
        <ImageUpload
          className='max-w-xs'
          folder='avatars'
          preview={false}
          onUpload={handleUpload}
        />
      </div>
    </div>
  );
};

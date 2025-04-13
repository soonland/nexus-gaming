'use client';

import { CldImage } from 'next-cloudinary';
import { useState } from 'react';

import { uploadImage } from '@/lib/upload';

interface IImageUploadProps {
  onUpload: (url: string, publicId: string) => void;
  folder?: string;
  preview?: boolean;
  className?: string;
}

export const ImageUpload = ({
  onUpload,
  folder = 'games',
  preview = true,
  className = '',
}: IImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setUploading(true);
    try {
      const file = e.target.files[0];
      const result = await uploadImage(file, folder);
      onUpload(result.secure_url, result.public_id);
      if (preview) {
        setPreviewUrl(result.secure_url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setUploading(false);
  };

  return (
    <div className={className}>
      <input
        accept='image/*'
        className='block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100'
        disabled={uploading}
        type='file'
        onChange={handleUpload}
      />
      {uploading && <p className='mt-2 text-sm text-gray-600'>Uploading...</p>}
      {preview && previewUrl && (
        <div className='mt-4'>
          <CldImage
            alt='Preview'
            className='rounded-lg object-cover'
            height={200}
            src={previewUrl}
            width={300}
          />
        </div>
      )}
    </div>
  );
};

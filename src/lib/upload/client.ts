import type { IUploadResult } from './types';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

export const uploadImage = async (
  file: File,
  folder = 'default'
): Promise<IUploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch(`${getBaseUrl()}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  const result = await response.json();
  return result;
};

export const deleteImage = async (publicId: string): Promise<void> => {
  const response = await fetch(
    `${getBaseUrl()}/api/upload/delete?public_id=${publicId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Delete failed');
  }
};

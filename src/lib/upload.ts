export interface IUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

export const uploadImage = async (
  file: File,
  folder: string = 'games'
): Promise<IUploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch('/api/upload', {
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
  const response = await fetch(`/api/upload/delete?public_id=${publicId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Delete failed');
  }
};

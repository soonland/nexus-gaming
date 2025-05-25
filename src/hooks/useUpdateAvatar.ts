import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { uploadImage } from '@/lib/upload/client';

const updateUserAvatar = async (file: File): Promise<string> => {
  const result = await uploadImage(file, 'avatars');

  const response = await fetch('/api/users/me/avatar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ avatarUrl: result.secure_url }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Erreur lors de la mise à jour de l'avatar"
    );
  }

  return result.secure_url;
};

const deleteUserAvatar = async (): Promise<void> => {
  const response = await fetch('/api/users/me/avatar', {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Erreur lors de la suppression de l'avatar"
    );
  }
};

export function useUpdateAvatar() {
  const queryClient = useQueryClient();
  const { refresh } = useAuth();

  const uploadMutation = useMutation({
    mutationFn: updateUserAvatar,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      await refresh();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUserAvatar,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      await refresh();
    },
  });

  return {
    upload: uploadMutation,
    delete: deleteMutation,
    isPending: uploadMutation.isPending || deleteMutation.isPending,
  };
}

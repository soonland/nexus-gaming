import type { UseMutationResult } from '@tanstack/react-query';
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

export function useUpdateAvatar(): UseMutationResult<string, Error, File> {
  const queryClient = useQueryClient();
  const { refresh } = useAuth();

  return useMutation({
    mutationFn: updateUserAvatar,
    onSuccess: async () => {
      // Invalider le cache des requêtes auth
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      // Rafraîchir les données utilisateur dans le contexte
      await refresh();
    },
  });
}

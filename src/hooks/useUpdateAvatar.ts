import { useMutation, useQueryClient } from '@tanstack/react-query';

interface IUpdateAvatarResponse {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
}

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (avatarUrl: string): Promise<IUpdateAvatarResponse> => {
      const response = await fetch('/api/users/me/avatar', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatarUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update avatar');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalider le cache de l'utilisateur pour forcer un rechargement
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

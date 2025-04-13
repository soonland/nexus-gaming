import { useMutation, useQueryClient } from '@tanstack/react-query';

interface IUpdateAvatarResponse {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
}

interface IDeleteImageResponse {
  result: string;
}

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (
      avatarUrl: string | null
    ): Promise<IUpdateAvatarResponse> => {
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

  const deleteMutation = useMutation({
    mutationFn: async (public_id: string): Promise<IDeleteImageResponse> => {
      const response = await fetch(
        `/api/upload/delete?public_id=${encodeURIComponent(public_id)}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete image');
      }

      return response.json();
    },
  });

  const deleteAvatar = async (public_id: string) => {
    await deleteMutation.mutateAsync(public_id);
    await updateMutation.mutateAsync(null);
  };

  return {
    updateAvatar: updateMutation.mutateAsync,
    deleteAvatar,
    isLoading: updateMutation.isPending || deleteMutation.isPending,
  };
};

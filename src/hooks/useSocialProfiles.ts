import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  IUserSocialProfile,
  IUserSocialProfileData,
} from '@/types/social';

async function fetchSocialProfiles(): Promise<IUserSocialProfile[]> {
  const response = await fetch('/api/users/me/social-profiles');
  if (!response.ok) {
    throw new Error('Failed to fetch social profiles');
  }
  return response.json();
}

async function createSocialProfile(
  data: IUserSocialProfileData
): Promise<IUserSocialProfile> {
  const response = await fetch('/api/users/me/social-profiles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create social profile');
  }
  return response.json();
}

async function updateSocialProfile(
  id: string,
  data: IUserSocialProfileData
): Promise<IUserSocialProfile> {
  const response = await fetch(`/api/users/me/social-profiles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update social profile');
  }
  return response.json();
}

async function deleteSocialProfile(id: string): Promise<void> {
  const response = await fetch(`/api/users/me/social-profiles/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete social profile');
  }
}

export function useSocialProfiles() {
  const queryClient = useQueryClient();
  const queryKey = ['socialProfiles'];

  const {
    data: profiles,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: fetchSocialProfiles,
  });

  const createMutation = useMutation({
    mutationFn: createSocialProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUserSocialProfileData }) =>
      updateSocialProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSocialProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    profiles,
    isLoading,
    error,
    createProfile: createMutation.mutate,
    updateProfile: updateMutation.mutate,
    deleteProfile: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

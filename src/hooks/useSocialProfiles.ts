import type { SocialPlatform } from '@prisma/client';
import type { UseMutationResult } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface ISocialProfile {
  platform: SocialPlatform;
  username: string;
  url?: string;
}

interface ISocialProfileUpdate {
  platform: SocialPlatform;
  value: string | null;
}

const fetchSocialProfiles = async (): Promise<
  Record<SocialPlatform, string>
> => {
  const response = await fetch('/api/users/me/social-profiles');
  if (!response.ok) {
    throw new Error('Failed to fetch social profiles');
  }
  const data = await response.json();
  return data.profiles.reduce(
    (acc: Record<SocialPlatform, string>, profile: ISocialProfile) => {
      acc[profile.platform] = profile.url || profile.username;
      return acc;
    },
    {} as Record<SocialPlatform, string>
  );
};

const updateSocialProfiles = async (
  updates: ISocialProfileUpdate[]
): Promise<void> => {
  const response = await fetch('/api/users/me/social-profiles', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ profiles: updates }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update social profiles');
  }
};

export function useSocialProfiles() {
  const queryClient = useQueryClient();

  const { data: profiles } = useQuery({
    queryKey: ['social-profiles'],
    queryFn: fetchSocialProfiles,
  });

  const updateProfiles: UseMutationResult<void, Error, ISocialProfileUpdate[]> =
    useMutation({
      mutationFn: updateSocialProfiles,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['social-profiles'] });
      },
    });

  return {
    profiles,
    updateProfiles,
  };
}

import type { SocialPlatform } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

export interface IPublicUser {
  id: string;
  username: string;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
  socialProfiles: {
    id: string;
    platform: SocialPlatform;
    url: string;
  }[];
  articles: {
    id: string;
  }[];
}

const fetchUserByUsername = async (username: string): Promise<IPublicUser> => {
  const response = await fetch(`/api/users/${username}`);
  if (!response.ok) {
    throw new Error("Impossible de récupérer les données de l'utilisateur");
  }
  return response.json();
};

export function usePublicUser(username: string) {
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => fetchUserByUsername(username),
    enabled: Boolean(username),
  });
}

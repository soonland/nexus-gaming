import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import type { IAdminAnnouncement } from './useAdminAnnouncement';

export type IAnnouncement = Pick<
  IAdminAnnouncement,
  'id' | 'message' | 'type' | 'expiresAt' | 'createdAt'
>;

export function useAnnouncements() {
  const {
    data: announcements = [],
    isLoading,
    error,
  } = useQuery<IAnnouncement[]>({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data } = await axios.get('/api/announcements');
      return data;
    },
  });

  return { announcements, isLoading, error };
}

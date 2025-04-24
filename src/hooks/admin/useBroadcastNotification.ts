import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import type { IBroadcastNotification } from '@/types/notifications';

export const useBroadcastNotification = () => {
  return useMutation({
    mutationFn: async (data: IBroadcastNotification) => {
      const response = await axios.post<{ data: { count: number } }>(
        '/api/admin/notifications/broadcast',
        data
      );
      return response.data;
    },
  });
};

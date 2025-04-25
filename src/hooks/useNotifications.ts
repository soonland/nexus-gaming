import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import type {
  INotification,
  IUpdateNotificationParams,
  IMarkMultipleAsReadParams,
  IMarkMultipleAsReadResponse,
} from '@/types/notifications';

interface INotificationsResponse {
  data: INotification[];
}

interface INotificationResponse {
  data: INotification;
}

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Fetch all notifications
  const {
    data: notifications = [] as INotification[],
    isPending,
    error,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } =
        await axios.get<INotificationsResponse>('/api/notifications');
      return data.data;
    },
  });

  // Update a notification
  const updateNotification = useMutation({
    mutationFn: async ({ id, ...update }: IUpdateNotificationParams) => {
      const { data } = await axios.patch<INotificationResponse>(
        `/api/notifications/${id}`,
        update
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark multiple notifications as read
  const markAllAsRead = useMutation({
    mutationFn: async ({ ids }: IMarkMultipleAsReadParams) => {
      const { data } = await axios.post<IMarkMultipleAsReadResponse>(
        '/api/notifications/read-all',
        { ids }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications,
    isLoading: isPending,
    error,
    updateNotification,
    markAllAsRead,
  };
};

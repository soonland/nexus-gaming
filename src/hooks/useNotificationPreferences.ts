import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import type {
  INotificationPreference,
  IUpdateNotificationPreference,
} from '@/types/notifications';

interface IPreferencesResponse {
  data: INotificationPreference[];
}

interface IPreferenceResponse {
  data: INotificationPreference;
}

export const useNotificationPreferences = () => {
  const queryClient = useQueryClient();

  const {
    data: preferences = [],
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ['notificationPreferences'],
    queryFn: async () => {
      const { data } = await axios.get<IPreferencesResponse>(
        '/api/notifications/preferences'
      );
      return data.data;
    },
  });

  const updatePreference = useMutation({
    mutationFn: async (update: IUpdateNotificationPreference) => {
      const { data } = await axios.patch<IPreferenceResponse>(
        '/api/notifications/preferences',
        update
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notificationPreferences'],
      });
    },
  });

  return {
    preferences,
    isLoading,
    error,
    updatePreference,
  };
};

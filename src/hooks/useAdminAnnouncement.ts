import type { AnnouncementType } from '@prisma/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import dayjs from '@/lib/dayjs';

export interface IAdminAnnouncement {
  id: string;
  message: string;
  type: AnnouncementType;
  isActive: ActiveStatus;
  expiresAt: string | null;
  createdAt: string;
  createdBy: {
    username: string;
  };
}

export type ActiveStatus = 'active' | 'inactive';

interface ICreateAnnouncementData {
  message: string;
  type: AnnouncementType;
  isActive?: ActiveStatus;
  expiresAt?: Date | null;
}

interface IUpdateAnnouncementData {
  id: string;
  message: string;
  type: AnnouncementType;
  expiresAt?: Date | null;
  isActive: ActiveStatus;
}

export function useAdminAnnouncement(id?: string) {
  const queryClient = useQueryClient();

  const { data: announcements = [], isLoading } = useQuery<
    IAdminAnnouncement[]
  >({
    queryKey: ['adminAnnouncements'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/announcements');
      return data;
    },
  });

  const { data: announcement } = useQuery<IAdminAnnouncement>({
    queryKey: ['announcement', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/admin/announcements/${id}`);
      return data;
    },
    enabled: !!id,
  });

  const createAnnouncement = useMutation({
    mutationFn: async (data: ICreateAnnouncementData) => {
      const response = await axios.post('/api/admin/announcements', {
        ...data,
        expiresAt: data.expiresAt
          ? dayjs(data.expiresAt).toISOString()
          : undefined,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['adminAnnouncements'] });
    },
  });

  const updateAnnouncement = useMutation({
    mutationFn: async (data: IUpdateAnnouncementData) => {
      const response = await axios.put(`/api/admin/announcements/${data.id}`, {
        ...data,
        expiresAt: data.expiresAt
          ? dayjs(data.expiresAt).toISOString()
          : undefined,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({ queryKey: ['adminAnnouncements'] });
      queryClient.refetchQueries({ queryKey: ['announcement', variables.id] });
    },
  });

  const deleteAnnouncement = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/admin/announcements/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['adminAnnouncements'] });
    },
  });

  const toggleAnnouncementStatus = useMutation({
    mutationFn: async ({
      id,
      isActive,
    }: {
      id: string;
      isActive: ActiveStatus;
    }) => {
      const response = await axios.patch(
        `/api/admin/announcements/${id}/status`,
        {
          isActive,
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({ queryKey: ['adminAnnouncements'] });
      queryClient.refetchQueries({ queryKey: ['announcement', variables.id] });
    },
  });

  const extendAnnouncement = useMutation({
    mutationFn: async ({ id, days }: { id: string; days: number }) => {
      const response = await axios.post(
        `/api/admin/announcements/${id}/extend`,
        {
          days,
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({ queryKey: ['adminAnnouncements'] });
      queryClient.refetchQueries({ queryKey: ['announcement', variables.id] });
    },
  });

  return {
    announcements,
    isLoading,
    announcement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleAnnouncementStatus,
    extendAnnouncement,
  };
}

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
  expiresAt?: Date | null;
}

export function useAdminAnnouncement(id?: string) {
  const queryClient = useQueryClient();

  const { data: announcements = [] } = useQuery<IAdminAnnouncement[]>({
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
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncements'] });
    },
  });

  interface IUpdateAnnouncementData {
    id: string;
    message: string;
    type: AnnouncementType;
    expiresAt?: Date | null;
    isActive: ActiveStatus;
  }

  const updateAnnouncement = useMutation({
    mutationFn: async (data: IUpdateAnnouncementData) => {
      const response = await axios.put(`/api/admin/announcements/${data.id}`, {
        ...data,
        expiresAt: data.expiresAt
          ? dayjs(data.expiresAt).toISOString()
          : undefined,
        isActive: data.isActive,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncements'] });
      queryClient.invalidateQueries({
        queryKey: ['announcement', variables.id],
      });
    },
  });

  const deleteAnnouncement = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/admin/announcements/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncements'] });
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
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncements'] });
      queryClient.invalidateQueries({
        queryKey: ['announcement', variables.id],
      });
    },
  });

  return {
    announcements,
    announcement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleAnnouncementStatus,
  };
}

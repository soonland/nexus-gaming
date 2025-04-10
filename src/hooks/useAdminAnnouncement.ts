import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { AnnouncementType } from '@prisma/client'

export interface AdminAnnouncement {
  id: string
  message: string
  type: AnnouncementType
  isActive: boolean
  expiresAt: string | null
  createdAt: string
  createdBy: {
    username: string
  }
}

interface CreateAnnouncementData {
  message: string
  type: AnnouncementType
  expiresAt?: string
}

export function useAdminAnnouncement() {
  const queryClient = useQueryClient()

  const { data: announcements = [] } = useQuery<AdminAnnouncement[]>({
    queryKey: ['adminAnnouncements'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/announcements')
      return data
    },
  })

  const createAnnouncement = useMutation({
    mutationFn: async (data: CreateAnnouncementData) => {
      const response = await axios.post('/api/admin/announcements', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncements'] })
    },
  })

  const updateAnnouncement = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await axios.put('/api/admin/announcements', { id, isActive })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncements'] })
    },
  })

  return {
    announcements,
    createAnnouncement,
    updateAnnouncement,
  }
}

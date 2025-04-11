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

export function useAdminAnnouncement(id?: string) {
  const queryClient = useQueryClient()

  const { data: announcements = [] } = useQuery<AdminAnnouncement[]>({
    queryKey: ['adminAnnouncements'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/announcements')
      return data
    },
  })

  const { data: announcement } = useQuery<AdminAnnouncement>({
    queryKey: ['announcement', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/admin/announcements/${id}`)
      return data
    },
    enabled: !!id,
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

  interface UpdateAnnouncementData {
    id: string
    message: string
    type: AnnouncementType
    expiresAt?: string
    isActive: boolean
  }

  const updateAnnouncement = useMutation({
    mutationFn: async (data: UpdateAnnouncementData) => {
      const response = await axios.put(`/api/admin/announcements/${data.id}`, {
        ...data,
        isActive: Boolean(data.isActive)
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncements'] })
      queryClient.invalidateQueries({ queryKey: ['announcement', variables.id] })
    },
  })

  const deleteAnnouncement = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/admin/announcements/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncements'] })
    },
  })

  const toggleAnnouncementStatus = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await axios.patch(`/api/admin/announcements/${id}/status`, { 
        isActive: Boolean(isActive)
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminAnnouncements'] })
      queryClient.invalidateQueries({ queryKey: ['announcement', variables.id] })
    },
  })

  return {
    announcements,
    announcement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleAnnouncementStatus,
  }
}

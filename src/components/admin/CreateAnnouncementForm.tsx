'use client'

import { useAdminAnnouncement } from '@/hooks/useAdminAnnouncement'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import { AnnouncementType } from '@prisma/client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export function CreateAnnouncementForm() {
  const { createAnnouncement } = useAdminAnnouncement()
  const { isLoading: authLoading } = useAuth()
  const toast = useToast()
  const [message, setMessage] = useState('')
  const [type, setType] = useState<AnnouncementType>(AnnouncementType.INFO)
  const [expiresAt, setExpiresAt] = useState('')

  if (authLoading) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createAnnouncement.mutateAsync({
        message,
        type,
        expiresAt: expiresAt || undefined,
      })

      toast({
        title: 'Annonce créée',
        status: 'success',
        duration: 3000,
      })

      // Reset form
      setMessage('')
      setType(AnnouncementType.INFO)
      setExpiresAt('')
    } catch (error) {
      toast({
        title: "Erreur lors de la création de l'annonce",
        status: 'error',
        duration: 3000,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Message</FormLabel>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Votre message..."
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Type</FormLabel>
          <Select value={type} onChange={(e) => setType(e.target.value as AnnouncementType)}>
            <option value={AnnouncementType.INFO}>Information</option>
            <option value={AnnouncementType.ATTENTION}>Attention</option>
            <option value={AnnouncementType.URGENT}>Urgent</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Date d'expiration (optionnelle)</FormLabel>
          <Input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
          />
        </FormControl>

        <Button type="submit" colorScheme="blue" isLoading={createAnnouncement.isPending}>
          Créer l'annonce
        </Button>
      </VStack>
    </form>
  )
}

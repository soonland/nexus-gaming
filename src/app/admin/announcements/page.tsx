'use client'

import { useAdminAnnouncement } from '@/hooks/useAdminAnnouncement'
import {
  Box,
  Button,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  HStack,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { AddIcon, EditIcon, DeleteIcon, SunIcon, MoonIcon } from '@chakra-ui/icons'
import React, { useRef } from 'react'
import { DateDisplay } from '@/components/common/DateDisplay'
import Link from 'next/link'

const getTypeBadge = (type: string) => {
  switch (type) {
    case 'URGENT':
      return <Badge colorScheme="red">Urgent</Badge>
    case 'ATTENTION':
      return <Badge colorScheme="orange">Attention</Badge>
    default:
      return <Badge colorScheme="blue">Info</Badge>
  }
}

export default function AnnouncementsPage() {
  const { announcements, deleteAnnouncement, toggleAnnouncementStatus } = useAdminAnnouncement()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [announcementToDelete, setAnnouncementToDelete] = React.useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setAnnouncementToDelete(id)
    onOpen()
  }

  const handleDeleteConfirm = async () => {
    if (!announcementToDelete) return

    try {
      await deleteAnnouncement.mutateAsync(announcementToDelete)
      toast({
        title: 'Annonce supprimée',
        status: 'success',
        duration: 3000,
      })
      onClose()
      setAnnouncementToDelete(null)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Une erreur est survenue lors de la suppression",
        status: 'error',
        duration: 5000,
      })
    }
  }

  return (
    <>
      <Container maxW="container.xl" py={8}>
      <HStack justify="space-between" mb={8}>
        <Heading size="lg">Gestion des annonces</Heading>
        <Button
          as={Link}
          href="/admin/announcements/new"
          colorScheme="blue"
          leftIcon={<AddIcon />}
        >
          Nouvelle annonce
        </Button>
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Message</Th>
              <Th>Type</Th>
              <Th>Statut</Th>
              <Th>Créé par</Th>
              <Th>Date d'expiration</Th>
              <Th width="150px">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {announcements?.map((announcement) => (
              <Tr key={announcement.id}>
                <Td>{announcement.message}</Td>
                <Td>{getTypeBadge(announcement.type)}</Td>
                <Td>
                  <Badge colorScheme={announcement.isActive ? 'green' : 'gray'}>
                    {announcement.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Td>
                <Td>{announcement.createdBy.username}</Td>
                <Td>
                  {announcement.expiresAt && (
                    <DateDisplay date={announcement.expiresAt} format="long" />
                  )}
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      as={Link}
                      href={`/admin/announcements/${announcement.id}/edit`}
                      icon={<EditIcon />}
                      aria-label="Modifier"
                      size="sm"
                      colorScheme="blue"
                    />
                    <IconButton
                      icon={announcement.isActive ? <SunIcon /> : <MoonIcon />}
                      aria-label={announcement.isActive ? "Désactiver" : "Activer"}
                      size="sm"
                      colorScheme={announcement.isActive ? "green" : "gray"}
                      onClick={() => {
                        toggleAnnouncementStatus.mutate(
                          {
                            id: announcement.id,
                            isActive: !announcement.isActive
                          },
                          {
                            onSuccess: () => {
                              toast({
                                title: announcement.isActive ? 'Annonce désactivée' : 'Annonce activée',
                                status: 'success',
                                duration: 3000,
                              })
                            },
                            onError: () => {
                              toast({
                                title: 'Erreur',
                                description: "Impossible de modifier le statut de l'annonce",
                                status: 'error',
                                duration: 5000,
                              })
                            }
                          }
                        )
                      }}
                      isLoading={toggleAnnouncementStatus.isPending}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      aria-label="Supprimer"
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteClick(announcement.id)}
                      isLoading={deleteAnnouncement.isPending && announcementToDelete === announcement.id}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      </Container>

      <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Supprimer l'annonce</AlertDialogHeader>
          <AlertDialogBody>
            Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action ne peut pas être annulée.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Annuler
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteConfirm}
              ml={3}
              isLoading={deleteAnnouncement.isPending}
            >
              Supprimer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

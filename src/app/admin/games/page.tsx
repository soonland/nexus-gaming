'use client'

import { useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  useToast,
  useColorModeValue,
  Wrap,
  WrapItem,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import {
  SearchIcon,
  AddIcon,
  EditIcon,
  DeleteIcon,
  ExternalLinkIcon,
  CloseIcon,
} from '@chakra-ui/icons'
import Link from 'next/link'
import { useGames } from '@/hooks/useGames'
import { DateDisplay } from '@/components/common/DateDisplay'
import GameListLoading from '@/components/loading/GameListLoading'

export default function GamesPage() {
  const toast = useToast()
  const searchParams = useSearchParams()
  const [page, setPage] = useState(parseInt(searchParams.get('page') ?? '1'))
  const [limit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  const { data, deleteGame, isLoading, isDeleting } = useGames({
    page: page.toString(),
    limit: limit.toString(),
    search: searchTerm,
  })
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const deleteDialog = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [gameToDelete, setGameToDelete] = useState<string | null>(null)

  // Filtrage des jeux
  const filteredGames = data?.games || []

  const handleDeleteClick = (id: string) => {
    setGameToDelete(id)
    deleteDialog.onOpen()
  }

  const handleDeleteConfirm = async () => {
    if (!gameToDelete) return

    try {
      await deleteGame(gameToDelete)
      toast({
        title: 'Jeu supprimé',
        status: 'success',
        duration: 3000,
      })
      deleteDialog.onClose()
      setGameToDelete(null)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Une erreur est survenue lors de la suppression",
        status: 'error',
        duration: 5000,
      })
    }
  }

  if (isLoading) {
    return <GameListLoading />
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Gestion des jeux</Heading>
          <Button
            as={Link}
            href="/admin/games/new"
            colorScheme="blue"
            leftIcon={<AddIcon />}
          >
            Nouveau jeu
          </Button>
        </HStack>

        <Box>
          <HStack mb={4}>
            <InputGroup maxW="sm">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            {searchTerm && (
              <IconButton
                icon={<CloseIcon />}
                aria-label="Clear search"
                size="sm"
                onClick={() => setSearchTerm('')}
              />
            )}
          </HStack>

          <Box overflowX="auto" borderWidth="1px" borderColor={borderColor} rounded="lg">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Titre</Th>
                  <Th>Développeur</Th>
                  <Th>Éditeur</Th>
                  <Th>Date de sortie</Th>
                  <Th>Plateformes</Th>
                  <Th width="150px">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredGames.map((game) => (
                  <Tr key={game.id}>
                    <Td>{game.title}</Td>
                    <Td>{game.developer.name}</Td>
                    <Td>{game.publisher.name}</Td>
                    <Td>
                      {game.releaseDate && (
                        <DateDisplay date={game.releaseDate} format="long" />
                      )}
                    </Td>
                    <Td>
                      <Wrap>
                        {game.platforms.map((platform) => (
                          <WrapItem key={platform.id}>
                            <Badge
                              colorScheme="blue"
                              variant="subtle"
                              fontSize="xs"
                            >
                              {platform.name}
                            </Badge>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          as={Link}
                          href={`/admin/games/${game.id}/edit`}
                          icon={<EditIcon />}
                          aria-label="Modifier"
                          size="sm"
                          colorScheme="blue"
                        />
                        <IconButton
                          as={Link}
                          href={`/games/${game.id}`}
                          icon={<ExternalLinkIcon />}
                          aria-label="Voir"
                          size="sm"
                          colorScheme="green"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          aria-label="Supprimer"
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteClick(game.id)}
                          isLoading={isDeleting}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {data?.pagination && data.pagination.pages > 1 && (
            <HStack justify="center" spacing={2} mt={4}>
              {Array.from({ length: data.pagination.pages }, (_, i) => (
                <Button
                  key={i + 1}
                  size="sm"
                  variant={page === i + 1 ? 'solid' : 'outline'}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </HStack>
          )}
        </Box>
      </VStack>

      <AlertDialog
        isOpen={deleteDialog.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteDialog.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Supprimer le jeu</AlertDialogHeader>
            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer ce jeu ? Cette action ne peut pas être annulée.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={deleteDialog.onClose}>
                Annuler
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteConfirm}
                ml={3}
                isLoading={isDeleting}
              >
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  )
}

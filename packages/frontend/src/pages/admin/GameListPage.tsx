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
  HStack,
  useToast,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useGames } from '@/hooks/useGames'
import { useState } from 'react'

export const AdminGameListPage = () => {
  const { games, deleteGame, isLoading } = useGames()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const toast = useToast()

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await deleteGame(id)
      toast({
        title: 'Jeu supprimé',
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={6}>
        <HStack justify="space-between" align="center">
          <Heading size="lg">Gestion des jeux</Heading>
          <Button
            as={RouterLink}
            to="/admin/games/new"
            colorScheme="blue"
          >
            Ajouter un jeu
          </Button>
        </HStack>
      </Box>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Titre</Th>
            <Th>Développeur</Th>
            <Th>Éditeur</Th>
            <Th>Date de sortie</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {games?.map((game) => (
            <Tr key={game.id}>
              <Td>{game.title}</Td>
              <Td>{game.developer}</Td>
              <Td>{game.publisher}</Td>
              <Td>{game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : 'N/A'}</Td>
              <Td>
                <HStack spacing={2}>
                  <Button
                    as={RouterLink}
                    to={`/admin/games/${game.id}/edit`}
                    size="sm"
                    colorScheme="blue"
                  >
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(game.id)}
                    isLoading={deletingId === game.id}
                  >
                    Supprimer
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  )
}

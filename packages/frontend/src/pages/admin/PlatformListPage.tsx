import {
  IconButton,
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
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from '@chakra-ui/react'
import { SearchIcon, CloseIcon, EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import { usePlatforms } from '@/hooks/usePlatforms'
import { useState, useMemo } from 'react'
import Swal from 'sweetalert2'
import { formatPlatformReleaseDate } from '@/utils/dateFormatter'

export const AdminPlatformListPage = () => {
  const { platforms, deletePlatform } = usePlatforms()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const toast = useToast()

  const filteredPlatforms = useMemo(() => {
    return platforms?.filter(platform => {
      const matchesSearch = searchTerm === '' || 
        platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        platform.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch
    })
  }, [platforms, searchTerm])

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Êtes-vous sûr(e) ?',
      text: 'Vous ne pourrez pas revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setDeletingId(id)
          await deletePlatform(id)
          toast({
            title: 'Plateforme supprimée',
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
    })
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading size="lg">Gestion des plateformes</Heading>
          <Button
            as={RouterLink}
            to="/admin/platforms/new"
            colorScheme="purple"
            leftIcon={<AddIcon />}
          >
            Ajouter une plateforme
          </Button>
        </HStack>

        <HStack spacing={4} align="flex-end">
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Rechercher par nom ou fabricant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <IconButton
            variant="ghost"
            aria-label="Réinitialiser les filtres"
            icon={<CloseIcon />}
            onClick={() => setSearchTerm('')}
          />
        </HStack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nom</Th>
              <Th>Fabricant</Th>
              <Th>Date de sortie</Th>
              <Th>Nombre de jeux</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredPlatforms?.map((platform) => (
              <Tr key={platform.id}>
                <Td>{platform.name}</Td>
                <Td>{platform.manufacturer}</Td>
                <Td>{formatPlatformReleaseDate(platform.releaseDate)}</Td>
                <Td>{platform.games?.length || 0}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      as={RouterLink}
                      to={`/admin/platforms/${platform.id}/edit`}
                      size="sm"
                      colorScheme="blue"
                      aria-label="Modifier"
                      icon={<EditIcon />}
                    />
                    <IconButton
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(platform.id)}
                      isLoading={deletingId === platform.id}
                      aria-label="Supprimer"
                      icon={<DeleteIcon />}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Container>
  )
}

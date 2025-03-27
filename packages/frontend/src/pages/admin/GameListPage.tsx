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
  Select,
} from '@chakra-ui/react'
import { SearchIcon, CloseIcon, EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import { useGames } from '@/hooks/useGames'
import { useState, useMemo } from 'react'
import Swal from 'sweetalert2'

export const AdminGameListPage = () => {
  const { games, deleteGame } = useGames()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('Toutes')
  const [selectedYear, setSelectedYear] = useState('Toutes')
  const toast = useToast()

  const platforms = useMemo(() => {
    const platformSet = new Set<string>()
    platformSet.add('Toutes')
    games?.forEach(game => {
      game.platform.forEach(p => platformSet.add(p))
    })
    return Array.from(platformSet)
  }, [games])

  const years = useMemo(() => {
    const yearSet = new Set<string>()
    yearSet.add('Toutes')
    games?.forEach(game => {
      if (game.releaseDate) {
        yearSet.add(new Date(game.releaseDate).getFullYear().toString())
      } else if (game.releasePeriod?.value) {
        yearSet.add(game.releasePeriod.value.split('-')[0])
      }
    })
    return Array.from(yearSet).sort((a, b) => b.localeCompare(a))
  }, [games])

  const filteredGames = useMemo(() => {
    return games?.filter(game => {
      const matchesSearch = searchTerm === '' || 
        (game.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        game.description.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesPlatform = selectedPlatform === 'Toutes' || 
        game.platform.includes(selectedPlatform)

      const gameYear = game.releaseDate 
        ? new Date(game.releaseDate).getFullYear().toString()
        : game.releasePeriod?.value.split('-')[0]

      const matchesYear = selectedYear === 'Toutes' || gameYear === selectedYear

      return matchesSearch && matchesPlatform && matchesYear
    })
  }, [games, searchTerm, selectedPlatform, selectedYear])

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
          setDeletingId(id);
          await deleteGame(id);
          toast({
            title: 'Jeu supprimé',
            status: 'success',
            duration: 3000,
          });
        } catch (error) {
          toast({
            title: 'Erreur',
            description: 'Une erreur est survenue lors de la suppression',
            status: 'error',
            duration: 5000,
          });
        } finally {
          setDeletingId(null);
        }
      }
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading size="lg">Gestion des jeux</Heading>
          <Button
            as={RouterLink}
            to="/admin/games/new"
            colorScheme="blue"
            leftIcon={<AddIcon />}
          >
            Ajouter un jeu
          </Button>
        </HStack>

        <HStack spacing={4} align="flex-end">
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Rechercher par titre ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <Select
            maxW="200px"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
          >
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </Select>

          <Select
            maxW="150px"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year === 'Toutes' ? year : `Année ${year}`}
              </option>
            ))}
          </Select>

          <IconButton
            variant="ghost"
            aria-label="Réinitialiser les filtres"
            icon={<CloseIcon />}
            onClick={() => {
              setSearchTerm('')
              setSelectedPlatform('Toutes')
              setSelectedYear('Toutes')
            }}
          />
        </HStack>
      </VStack>

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
          {filteredGames?.map((game) => (
            <Tr key={game.id}>
              <Td>{game.title}</Td>
              <Td>{game.developer}</Td>
              <Td>{game.publisher}</Td>
              <Td>{game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : 'N/A'}</Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    as={RouterLink}
                    to={`/admin/games/${game.id}/edit`}
                    size="sm"
                    colorScheme="blue"
                    aria-label="Modifier"
                    icon={<EditIcon />}
                  />
                  <IconButton
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(game.id)}
                    isLoading={deletingId === game.id}
                    aria-label="Supprimer"
                    icon={<DeleteIcon />}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  )
}

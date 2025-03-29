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
import { formatGameReleaseDate } from '@/utils/dateFormatter'
import Swal from 'sweetalert2'
import { usePlatforms } from '@/hooks/usePlatforms'

export const AdminGameListPage = () => {
  const { games, deleteGame } = useGames()
  const { platforms } = usePlatforms()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConsole, setSelectedConsole] = useState('Toutes')
  const [selectedYear, setSelectedYear] = useState('Toutes')
  const toast = useToast()

  const years = useMemo(() => {
    const yearSet = new Set<string>()
    yearSet.add('Toutes')
    games?.forEach(game => {
      if (game.releaseDate) {
        yearSet.add(game.releaseDate.split('-')[0])
      }
    })
    return Array.from(yearSet).sort((a, b) => b.localeCompare(a))
  }, [games])

  const filteredGames = useMemo(() => {
    return games?.filter(game => {
      const matchesSearch = searchTerm === '' || 
        (game.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
         game.developer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         game.publisher.name.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesConsole = selectedConsole === 'Toutes' || 
        game.platforms.some(console => console.id === selectedConsole)

      const gameYear = game.releaseDate?.split('-')[0]

      const matchesYear = selectedYear === 'Toutes' || gameYear === selectedYear

      return matchesSearch && matchesConsole && matchesYear
    })
  }, [games, searchTerm, selectedConsole, selectedYear])

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
              placeholder="Rechercher par titre, description, développeur ou éditeur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <Select
            maxW="200px"
            value={selectedConsole}
            onChange={(e) => setSelectedConsole(e.target.value)}
          >
            <option value="Toutes">Toutes les consoles</option>
            {platforms.map((platform) => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
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
              setSelectedConsole('Toutes')
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
            <Th>Consoles</Th>
            <Th>Date de sortie</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredGames?.map((game) => (
            <Tr key={game.id}>
              <Td>{game.title}</Td>
              <Td>{game.developer.name}</Td>
              <Td>{game.publisher.name}</Td>
              <Td>{game.platforms.map(c => c.name).join(', ')}</Td>
              <Td>
                {formatGameReleaseDate(game.releaseDate)}
              </Td>
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

import {
  Container,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Button,
  HStack,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { SearchIcon, AddIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { GameCard } from './GameCard';
import { GameForm } from './GameForm';
import { Game, GameFormData } from '../../types/game';

interface GameListProps {
  games?: Game[];
  isAdmin?: boolean;
  isLoading?: boolean;
  onGameClick?: (game: Game) => void;
  onGameCreate?: (data: GameFormData) => Promise<void>;
}

const PLATFORM_OPTIONS = ['Toutes', 'PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];

export const GameList = ({
  games,
  isAdmin = false,
  isLoading = false,
  onGameClick,
  onGameCreate,
}: GameListProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('Toutes');
  console.log(games);
  const filteredGames = (games ?? []).filter((game) => {
    const matchesSearch = (game.title ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.developer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.publisher.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlatform = platformFilter === 'Toutes' ||
      game.platform.includes(platformFilter);

    return matchesSearch && matchesPlatform;
  });

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={6}>
        <HStack spacing={4}>
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Rechercher un jeu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <Select
            maxW="200px"
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
          >
            {PLATFORM_OPTIONS.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </Select>

          {isAdmin && onGameCreate && (
            <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
              Ajouter un jeu
            </Button>
          )}
        </HStack>

        {isLoading ? (
          <Center py={10}>
            <Spinner size="xl" />
          </Center>
        ) : (filteredGames?.length ?? 0) > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredGames?.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onClick={() => onGameClick?.(game)}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Center py={10}>
            <Text fontSize="lg" color="gray.500">
              Aucun jeu ne correspond à votre recherche
            </Text>
          </Center>
        )}
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ajouter un nouveau jeu</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <GameForm
              onSubmit={async (data) => {
                if (onGameCreate) {
                  await onGameCreate(data);
                  onClose();
                }
              }}
              onCancel={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Badge,
  HStack,
  Icon,
  IconButton,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { StarIcon, EditIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { GameWithDetails, GameFormData } from '../../types/game';
import { GameForm } from './GameForm';

interface GameDetailProps {
  game: GameWithDetails;
  isAdmin?: boolean;
  onUpdate?: (data: GameFormData) => Promise<void>;
}

export const GameDetail = ({ game, isAdmin = false, onUpdate }: GameDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleUpdate = async (data: GameFormData) => {
    try {
      if (onUpdate) {
        await onUpdate(data);
        setIsEditing(false);
        toast({
          title: 'Jeu mis à jour',
          status: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible de mettre à jour le jeu",
        status: 'error',
        duration: 5000,
      });
    }
  };

  if (isEditing && isAdmin) {
    return (
      <Container maxW="container.lg" py={8}>
        <GameForm
          initialData={{
            title: game?.title ?? '',
            description: game?.description ?? '',
            releaseDate: game?.releaseDate,
            platformIds: game?.platforms.map((platform) => platform.id) ?? [],
            publisher: game?.publisher,
            developer: game?.developer,
            coverImage: game?.coverImage ?? '',
          }}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </Container>
    );
  }

  return (
    <Box>
      <Box
        position="relative"
        height="400px"
        bgImage={`url(${game.coverImage || '/placeholder-game.jpg'})`}
        bgSize="cover"
        bgPosition="center"
      >
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          bg="rgba(0, 0, 0, 0.7)"
          p={6}
          color="white"
        >
          <Container maxW="container.lg">
            <Stack spacing={4}>
              <HStack justify="space-between" align="center">
                <Heading size="xl">{game.title}</Heading>
                {isAdmin && (
                  <IconButton
                    aria-label="Modifier"
                    icon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                  />
                )}
              </HStack>
              <HStack spacing={4}>
                <Text>{game.developer}</Text>
                <Text>•</Text>
                <Text>{game.publisher}</Text>
                <Text>•</Text>
                <Text>{game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : 'N/A'}</Text>
              </HStack>
            </Stack>
          </Container>
        </Box>
      </Box>

      <Container maxW="container.lg" py={8}>
        <Stack spacing={8}>
          <Box>
            <HStack spacing={2} mb={4}>
              {game.platforms.map((platform) => (
                <Badge
                  key={platform.id}
                  colorScheme="teal"
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  {platform.name}
                </Badge>
              ))}
            </HStack>

            {game.averageRating !== null && game.averageRating !== undefined && (
              <HStack spacing={2} mb={4}>
                <Icon as={StarIcon} color="yellow.400" />
                <Text fontWeight="bold">{game.averageRating.toFixed(1)}</Text>
                <Text color="gray.500">
                  ({game.reviews.length} avis)
                </Text>
              </HStack>
            )}

            <Text fontSize="lg" whiteSpace="pre-wrap">
              {game.description}
            </Text>
          </Box>

          {game.reviews.length > 0 && (
            <Box>
              <Heading size="md" mb={4}>
                Avis
              </Heading>
              <Stack spacing={4}>
                {game.reviews.map((review) => (
                  <Box
                    key={review.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    bg={bgColor}
                    borderColor={borderColor}
                  >
                    <HStack spacing={2} mb={2}>
                      <Icon as={StarIcon} color="yellow.400" />
                      <Text fontWeight="bold">{review.rating.toFixed(1)}</Text>
                      <Text color="gray.500">• {review.user.username}</Text>
                    </HStack>
                    <Text>{review.content}</Text>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {game.articles.length > 0 && (
            <Box>
              <Heading size="md" mb={4}>
                Articles
              </Heading>
              <Stack spacing={4}>
                {game.articles.map(({ article }) => (
                  <Box
                    key={article.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    bg={bgColor}
                    borderColor={borderColor}
                  >
                    <HStack justify="space-between">
                      <Text fontWeight="bold">{article.title}</Text>
                      <Text color="gray.500">
                        par {article.user.username} •{' '}
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'N/A'}
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

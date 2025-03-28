import {
  Box,
  Container,
  Heading,
  Text,
  Badge,
  HStack,
  Icon,
  IconButton,
  VStack,
  useToast,
  Image,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { StarIcon, EditIcon, CloseIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { GameWithDetails, GameFormData } from '../../types/game';
import { GameForm } from './GameForm';

interface GameDetailProps {
  game: GameWithDetails;
  isAdmin?: boolean;
  onUpdate?: (data: GameFormData) => Promise<void>;
  onClose?: () => void;
}

export const GameDetail = ({ game, isAdmin = false, onUpdate, onClose }: GameDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
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
    <Container maxW="container.lg" py={8}>
      {onClose && (
        <IconButton
          aria-label="Fermer"
          icon={<CloseIcon />}
          position="fixed"
          right={4}
          top={4}
          zIndex={3}
          onClick={onClose}
        />
      )}

      <Box mb={8}>
        <Image
          src={game.coverImage || '/images/placeholder-game.png'}
          alt={game.title}
          borderRadius="lg"
          w="100%"
          maxH="400px"
          objectFit="cover"
        />
      </Box>

      <VStack align="stretch" spacing={6}>
        <Flex justify="space-between" align="center">
          <Heading size="2xl">{game.title}</Heading>
          {isAdmin && (
            <IconButton
              aria-label="Modifier"
              icon={<EditIcon />}
              onClick={() => setIsEditing(true)}
              size="lg"
            />
          )}
        </Flex>

        <HStack spacing={4} color="gray.500">
          <Text>{game.developer}</Text>
          <Text>•</Text>
          <Text>{game.publisher}</Text>
          <Text>•</Text>
          <Text>
            {game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : 'N/A'}
          </Text>
        </HStack>

        <HStack spacing={2} flexWrap="wrap" gap={2}>
              {game.platforms.map((platform) => (
                <Badge
                  key={platform.id}
                  colorScheme="teal"
                  borderRadius="full"
                  px={3}
                  py={1}
                  textTransform="uppercase"
                  letterSpacing="wider"
                  fontSize="xs"
                >
                  {platform.name}
                </Badge>
              ))}
            </HStack>

        {game.averageRating !== null && game.averageRating !== undefined && (
          <HStack spacing={3}>
            <HStack spacing={1}>
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  as={StarIcon}
                  color={i < Math.round(game.averageRating ?? 0) ? 'yellow.400' : 'gray.300'}
                  w={4}
                  h={4}
                />
              ))}
            </HStack>
            <Text>{(game.averageRating ?? 0).toFixed(1)}</Text>
            <Text color="gray.500">
              ({game.reviews.length} avis)
            </Text>
          </HStack>
        )}

        <Box
          whiteSpace="pre-wrap"
          sx={{
            'p': {
              marginBottom: 4
            }
          }}
        >
          {game.description}
        </Box>

        {game?.reviews?.length > 0 && (
          <Box>
            <Heading size="lg" mb={6}>Avis</Heading>
            <VStack spacing={4} align="stretch">
                {game.reviews.map((review) => (
                  <Box
                    key={review.id}
                    p={6}
                    borderWidth="1px"
                    borderRadius="xl"
                    bg={bgColor}
                    borderColor={borderColor}
                    transition="all 0.2s"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                  >
                    <HStack spacing={2} mb={3}>
                      <HStack spacing={1}>
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            as={StarIcon}
                            color={i < Math.round(review.rating ?? 0) ? 'yellow.400' : 'gray.300'}
                            w={4}
                            h={4}
                          />
                        ))}
                      </HStack>
                      <Text fontWeight="bold" ml={2}>{review.rating.toFixed(1)}</Text>
                      <Text color="gray.500">• {review.user.username}</Text>
                    </HStack>
                    <Text lineHeight="tall">{review.content}</Text>
                  </Box>
                ))}
            </VStack>
          </Box>
        )}

        {game?.articles?.length > 0 && (
          <Box>
            <Heading size="lg" mb={6}>Articles</Heading>
            <VStack spacing={4} align="stretch">
                {game.articles.map(({ article }) => (
                  <Box
                    key={article.id}
                    p={6}
                    borderWidth="1px"
                    borderRadius="xl"
                    bg={bgColor}
                    borderColor={borderColor}
                    transition="all 0.2s"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                      cursor: 'pointer'
                    }}
                  >
                    <VStack spacing={3} align="stretch">
                      <Heading size="md">{article.title}</Heading>
                      <HStack spacing={2}>
                        <Text fontWeight="medium" color="gray.500">
                          {article.user.username}
                        </Text>
                        <Text color="gray.500">•</Text>
                        <Text color="gray.500">
                          {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'N/A'}
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>
                ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

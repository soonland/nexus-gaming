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
  const descriptionBg = useColorModeValue('gray.50', 'gray.900');
  const ratingBorderColor = useColorModeValue('yellow.200', 'yellow.700');
  const ratingBg = useColorModeValue('yellow.50', 'yellow.900');

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
      <Box position="relative" height="500px">
        {onClose && (
          <IconButton
            aria-label="Fermer"
            icon={<CloseIcon />}
            position="absolute"
            right={4}
            top={4}
            zIndex={3}
            bg="blackAlpha.800"
            color="white"
            _hover={{ bg: 'blackAlpha.900' }}
            onClick={onClose}
          />
        )}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgImage={`url(${game.coverImage || '/images/placeholder-game.png'})`}
          bgSize="cover"
          bgPosition="center"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 70%)',
            zIndex: 1
          }}
        />
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p={8}
          color="white"
          zIndex={2}
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
                    variant="ghost"
                    colorScheme="whiteAlpha"
                    size="lg"
                    _hover={{ bg: 'whiteAlpha.300' }}
                  />
                )}
              </HStack>
              <HStack spacing={4} opacity={0.9}>
                <Text fontWeight="medium">{game.developer}</Text>
                <Text color="whiteAlpha.700">•</Text>
                <Text fontWeight="medium">{game.publisher}</Text>
                <Text color="whiteAlpha.700">•</Text>
                <Text fontWeight="medium">
                  {game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : 'N/A'}
                </Text>
              </HStack>
            </Stack>
          </Container>
        </Box>
      </Box>

      <Container maxW="container.lg" py={8}>
        <Stack spacing={8}>
          <Box
            p={6}
            bg={descriptionBg}
            borderRadius="xl"
          >
            <HStack spacing={2} mb={6} flexWrap="wrap" gap={2}>
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
              <Box
                mb={6}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                borderColor={ratingBorderColor}
                bg={ratingBg}
                display="inline-block"
              >
                <HStack spacing={3}>
                  <HStack spacing={1}>
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        as={StarIcon}
                        color={i < Math.round(game.averageRating ?? 0) ? 'yellow.400' : 'gray.300'}
                        w={5}
                        h={5}
                      />
                    ))}
                  </HStack>
                  <Text fontSize="lg" fontWeight="bold">{(game.averageRating ?? 0).toFixed(1)}</Text>
                  <Text color="gray.500">
                    ({game.reviews.length} avis)
                  </Text>
                </HStack>
              </Box>
            )}

            <Text fontSize="lg" whiteSpace="pre-wrap" lineHeight="tall">
              {game.description}
            </Text>
          </Box>

          {game?.reviews?.length > 0 && (
            <Box>
              <Heading size="lg" mb={6}>
                Avis
              </Heading>
              <Stack spacing={4}>
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
              </Stack>
            </Box>
          )}

          {game?.articles?.length > 0 && (
            <Box>
              <Heading size="lg" mb={6}>
                Articles
              </Heading>
              <Stack spacing={4}>
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
                    <Stack spacing={3}>
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
                    </Stack>
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

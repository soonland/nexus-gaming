import React from 'react';
import { formatGameReleaseDate } from '@/utils/dateFormatter';
import {
  Box,
  Image,
  Text,
  Stack,
  Badge,
  useColorModeValue,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { Game } from '@/types/game';

interface GameCardProps {
  game: Game;
  onClick?: () => void;
}

export const GameCard = ({ game, onClick }: GameCardProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor}
      overflow="hidden"
      bg={bgColor}
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'default'}
      transition="all 0.2s"
      _hover={{
        transform: onClick ? 'translateY(-2px)' : 'none',
        boxShadow: onClick ? 'lg' : 'none',
      }}
    >
      <Image
        src={game.coverImage ? `/images/games/${game.coverImage}` : '/images/placeholder-game.png'}
        alt={game.title}
        objectFit="cover"
        height="200px"
        width="100%"
      />

      <Box p="6">
        <Box display="flex" alignItems="baseline">
          {game.platforms.map((console) => (
            <Badge
              key={console.id}
              borderRadius="full"
              px="2"
              colorScheme="teal"
              mr="2"
            >
              {console.name}
            </Badge>
          ))}
        </Box>

        <Stack mt="3" spacing="3">
          <Text
            fontWeight="semibold"
            fontSize="xl"
            lineHeight="tight"
            isTruncated
          >
            {game.title}
          </Text>

          <Text fontSize="sm" color="gray.500">
            {game.developer} • {game.publisher}
          </Text>

          <Text fontSize="sm" color="gray.500">
            {formatGameReleaseDate(game.releaseDate)}
          </Text>

          {game.averageRating != null && (
            <HStack spacing={1}>
              <Icon as={StarIcon} color="yellow.400" />
              <Text>{game.averageRating.toFixed(1)}</Text>
            </HStack>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

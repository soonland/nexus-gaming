'use client';

import {
  Box,
  Card,
  CardBody,
  Heading,
  Image,
  Stack,
  Text,
  Badge,
  HStack,
  Icon,
  Wrap,
  WrapItem,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { BsCalendar4 } from 'react-icons/bs';

import { DateDisplay } from '@/components/common/DateDisplay';
import type { GameData } from '@/types';

interface GameCardProps {
  game: Partial<GameData>;
}

export const GameCard = ({ game }: GameCardProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const dateColor = useColorModeValue('blue.600', 'blue.300');
  const overlayGradient = useColorModeValue(
    'linear(to-t, blackAlpha.600, blackAlpha.300)',
    'linear(to-t, blackAlpha.700, blackAlpha.400)'
  );

  if (!game) {
    console.warn('GameCard rendered without game data');
    return null;
  }

  return (
    <Card
      _hover={{ transform: 'translateY(-4px)', textDecoration: 'none' }}
      as={Link}
      bg={bgColor}
      h='100%'
      href={`/games/${game.id}`}
      overflow='hidden'
      transition='transform 0.2s'
    >
      {/* Image avec overlay */}
      <Box height='200px' overflow='hidden' position='relative'>
        <Box
          bgGradient={overlayGradient}
          bottom={0}
          left={0}
          position='absolute'
          right={0}
          top={0}
          zIndex={1}
        />
        <Image
          alt={game.title}
          height='100%'
          objectFit='cover'
          src={game.coverImage || '/images/placeholder-game.png'}
          width='100%'
          onError={e => {
            const img = e.target as HTMLImageElement;
            img.src = '/images/placeholder-game.png';
          }}
        />
      </Box>

      <CardBody>
        <Stack spacing={4}>
          {/* Titre et description */}
          <Stack spacing={2}>
            <Heading noOfLines={2} size='md'>
              {game.title}
            </Heading>
            <Text color='gray.600' fontSize='sm' noOfLines={3}>
              {game.description}
            </Text>
          </Stack>

          {/* Date de sortie */}
          {game.releaseDate && (
            <HStack color={dateColor}>
              <Icon as={BsCalendar4} />
              <DateDisplay
                color={dateColor}
                date={game.releaseDate}
                format='calendar'
                tooltipFormat='long'
              />
            </HStack>
          )}

          {/* Plateformes */}
          {Array.isArray(game.platforms) && game.platforms.length > 0 && (
            <>
              <Divider />
              <Wrap spacing={2}>
                {game.platforms.map(platform => (
                  <WrapItem key={platform.name}>
                    <Badge
                      _hover={{
                        bg: 'blue.100',
                        transform: 'scale(1.05)',
                      }}
                      borderRadius='full'
                      colorScheme='blue'
                      fontSize='xs'
                      px={2}
                      py={1}
                      transition='all 0.2s'
                      variant='subtle'
                    >
                      {platform.name}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
            </>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
};

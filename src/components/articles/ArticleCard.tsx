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
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { BsCalendar4 } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';

import { DateDisplay } from '@/components/common/DateDisplay';
import type { ArticleData } from '@/types';

interface IArticleCardProps {
  article: ArticleData & { publishedAt: Date };
}

export const ArticleCard = ({ article }: IArticleCardProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  // Use first game's cover image or a placeholder
  const coverImage =
    article.games[0]?.coverImage || '/images/placeholder-game.png';
  const categoryColor = useColorModeValue('blue.500', 'blue.300');
  const overlayGradient = useColorModeValue(
    'linear(to-t, blackAlpha.600, blackAlpha.300)',
    'linear(to-t, blackAlpha.700, blackAlpha.400)'
  );

  return (
    <Card
      _hover={{ transform: 'translateY(-4px)', textDecoration: 'none' }}
      as={Link}
      bg={bgColor}
      h='100%'
      href={`/articles/${article.id}`}
      overflow='hidden'
      transition='transform 0.2s'
    >
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
          alt={article.title}
          height='100%'
          objectFit='cover'
          src={coverImage}
          width='100%'
          onError={e => {
            const img = e.target as HTMLImageElement;
            img.src = '/images/placeholder-game.png';
          }}
        />
        {article.category && (
          <Badge
            alignItems='center'
            colorScheme='blue'
            display='flex'
            gap={1}
            left={4}
            position='absolute'
            px={2}
            py={1}
            top={4}
            zIndex={2}
          >
            <Box as='span' bg={categoryColor} h='12px' mr={2} w='2px' />
            {article.category.name}
          </Badge>
        )}
      </Box>
      <CardBody>
        <Stack spacing={3}>
          <Heading noOfLines={2} size='md'>
            {article.title}
          </Heading>
          <Text color='gray.600' fontSize='sm' noOfLines={3}>
            {article.content}
          </Text>
          <HStack color='gray.500' fontSize='sm' spacing={4}>
            <HStack>
              <Icon as={FaUser} />
              <Text>{article.user.username}</Text>
            </HStack>
            <HStack>
              <Icon as={BsCalendar4} />
              <DateDisplay
                date={article.publishedAt}
                format='relative'
                tooltipFormat='calendar'
              />
            </HStack>
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  );
};

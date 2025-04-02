'use client'

import React from 'react'
import { DateDisplay } from '@/components/common/DateDisplay'
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
} from '@chakra-ui/react'
import { BsCalendar4, BsController } from 'react-icons/bs'
import { FaUser } from 'react-icons/fa'
import Link from 'next/link'
import { Article, User, Category, Game } from '@prisma/client'

type ArticleWithRelations = Omit<Article, 'userId' | 'categoryId'> & {
  user: Pick<User, 'username'>
  category: Pick<Category, 'name'> | null
  games: Pick<Game, 'id' | 'title' | 'coverImage'>[]
}

interface ArticleCardProps {
  article: ArticleWithRelations
}

export function ArticleCard({ article }: ArticleCardProps) {
  const bgColor = useColorModeValue('white', 'gray.800')
  // Use first game's cover image or a placeholder
  const coverImage = article.games[0]?.coverImage || '/images/placeholder-game.png'
  const categoryColor = useColorModeValue('blue.500', 'blue.300')
  const overlayGradient = useColorModeValue(
    'linear(to-t, blackAlpha.600, blackAlpha.300)',
    'linear(to-t, blackAlpha.700, blackAlpha.400)'
  )

  return (
    <Card
      as={Link}
      href={`/articles/${article.id}`}
      bg={bgColor}
      h="100%"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-4px)', textDecoration: 'none' }}
      overflow="hidden"
    >
        <Box position="relative" height="200px" overflow="hidden">
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgGradient={overlayGradient}
            zIndex={1}
          />
          <Image
            src={coverImage}
            alt={article.title}
            height="100%"
            width="100%"
            objectFit="cover"
            onError={(e) => {
              const img = e.target as HTMLImageElement
              img.src = '/images/placeholder-game.png'
            }}
          />
          {article.category && (
            <Badge
              position="absolute"
              top={4}
              left={4}
              zIndex={2}
              colorScheme="blue"
              display="flex"
              alignItems="center"
              gap={1}
              px={2}
              py={1}
            >
              <Box as="span" w="2px" h="12px" bg={categoryColor} mr={2} />
              {article.category.name}
            </Badge>
          )}
        </Box>
      <CardBody>
        <Stack spacing={2}>
          <Stack spacing={3}>
            <Heading size="md" noOfLines={2}>
              {article.title}
            </Heading>
            <Text fontSize="sm" color="gray.600" noOfLines={3}>
              {article.content}
            </Text>
            <Stack spacing={2} fontSize="sm">
              <HStack color="gray.500" spacing={4}>
                <HStack>
                  <Icon as={FaUser} />
                  <Text>{article.user.username}</Text>
                </HStack>
                <HStack>
                  <Icon as={BsCalendar4} />
                  <DateDisplay 
                    date={article.publishedAt} 
                    format="relative"
                    tooltipFormat="calendar"
                  />
                </HStack>
              </HStack>
              {article.games.length > 0 && (
                <HStack color="gray.500">
                  <Icon as={BsController} />
                  <Text>
                    {article.games.length === 1
                      ? '1 jeu mentionné'
                      : `${article.games.length} jeux mentionnés`}
                  </Text>
                </HStack>
              )}
            </Stack>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  )
}

'use client'

import React from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Badge,
  HStack,
  Icon,
  SimpleGrid,
  Button,
  Alert,
  AlertIcon,
  Skeleton,
  Image,
  useColorModeValue,
} from '@chakra-ui/react'
import { FaUser } from 'react-icons/fa'
import { BsController, BsArrowLeft } from 'react-icons/bs'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { GameCard } from '@/components/games/GameCard'
import { DateDisplay } from '@/components/common/DateDisplay'
import { useArticle } from '@/hooks/useArticle'
import type { Game } from '@prisma/client'

type CompleteGame = Game & {
  platforms: { name: string }[]
  developer: { name: string }
  publisher: { name: string }
}

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { data: article, isLoading, error } = useArticle(id)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Error loading article
        </Alert>
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Stack spacing={6}>
          <Skeleton height="400px" />
          <Skeleton height="40px" />
          <Stack spacing={2}>
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </Stack>
        </Stack>
      </Container>
    )
  }

  if (!article) return null

  return (
    <Box>
      {/* Hero Section */}
      <Box
        position="relative"
        height={{ base: '300px', md: '400px' }}
        overflow="hidden"
        mb={8}
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="linear(to-t, blackAlpha.800, blackAlpha.400)"
          zIndex={1}
        />
        <Image
          src={article.games[0]?.coverImage || '/images/placeholder-game.png'}
          alt={article.title}
          width="100%"
          height="100%"
          objectFit="cover"
        />
        <Container maxW="container.xl" position="relative" zIndex={2} height="100%">
          <Stack
            spacing={4}
            position="absolute"
            bottom={8}
            left={0}
            right={0}
            color="white"
          >
            {article.category && (
              <Badge colorScheme="blue" alignSelf="flex-start">
                {article.category.name}
              </Badge>
            )}
            <Heading size="2xl">{article.title}</Heading>
            <HStack spacing={6}>
              <HStack>
                <Icon as={FaUser} />
                <Text>{article.user.username}</Text>
              </HStack>
              <DateDisplay date={article.publishedAt} color="white" />
            </HStack>
          </Stack>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxW="container.xl" py={8}>
        <Stack spacing={8}>
          <Button
            leftIcon={<BsArrowLeft />}
            variant="ghost"
            onClick={() => router.back()}
            alignSelf="flex-start"
          >
            Retour aux articles
          </Button>

          {/* Article Content */}
          <Box
            bg={bgColor}
            p={8}
            rounded="lg"
            border="1px"
            borderColor={borderColor}
            shadow="sm"
          >
            <Text whiteSpace="pre-wrap">{article.content}</Text>
          </Box>

          {/* Games Section */}
          {article.games.length > 0 && (
            <Box>
              <HStack mb={4}>
                <Icon as={BsController} />
                <Heading size="md">Jeux mentionnés</Heading>
              </HStack>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {article.games.map((gameDetails) => {
                  const game: CompleteGame = {
                    ...gameDetails,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    description: '',
                    releaseDate: null,
                    developerId: '',
                    publisherId: '',
                    platforms: []
                  }
                  return <GameCard key={game.id} game={game} />
                })}
              </SimpleGrid>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  )
}

'use client'

import React from 'react'
import {
  Box,
  Container,
  Text,
  Stack,
  HStack,
  Icon,
  SimpleGrid,
  Button,
  Alert,
  AlertIcon,
  Skeleton,
  useColorModeValue,
  Heading
} from '@chakra-ui/react'
import { Hero } from '@/components/common/Hero'
import { FaUser } from 'react-icons/fa'
import { BsController, BsArrowLeft } from 'react-icons/bs'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { GameCard } from '@/components/games/GameCard'
import { DateDisplay } from '@/components/common/DateDisplay'
import { useArticle } from '@/hooks/useArticle'
import type { GameData } from '@/types'

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
      <Hero
        title={article.title}
        image={article.games[0]?.coverImage || undefined}
        badges={article.category ? [{
          id: crypto.randomUUID(), // Use random ID since category doesn't have id in type
          label: article.category.name,
          colorScheme: 'blue'
        }] : []}
        metadata={
          <HStack spacing={6}>
            <HStack>
              <Icon as={FaUser} />
              <Text>{article.user.username}</Text>
            </HStack>
            <DateDisplay 
              date={article.publishedAt ? new Date(article.publishedAt) : new Date()}
              color="white" 
            />
          </HStack>
        }
      />

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
                  const game: Partial<GameData> = {
                    ...gameDetails,
                    platforms: [],
                    articles: [],
                    developer: {
                      id: '',
                      name: '',
                      isDeveloper: true,
                      isPublisher: false,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      _count: {
                        gamesAsDev: 0,
                        gamesAsPub: 0
                      }
                    },
                    publisher: {
                      id: '',
                      name: '',
                      isDeveloper: false,
                      isPublisher: true,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      _count: {
                        gamesAsDev: 0,
                        gamesAsPub: 0
                      }
                    },
                    releaseDate: null,
                    description: ''
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

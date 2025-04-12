'use client'

import {
  Box,
  Container,
  Text,
  Stack,
  SimpleGrid,
  HStack,
  Icon,
  Button,
  Alert,
  AlertIcon,
  Skeleton,
  Divider,
  useColorModeValue,
  Heading
} from '@chakra-ui/react'
import { Hero } from '@/components/common/Hero'
import { FaBuilding, FaGamepad } from 'react-icons/fa'
import { BsCalendar4, BsArrowLeft } from 'react-icons/bs'
import { useParams, useRouter } from 'next/navigation'
import { ArticlePreview } from '@/components/articles/ArticlePreview'
import { DateDisplay } from '@/components/common/DateDisplay'
import { useGame, type RelatedArticle } from '@/hooks/useGame'

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { data: game, isLoading, error } = useGame(id)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Error loading game
        </Alert>
      </Container>
    )
  }

  if (isLoading || !game) {
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

  return (
    <Box>
      <Hero
        title={game.title}
        image={game.coverImage || undefined}
        badges={game.platforms.map(platform => ({
          id: platform.id,
          label: platform.name,
          colorScheme: 'blue'
        }))}
        metadata={game.releaseDate && (
          <HStack>
            <Icon as={BsCalendar4} />
            <Text>
              Release: <DateDisplay date={game.releaseDate} format="long" />
            </Text>
          </HStack>
        )}
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
            Retour aux jeux
          </Button>

          {/* Game Info */}
          <Stack
            bg={bgColor}
            p={8}
            rounded="lg"
            border="1px"
            borderColor={borderColor}
            shadow="sm"
            spacing={6}
          >
            <Stack spacing={4}>
              <HStack alignItems="start">
                <Icon as={FaBuilding} mt={1} />
                <Stack>
                  <Text fontWeight="bold">Développeur</Text>
                  <Text>{game.developer.name}</Text>
                </Stack>
              </HStack>
              <HStack alignItems="start">
                <Icon as={FaBuilding} mt={1} />
                <Stack>
                  <Text fontWeight="bold">Éditeur</Text>
                  <Text>{game.publisher.name}</Text>
                </Stack>
              </HStack>
            </Stack>

            <Divider />

            <Stack>
              <Heading size="md">Description</Heading>
              <Text whiteSpace="pre-wrap">{game.description}</Text>
            </Stack>
          </Stack>

          {/* Articles Section */}
          {game.articles.length > 0 && (
            <Box>
              <HStack mb={4}>
                <Icon as={FaGamepad} />
                <Heading size="md">Articles liés</Heading>
              </HStack>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {game.articles
                  .filter((article): article is RelatedArticle & { publishedAt: Date } => article.publishedAt !== null && article.user !== null)
                  .map((article) => (
                  <ArticlePreview key={article.id} article={article} />
                ))}
              </SimpleGrid>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  )
}

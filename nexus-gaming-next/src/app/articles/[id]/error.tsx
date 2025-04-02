'use client'

import React from 'react'
import {
  Container,
  Stack,
  Heading,
  Text,
  Button,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { BsArrowLeft } from 'react-icons/bs'
import { useRouter } from 'next/navigation'

export default function ArticleError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const router = useRouter()

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8} align="start">
        <Button
          leftIcon={<Icon as={BsArrowLeft} />}
          variant="ghost"
          onClick={() => router.back()}
        >
          Retour aux articles
        </Button>

        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          rounded="lg"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Article non trouvé
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {error.message || "L'article que vous recherchez n'existe pas ou a été supprimé."}
          </AlertDescription>
        </Alert>

        <Stack direction="row" spacing={4} align="center" alignSelf="center">
          <Button onClick={reset} colorScheme="blue">
            Réessayer
          </Button>
          <Button onClick={() => router.push('/articles')} variant="ghost">
            Voir tous les articles
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}

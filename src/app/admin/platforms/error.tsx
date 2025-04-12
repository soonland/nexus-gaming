'use client'

import {
  Container,
  VStack,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

export default function PlatformsError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const router = useRouter()

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          borderRadius="lg"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Une erreur est survenue
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {error.message || "Impossible de charger la page des plateformes"}
          </AlertDescription>
        </Alert>

        <VStack spacing={4}>
          <Button colorScheme="blue" onClick={() => reset()}>
            Réessayer
          </Button>
          <Button variant="ghost" onClick={() => router.push('/admin')}>
            Retour au tableau de bord
          </Button>
        </VStack>
      </VStack>
    </Container>
  )
}

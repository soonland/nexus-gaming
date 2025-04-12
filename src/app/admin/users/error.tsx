'use client'

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Container,
} from '@chakra-ui/react'
import { useEffect } from 'react'

export default function UserListError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error('Users page error:', error)
  }, [error])

  return (
    <Container maxW="container.xl" py={8}>
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
        borderRadius="md"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Error Loading Users
        </AlertTitle>
        <AlertDescription maxWidth="sm" mb={4}>
          {error.message || 'An unexpected error occurred while loading the users.'}
        </AlertDescription>
        <Button colorScheme="red" onClick={reset}>
          Try Again
        </Button>
      </Alert>
    </Container>
  )
}

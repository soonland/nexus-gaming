'use client'

import React from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { login, user } = useAuth()
  const router = useRouter()
  const toast = useToast()

  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (user) {
      router.replace('/games')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      await login({ email, password })
      toast({
        title: 'Connexion réussie',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Erreur de connexion',
        description: 'Email ou mot de passe incorrect',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.sm" py={8}>
      <Box bg="white" p={8} rounded="lg" shadow="base">
        <Stack spacing={4}>
          <Heading size="lg" textAlign="center">
            Connexion
          </Heading>
          <Text color="gray.600" textAlign="center">
            Connectez-vous à votre compte
          </Text>

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  autoComplete="email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Mot de passe</FormLabel>
                <Input
                  name="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  autoComplete="current-password"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontSize="md"
                isLoading={isLoading}
              >
                Se connecter
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Container>
  )
}

import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Alert,
  AlertIcon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'
import { ApiError } from '@/services/api/client'

export const LoginForm = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const response = await login({ email, password })
      if (response.user) {
        navigate('/')
      }
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      maxWidth="450px"
      mx="auto"
      mt={12}
      p={8}
      borderRadius="xl"
      boxShadow="xl"
      bg={useColorModeValue('white', 'gray.800')}
      border="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <VStack spacing={6} align="stretch">
        <VStack spacing={2}>
          <Heading size="xl" textAlign="center" color={useColorModeValue('blue.600', 'blue.200')}>
            Bienvenue
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')} textAlign="center">
            Connectez-vous à votre compte
          </Text>
        </VStack>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              size="lg"
              placeholder="votre@email.com"
              borderRadius="md"
              _hover={{ borderColor: 'blue.400' }}
              _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Mot de passe</FormLabel>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              size="lg"
              borderRadius="md"
              _hover={{ borderColor: 'blue.400' }}
              _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
            />
          </FormControl>
        </VStack>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width="100%"
          height="50px"
          isLoading={loading}
          borderRadius="md"
          _hover={{
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          }}
          _active={{
            transform: 'translateY(0)',
            boxShadow: 'md',
          }}
        >
          Se connecter
        </Button>
      </VStack>
    </Box>
  )
}

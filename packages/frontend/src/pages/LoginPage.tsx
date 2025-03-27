import React from 'react'
import { Container } from '@chakra-ui/react'
import { LoginForm } from '@/components/auth/LoginForm'

export const LoginPage = () => {
  return (
    <Container maxW="container.sm">
      <LoginForm />
    </Container>
  )
}

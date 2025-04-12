'use client'

import { Container, Alert, AlertIcon } from '@chakra-ui/react'

export default function NewGameError() {
  return (
    <Container maxW="container.xl" py={8}>
      <Alert status="error">
        <AlertIcon />
        Une erreur est survenue lors de la création du jeu
      </Alert>
    </Container>
  )
}

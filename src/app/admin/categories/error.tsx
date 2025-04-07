'use client'

import { Container, Alert, AlertIcon } from '@chakra-ui/react'

export default function CategoriesErrorPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <Alert status="error">
        <AlertIcon />
        Une erreur est survenue lors du chargement des catégories
      </Alert>
    </Container>
  )
}

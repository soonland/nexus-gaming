'use client'

import { Container, Alert, AlertIcon } from '@chakra-ui/react'

export default function NewCategoryErrorPage() {
  return (
    <Container maxW="container.md" py={8}>
      <Alert status="error">
        <AlertIcon />
        Une erreur est survenue lors de la création de la catégorie
      </Alert>
    </Container>
  )
}

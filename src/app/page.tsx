'use client'

import { Box, Container, Heading, Text } from '@chakra-ui/react'

export default function Home() {
  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center" py={10}>
        <Heading as="h1" size="2xl" mb={4}>
          Nexus Gaming
        </Heading>
        <Text fontSize="xl" color="gray.600">
          Your gaming community hub
        </Text>
      </Box>
    </Container>
  )
}

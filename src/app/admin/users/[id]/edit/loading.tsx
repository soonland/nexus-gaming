import {
  Container,
  Heading,
  VStack,
  Skeleton,
  Box,
} from '@chakra-ui/react'

export default function EditUserLoading() {
  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">
          <Skeleton height="36px" width="200px" />
        </Heading>
        <Box>
          <VStack spacing={4} align="stretch">
            <Skeleton height="40px" />
            <Skeleton height="40px" />
            <Skeleton height="40px" />
            <Skeleton height="40px" />
            <Skeleton height="40px" width="200px" alignSelf="flex-end" />
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}

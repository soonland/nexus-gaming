import {
  Container,
  Stack,
  Skeleton,
  SkeletonText,
  Box,
} from '@chakra-ui/react'

export default function ArticleLoading() {
  return (
    <Box>
      <Skeleton height={{ base: '300px', md: '400px' }} />
      <Container maxW="container.xl" py={8}>
        <Stack spacing={8}>
          <Skeleton height="40px" width="150px" />
          <Box p={8} rounded="lg" border="1px" borderColor="gray.200">
            <SkeletonText mt="4" noOfLines={8} spacing="4" skeletonHeight="3" />
          </Box>
          <Stack spacing={4}>
            <Skeleton height="30px" width="200px" />
            <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
              <Skeleton height="300px" flex="1" />
              <Skeleton height="300px" flex="1" />
              <Skeleton height="300px" flex="1" />
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

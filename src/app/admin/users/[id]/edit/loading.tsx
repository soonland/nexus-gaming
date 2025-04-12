import { Container, Heading, VStack, Skeleton, Box } from '@chakra-ui/react';

export default function EditUserLoading() {
  return (
    <Container maxW='container.md' py={8}>
      <VStack align='stretch' spacing={8}>
        <Heading size='lg'>
          <Skeleton height='36px' width='200px' />
        </Heading>
        <Box>
          <VStack align='stretch' spacing={4}>
            <Skeleton height='40px' />
            <Skeleton height='40px' />
            <Skeleton height='40px' />
            <Skeleton height='40px' />
            <Skeleton alignSelf='flex-end' height='40px' width='200px' />
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

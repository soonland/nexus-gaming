import {
  Container,
  Stack,
  Skeleton,
  SkeletonText,
  Box,
} from '@chakra-ui/react';

const ArticleLoading = () => {
  return (
    <Box>
      <Skeleton height={{ base: '300px', md: '400px' }} />
      <Container maxW='container.xl' py={8}>
        <Stack spacing={8}>
          <Skeleton height='40px' width='150px' />
          <Box border='1px' borderColor='gray.200' p={8} rounded='lg'>
            <SkeletonText mt='4' noOfLines={8} skeletonHeight='3' spacing='4' />
          </Box>
          <Stack spacing={4}>
            <Skeleton height='30px' width='200px' />
            <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
              <Skeleton flex='1' height='300px' />
              <Skeleton flex='1' height='300px' />
              <Skeleton flex='1' height='300px' />
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default ArticleLoading;

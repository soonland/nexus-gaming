import {
  Box,
  Container,
  Stack,
  Skeleton,
  SkeletonText,
  HStack,
} from '@chakra-ui/react';

const GameLoading = () => {
  return (
    <Box>
      <Skeleton height={{ base: '300px', md: '400px' }} />
      <Container maxW='container.xl' py={8}>
        <Stack spacing={8}>
          <Skeleton height='40px' width='150px' />

          <Box border='1px' borderColor='gray.200' p={8} rounded='lg'>
            <Stack spacing={6}>
              <Stack spacing={4}>
                <HStack spacing={4}>
                  <Skeleton height='24px' width='24px' />
                  <Stack flex={1}>
                    <Skeleton height='20px' width='100px' />
                    <Skeleton height='20px' width='150px' />
                  </Stack>
                </HStack>
                <HStack spacing={4}>
                  <Skeleton height='24px' width='24px' />
                  <Stack flex={1}>
                    <Skeleton height='20px' width='100px' />
                    <Skeleton height='20px' width='150px' />
                  </Stack>
                </HStack>
              </Stack>

              <Skeleton height='1px' />

              <Stack>
                <Skeleton height='24px' width='150px' />
                <SkeletonText
                  mt='4'
                  noOfLines={6}
                  skeletonHeight='3'
                  spacing='4'
                />
              </Stack>
            </Stack>
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

export default GameLoading;

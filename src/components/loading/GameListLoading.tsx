'use client';

import {
  Box,
  Container,
  VStack,
  HStack,
  Skeleton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

const GameListLoading = () => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW='container.xl' py={8}>
      <VStack align='stretch' spacing={8}>
        <HStack justify='space-between'>
          <Skeleton height='36px' width='250px' />
          <Skeleton height='40px' width='150px' />
        </HStack>

        <Box>
          <HStack mb={4}>
            <Skeleton height='40px' width='300px' />
          </HStack>

          <Box
            borderColor={borderColor}
            borderWidth='1px'
            overflowX='auto'
            rounded='lg'
          >
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>Titre</Th>
                  <Th>Développeur</Th>
                  <Th>Éditeur</Th>
                  <Th>Date de sortie</Th>
                  <Th>Plateformes</Th>
                  <Th width='150px'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {[...Array(5)].map((_, i) => (
                  <Tr key={i}>
                    <Td>
                      <Skeleton height='20px' width='200px' />
                    </Td>
                    <Td>
                      <Skeleton height='20px' width='150px' />
                    </Td>
                    <Td>
                      <Skeleton height='20px' width='150px' />
                    </Td>
                    <Td>
                      <Skeleton height='20px' width='120px' />
                    </Td>
                    <Td>
                      <Wrap>
                        {[...Array(3)].map((_, j) => (
                          <WrapItem key={j}>
                            <Skeleton
                              borderRadius='full'
                              height='20px'
                              width='60px'
                            />
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Skeleton height='32px' width='32px' />
                        <Skeleton height='32px' width='32px' />
                        <Skeleton height='32px' width='32px' />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
};

export default GameListLoading;

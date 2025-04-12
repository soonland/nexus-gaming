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
} from '@chakra-ui/react';

export default function ArticleListLoading() {
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
                  <Th>Catégorie</Th>
                  <Th>Status</Th>
                  <Th>Date de publication</Th>
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
                      <Skeleton height='20px' width='120px' />
                    </Td>
                    <Td>
                      <Skeleton height='20px' width='80px' />
                    </Td>
                    <Td>
                      <Skeleton height='20px' width='150px' />
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
}

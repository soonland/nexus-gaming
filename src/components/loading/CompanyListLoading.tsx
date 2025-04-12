'use client';

import {
  Container,
  VStack,
  Skeleton,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
} from '@chakra-ui/react';

const CompanyListLoading = () => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW='container.xl' py={8}>
      <VStack align='stretch' spacing={8}>
        <Skeleton height='40px' width='300px' />

        <Box borderColor={borderColor} borderWidth='1px' rounded='lg'>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>Nom</Th>
                <Th>Type</Th>
                <Th>Jeux</Th>
                <Th width='100px'>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {[...Array(5)].map((_, i) => (
                <Tr key={i}>
                  <Td>
                    <Skeleton height='20px' width='150px' />
                  </Td>
                  <Td>
                    <Skeleton height='20px' width='120px' />
                  </Td>
                  <Td>
                    <Skeleton height='20px' width='80px' />
                  </Td>
                  <Td>
                    <Skeleton height='32px' width='80px' />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Container>
  );
};

export default CompanyListLoading;

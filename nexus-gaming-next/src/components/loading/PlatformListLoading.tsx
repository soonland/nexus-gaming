'use client'

import React from 'react'
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
} from '@chakra-ui/react'

export default function PlatformListLoading() {
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Skeleton height="40px" width="300px" />
        
        <Box borderWidth="1px" borderColor={borderColor} rounded="lg">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nom</Th>
                <Th>Fabricant</Th>
                <Th>Date de sortie</Th>
                <Th>Nombre de jeux</Th>
                <Th width="100px">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {[...Array(5)].map((_, i) => (
                <Tr key={i}>
                  <Td><Skeleton height="20px" width="150px" /></Td>
                  <Td><Skeleton height="20px" width="120px" /></Td>
                  <Td><Skeleton height="20px" width="100px" /></Td>
                  <Td><Skeleton height="20px" width="50px" /></Td>
                  <Td><Skeleton height="32px" width="80px" /></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Container>
  )
}

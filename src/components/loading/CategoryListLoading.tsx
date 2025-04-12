'use client'

import {
  Box,
  Skeleton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'

export default function CategoryListLoading() {
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box overflowX="auto" borderWidth="1px" borderColor={borderColor} rounded="lg">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nom</Th>
            <Th>Nombre d'articles</Th>
            <Th width="100px">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {[...Array(5)].map((_, i) => (
            <Tr key={i}>
              <Td>
                <Skeleton height="20px" width="200px" />
              </Td>
              <Td>
                <Skeleton height="20px" width="50px" />
              </Td>
              <Td>
                <HStack spacing={2}>
                  <Skeleton height="32px" width="32px" />
                  <Skeleton height="32px" width="32px" />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Skeleton,
  Box,
  Container,
} from '@chakra-ui/react'

export default function UserListLoading() {
  // Create an array of 5 loading rows
  const loadingRows = Array.from({ length: 5 }, (_, i) => (
    <Tr key={i}>
      <Td><Skeleton height="20px" width="150px" /></Td>
      <Td><Skeleton height="20px" width="200px" /></Td>
      <Td><Skeleton height="20px" width="80px" /></Td>
      <Td><Skeleton height="20px" width="80px" /></Td>
      <Td><Skeleton height="20px" width="40px" /></Td>
      <Td><Skeleton height="20px" width="100px" /></Td>
      <Td><Skeleton height="30px" width="30px" borderRadius="md" /></Td>
    </Tr>
  ))

  return (
    <Container maxW="container.xl" py={8}>
      <Box overflowX="auto">
        <Table>
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Articles</Th>
              <Th>Created</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {loadingRows}
          </Tbody>
        </Table>
      </Box>
    </Container>
  )
}

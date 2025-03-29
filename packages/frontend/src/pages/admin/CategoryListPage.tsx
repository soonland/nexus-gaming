import { Box, Container } from '@chakra-ui/react'
import { CategoryList } from '../../components/categories/CategoryList'

export const CategoryListPage = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <CategoryList />
      </Box>
    </Container>
  )
}

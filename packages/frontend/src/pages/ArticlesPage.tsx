import { Box, Container, Heading } from "@chakra-ui/react"
import { ArticleList } from "../components/articles/ArticleList"

export const ArticlesPage = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading>Articles</Heading>
      </Box>
      <ArticleList />
    </Container>
  )
}

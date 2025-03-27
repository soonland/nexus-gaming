import { Box, Container } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/shared/Navbar'
import { GamesPage } from '@/pages/GamesPage'
import { ArticleList } from '@/components/articles/ArticleList'
import { ArticleDetail } from '@/components/articles/ArticleDetail'

export default function App() {
  return (
    <Box minH="100vh">
      <Navbar />
      <Container py={8}>
        <Routes>
          <Route path="/" element={<GamesPage />} />
          <Route path="/articles" element={<ArticleList />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
        </Routes>
      </Container>
    </Box>
  )
}

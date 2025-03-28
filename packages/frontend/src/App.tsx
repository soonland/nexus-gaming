import React from 'react'
import { Box, Container } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/providers/AuthProvider'
import { Navbar } from '@/components/shared/Navbar'
import { GamesPage } from '@/pages/GamesPage'
import { LoginPage } from '@/pages/LoginPage'
import { ArticleList } from '@/components/articles/ArticleList'
import { ArticleDetail } from '@/components/articles/ArticleDetail'
import { AdminRoute } from '@/components/admin/AdminRoute'
import { AdminGameListPage } from '@/pages/admin/GameListPage'
import { AdminGameFormPage } from '@/pages/admin/GameFormPage'
import { AdminPlatformListPage } from '@/pages/admin/PlatformListPage'
import { AdminPlatformFormPage } from '@/pages/admin/PlatformFormPage'

export default function App() {
  return (
    <AuthProvider>
      <Box minH="100vh">
      <Navbar />
      <Container py={8}>
        <Routes>
          <Route path="/" element={<GamesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/articles" element={<ArticleList />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          
          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/games" element={<AdminGameListPage />} />
            <Route path="/admin/games/new" element={<AdminGameFormPage />} />
            <Route path="/admin/games/:id/edit" element={<AdminGameFormPage />} />
            
            <Route path="/admin/platforms" element={<AdminPlatformListPage />} />
            <Route path="/admin/platforms/new" element={<AdminPlatformFormPage />} />
            <Route path="/admin/platforms/:id/edit" element={<AdminPlatformFormPage />} />
          </Route>
        </Routes>
      </Container>
      </Box>
    </AuthProvider>
  )
}

'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useUserTheme } from '@/hooks/useUserTheme'
import { ChakraProvider } from '@chakra-ui/react'

const ThemeContext = createContext<ReturnType<typeof useUserTheme> | null>(null)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeContext = useUserTheme()

  return (
    <ThemeContext.Provider value={themeContext}>
      <ChakraProvider theme={themeContext.themeObject}>
        {children}
      </ChakraProvider>
    </ThemeContext.Provider>
  )
}

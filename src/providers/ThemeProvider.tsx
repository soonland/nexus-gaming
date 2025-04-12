'use client';

import { ChakraProvider } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import { useUserTheme } from '@/hooks/useUserTheme';

const ThemeContext = createContext<ReturnType<typeof useUserTheme> | null>(
  null
);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const themeContext = useUserTheme();

  return (
    <ThemeContext.Provider value={themeContext}>
      <ChakraProvider theme={themeContext.themeObject}>
        {children}
      </ChakraProvider>
    </ThemeContext.Provider>
  );
};

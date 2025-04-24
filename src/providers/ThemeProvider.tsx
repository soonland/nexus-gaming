'use client';

import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { createContext, useContext, useEffect, useState } from 'react';

// Theme definitions
const themes = {
  light: createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
    },
  }),
  dark: createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
      },
      secondary: {
        main: '#f48fb1',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    },
  }),
  gaming: createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#00ff00',
      },
      secondary: {
        main: '#ff00ff',
      },
      background: {
        default: '#1a1a1a',
        paper: '#2d2d2d',
      },
    },
  }),
  retro: createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#ffcc00',
      },
      secondary: {
        main: '#ff6b6b',
      },
      background: {
        default: '#2d2d2d',
        paper: '#3d3d3d',
      },
    },
  }),
};

export type ThemeOption = keyof typeof themes;

const THEME_KEY = 'nexus-theme-preference';

interface IThemeContextType {
  currentTheme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
  themeNames: Record<ThemeOption, string>;
}

const ThemeContext = createContext<IThemeContextType | null>(null);

export const themeNames: Record<ThemeOption, string> = {
  light: 'Clair',
  dark: 'Sombre',
  gaming: 'Gaming',
  retro: 'Rétro',
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize with default theme (light)
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>('light');

  useEffect(() => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem(THEME_KEY) as ThemeOption;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const setTheme = (theme: ThemeOption) => {
    setCurrentTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themeNames }}>
      <MuiThemeProvider theme={themes[currentTheme]}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};

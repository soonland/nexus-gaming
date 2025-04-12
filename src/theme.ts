import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const themeColors = {
  default: {
    colors: {
      blue: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
    },
  },
  gaming: {
    colors: {
      purple: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7e22ce',
        800: '#6b21a8',
        900: '#581c87',
      },
    },
  },
  nature: {
    colors: {
      green: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      },
    },
  },
  retro: {
    colors: {
      orange: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
      },
    },
  },
} as const;

const themeColorMap = {
  default: 'blue',
  gaming: 'purple',
  nature: 'green',
  retro: 'orange',
} as const;

export type ThemeName = keyof typeof themeColors;
export { themeColorMap };

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const createTheme = (themeName: ThemeName) => {
  const themeColor = themeColors[themeName];
  const colorScheme = themeColorMap[themeName];
  return {
    config,
    styles: {
      global: {
        body: {
          minHeight: '100vh',
          bg: 'gray.50',
          color: 'gray.800',
          _dark: {
            bg: 'gray.900',
            color: 'white',
          },
        },
      },
    },
    colors: themeColor.colors,
    components: {
      Button: {
        defaultProps: {
          colorScheme: colorScheme,
        },
      },
      Card: {
        baseStyle: {
          container: {
            boxShadow: 'lg',
            rounded: 'lg',
            p: 4,
          },
        },
      },
    },
  };
};

// Exporter le thème par défaut initialement
export const theme = extendTheme(createTheme('default'));

// Exporter la fonction pour créer de nouveaux thèmes
export const createCustomTheme = (themeName: ThemeName) =>
  extendTheme(createTheme(themeName));

import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { GameMeta } from './GameMeta';

const meta = {
  title: 'Games/GameMeta',
  component: GameMeta,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <Box sx={{ p: 2 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof GameMeta>;

export default meta;
type Story = StoryObj<typeof GameMeta>;

const releaseDate = new Date('2025-04-26');

export const Default: Story = {
  args: {
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    releaseDate,
  },
};

export const WithoutIcon: Story = {
  args: {
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    releaseDate,
    showIcon: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Affiche les métadonnées sans l'icône.",
      },
    },
  },
};

export const WithoutDate: Story = {
  args: {
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
  },
  parameters: {
    docs: {
      description: {
        story: 'Pour les jeux sans date de sortie définie.',
      },
    },
  },
};

export const CustomIconSize: Story = {
  args: {
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    releaseDate,
    iconSize: 24,
  },
  parameters: {
    docs: {
      description: {
        story: "Permet de personnaliser la taille de l'icône.",
      },
    },
  },
};

export const WithCustomColor: Story = {
  args: {
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    releaseDate,
    sx: { color: 'primary.main' },
  },
  parameters: {
    docs: {
      description: {
        story: 'La couleur est personnalisable via la prop sx.',
      },
    },
  },
};

export const OnDarkBackground: Story = {
  args: {
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    releaseDate,
    sx: { color: 'common.white' },
  },
  decorators: [
    Story => (
      <Box sx={{ bgcolor: 'grey.900', p: 2 }}>
        <Story />
      </Box>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Le composant peut être utilisé sur un fond sombre en ajustant la couleur.',
      },
    },
  },
};

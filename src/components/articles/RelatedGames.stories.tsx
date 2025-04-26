import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { RelatedGames } from './RelatedGames';

const meta = {
  title: 'Articles/RelatedGames',
  component: RelatedGames,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <Box sx={{ maxWidth: 1200, width: '100%', p: 2 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof RelatedGames>;

export default meta;
type Story = StoryObj<typeof RelatedGames>;

const baseGame = {
  id: 'game-1',
  title: 'Cyberpunk 2077',
  description: 'Un RPG futuriste en monde ouvert',
  coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
  releaseDate: '2024-05-01',
};

export const Default: Story = {
  args: {
    games: [
      baseGame,
      {
        ...baseGame,
        id: 'game-2',
        title: 'The Witcher 4',
        description: 'La nouvelle aventure de la saga Witcher',
        coverImage: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f',
      },
      {
        ...baseGame,
        id: 'game-3',
        title: 'Final Fantasy XVI',
        description: 'Le nouveau chapitre de la série Final Fantasy',
        coverImage:
          'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd',
      },
    ],
  },
};

export const SingleGame: Story = {
  args: {
    games: [baseGame],
  },
  parameters: {
    docs: {
      description: {
        story: 'Affichage avec un seul jeu.',
      },
    },
  },
};

export const WithoutIcon: Story = {
  args: {
    ...Default.args,
    showIcon: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Sans icône dans le titre.',
      },
    },
  },
};

export const CustomTitle: Story = {
  args: {
    ...Default.args,
    title: 'Jeux similaires',
  },
  parameters: {
    docs: {
      description: {
        story: 'Avec un titre personnalisé.',
      },
    },
  },
};

export const LargeIcon: Story = {
  args: {
    ...Default.args,
    iconSize: 32,
  },
  parameters: {
    docs: {
      description: {
        story: "Avec une icône plus grande pour plus d'emphase.",
      },
    },
  },
};

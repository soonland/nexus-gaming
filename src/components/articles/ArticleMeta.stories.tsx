import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { ArticleMeta } from './ArticleMeta';

const meta = {
  title: 'Articles/ArticleMeta',
  component: ArticleMeta,
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
} satisfies Meta<typeof ArticleMeta>;

export default meta;
type Story = StoryObj<typeof ArticleMeta>;

const date = new Date('2025-04-26T10:00:00Z');

export const Default: Story = {
  args: {
    username: 'john.doe',
    publishedAt: date,
  },
};

export const WithoutIcon: Story = {
  args: {
    username: 'john.doe',
    publishedAt: date,
    showIcon: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Affiche les métadonnées sans l'icône utilisateur.",
      },
    },
  },
};

export const CustomIconSize: Story = {
  args: {
    username: 'john.doe',
    publishedAt: date,
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
    username: 'john.doe',
    publishedAt: date,
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
    username: 'john.doe',
    publishedAt: date,
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

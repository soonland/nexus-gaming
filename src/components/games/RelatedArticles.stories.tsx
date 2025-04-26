import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { RelatedArticles } from './RelatedArticles';
import type { ArticleStatus } from '@/types/api';

const meta = {
  title: 'Games/RelatedArticles',
  component: RelatedArticles,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <Box sx={{ maxWidth: 1200, width: '100%' }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof RelatedArticles>;

export default meta;
type Story = StoryObj<typeof RelatedArticles>;

const baseArticle = {
  id: 'article-1',
  title: 'Test des nouvelles fonctionnalités',
  content: 'Contenu détaillé de notre test...',
  category: {
    id: 'reviews',
    name: 'Tests',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  user: {
    id: 'user-1',
    username: 'john.doe',
    role: 'USER' as const,
  },
  status: 'PUBLISHED' as ArticleStatus,
  publishedAt: '2025-04-26T10:00:00Z',
  createdAt: '2025-04-26T10:00:00Z',
  updatedAt: '2025-04-26T10:00:00Z',
};

export const Default: Story = {
  args: {
    articles: [
      baseArticle,
      {
        ...baseArticle,
        id: 'article-2',
        title: 'Guide des combats',
        category: {
          ...baseArticle.category,
          id: 'guides',
          name: 'Guides',
        },
      },
      {
        ...baseArticle,
        id: 'article-3',
        title: 'Les easter eggs cachés',
        category: {
          ...baseArticle.category,
          id: 'news',
          name: 'News',
        },
      },
    ],
  },
};

export const SingleArticle: Story = {
  args: {
    articles: [baseArticle],
  },
  parameters: {
    docs: {
      description: {
        story: 'Affichage avec un seul article.',
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
    title: 'Derniers articles',
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

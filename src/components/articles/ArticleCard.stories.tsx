import type { Role } from '@prisma/client';
import type { Meta, StoryObj } from '@storybook/react';

import type { ArticleStatus } from '@/types/api';

import { ArticleCard } from './ArticleCard';

// Wrapper component to simplify story controls
const ArticleCardWrapper = ({
  title = 'Article Title',
  heroImage,
  status = 'PUBLISHED',
  categoryName = 'Technology',
  publishedAt,
  games = [],
}: {
  title?: string;
  heroImage?: string;
  status?: ArticleStatus;
  categoryName?: string;
  publishedAt?: string;
  games?: Array<{ id: string; title: string }>;
}) => {
  const article = {
    id: '1',
    content: 'Article content...',
    title,
    heroImage,
    status,
    publishedAt,
    category: {
      id: '1',
      name: categoryName,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    },
    user: {
      id: '1',
      username: 'john.doe',
      role: 'USER' as Role,
    },
    games: games.map(game => ({
      ...game,
      developer: {
        id: '1',
        name: 'Game Studio',
        isDeveloper: true,
        isPublisher: false,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
      publisher: {
        id: '2',
        name: 'Game Publisher',
        isDeveloper: false,
        isPublisher: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
      platforms: [],
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    })),
    createdAt: '2025-04-26T10:00:00Z',
    updatedAt: '2025-04-26T10:00:00Z',
  };

  return <ArticleCard article={article} />;
};

const meta = {
  title: 'Articles/ArticleCard',
  component: ArticleCardWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    status: {
      control: 'select',
      options: [
        'DRAFT',
        'PENDING_APPROVAL',
        'NEEDS_CHANGES',
        'PUBLISHED',
        'ARCHIVED',
        'DELETED',
      ],
    },
    publishedAt: {
      control: 'date',
    },
  },
} satisfies Meta<typeof ArticleCardWrapper>;

export default meta;
type Story = StoryObj<typeof ArticleCardWrapper>;

export const Playground: Story = {
  args: {
    title: 'The Future of Gaming: Next-Gen Consoles',
    heroImage:
      'https://images.unsplash.com/photo-1486401899868-0e435ed85128?q=80&w=1770&auto=format&fit=crop',
    publishedAt: '2025-04-26T10:00:00Z',
    categoryName: 'Technology',
    status: 'PUBLISHED',
    games: [],
  },
};

export const WithGames: Story = {
  args: {
    title: 'Cross-Platform Gaming Revolution',
    heroImage:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1770&auto=format&fit=crop',
    publishedAt: '2025-04-25T15:30:00Z',
    categoryName: 'Analysis',
    games: [
      { id: '1', title: 'Cyberpunk 2077' },
      { id: '2', title: 'Elden Ring' },
    ],
  },
};

export const LongTitle: Story = {
  args: {
    title:
      'An In-depth Analysis of the Evolution of RPG Games Throughout the Decades: From Text Adventures to Modern Open Worlds',
    heroImage:
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1770&auto=format&fit=crop',
    publishedAt: '2025-04-24T08:15:00Z',
    categoryName: 'Analysis',
  },
};

export const NoImage: Story = {
  args: {
    title: 'The Rise of Indie Game Development',
    categoryName: 'Industry',
    publishedAt: '2025-04-23T14:45:00Z',
  },
};

export const WithTwoGames: Story = {
  args: {
    title: 'Comparing Two Epic RPGs',
    heroImage:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1770&auto=format&fit=crop',
    publishedAt: '2025-04-22T16:30:00Z',
    categoryName: 'Reviews',
    games: [
      { id: '1', title: 'Final Fantasy XVI' },
      { id: '2', title: 'Dragon Age: Dreadwolf' },
    ],
  },
};

export const Draft: Story = {
  args: {
    title: 'Upcoming Game Releases 2025',
    heroImage:
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=1770&auto=format&fit=crop',
    status: 'DRAFT',
    categoryName: 'News',
  },
};

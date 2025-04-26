import { Stack, Typography, type Theme, type SxProps } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import { FiUsers, FiUser } from 'react-icons/fi';

import { DateDisplay } from './DateDisplay';
import { Hero } from './Hero';

// ArticleHeroWrapper component
const ArticleHeroWrapper = ({
  title = 'Article Title',
  image,
  categoryName = 'Technology',
  publishedAt,
  author = { username: 'John Doe' },
  sx,
}: {
  title?: string;
  image?: string;
  categoryName?: string;
  publishedAt?: string;
  author?: { username: string };
  sx?: SxProps<Theme>;
}) => {
  const badge = categoryName
    ? [
        {
          id: crypto.randomUUID(),
          label: categoryName,
          color: 'primary' as const,
        },
      ]
    : [];

  return (
    <Hero
      badges={badge}
      image={image}
      metadata={
        <Stack alignItems='center' direction='row' spacing={3}>
          <Stack alignItems='center' direction='row' spacing={1}>
            <FiUser />
            <Typography variant='body2'>{author.username}</Typography>
          </Stack>
          {publishedAt && <DateDisplay date={new Date(publishedAt)} />}
        </Stack>
      }
      sx={sx}
      title={title}
    />
  );
};

// GameHeroWrapper component
const GameHeroWrapper = ({
  title = 'Game Title',
  image = '/images/placeholder-game.png',
  genre = 'Non catégorisé',
  releaseDate,
  developer = 'Studio',
  publisher = 'Publisher',
  sx,
}: {
  title?: string;
  image?: string;
  genre?: string;
  releaseDate?: string;
  developer?: string;
  publisher?: string;
  sx?: SxProps<Theme>;
}) => {
  return (
    <Hero
      badges={[
        {
          id: crypto.randomUUID(),
          label: genre,
          color: 'primary',
        },
      ]}
      image={image}
      metadata={
        <Stack alignItems='center' direction='row' spacing={3}>
          <Stack alignItems='center' direction='row' spacing={1}>
            <FiUsers />
            <Typography variant='body2'>
              {developer} / {publisher}
            </Typography>
          </Stack>
          {releaseDate && <DateDisplay date={new Date(releaseDate)} />}
        </Stack>
      }
      sx={sx}
      title={title}
    />
  );
};

const meta = {
  title: 'Common/Hero',
  component: Hero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof Hero>;

// Base Hero Stories
export const Default: Story = {
  args: {
    title: 'Welcome to Nexus Gaming',
  },
};

export const WithImage: Story = {
  args: {
    title: 'Featured Content',
    image:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
  },
};

export const WithBadges: Story = {
  args: {
    title: 'Multiple Categories',
    image:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
    badges: [
      { id: '1', label: 'Featured', color: 'primary' },
      { id: '2', label: 'New', color: 'secondary' },
      { id: '3', label: 'Popular', color: 'success' },
    ],
  },
};

// Article Hero Stories
export const ArticleHero: StoryObj<typeof ArticleHeroWrapper> = {
  render: args => <ArticleHeroWrapper {...args} />,
  args: {
    title: 'The Future of Gaming: Next-Gen Consoles Review',
    image:
      'https://images.unsplash.com/photo-1486401899868-0e435ed85128?q=80&w=1770&auto=format&fit=crop',
    categoryName: 'Reviews',
    publishedAt: '2025-04-26T10:00:00Z',
    author: {
      username: 'Sarah Parker',
    },
  },
};

export const ArticleHeroNoImage: StoryObj<typeof ArticleHeroWrapper> = {
  render: args => <ArticleHeroWrapper {...args} />,
  args: {
    title: 'Industry Analysis: The Rise of Indie Games',
    categoryName: 'Analysis',
    publishedAt: '2025-04-25T15:30:00Z',
    author: {
      username: 'Mike Johnson',
    },
  },
};

// Game Hero Stories
export const GameHero: StoryObj<typeof GameHeroWrapper> = {
  render: args => <GameHeroWrapper {...args} />,
  args: {
    title: 'Elden Ring',
    image:
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1770&auto=format&fit=crop',
    genre: 'RPG',
    releaseDate: '2022-02-25',
    developer: 'FromSoftware',
    publisher: 'Bandai Namco',
  },
};

export const GameHeroUpcoming: StoryObj<typeof GameHeroWrapper> = {
  render: args => <GameHeroWrapper {...args} />,
  args: {
    title: 'Dragon Age: Dreadwolf',
    image:
      'https://images.unsplash.com/photo-1496167117681-944f702be1f4?q=80&w=2070&auto=format&fit=crop',
    genre: 'RPG',
    developer: 'BioWare',
    publisher: 'Electronic Arts',
  },
};

import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { GameCard } from './GameCard';
import type { GameData, IPlatformData } from '@/types';

const GameCardWrapper = ({
  title = 'Game Title',
  description,
  releaseDate,
  coverImage,
  platforms = [],
}: {
  title?: string;
  description?: string;
  releaseDate?: string;
  coverImage?: string;
  platforms?: Array<IPlatformData>;
}) => {
  const game: Partial<GameData> = {
    id: '1',
    title,
    description,
    releaseDate,
    coverImage,
    platforms,
  };

  return <GameCard game={game} />;
};

const basePlatform = {
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  releaseDate: null,
};

const meta = {
  title: 'Games/GameCard',
  component: GameCardWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <Box sx={{ maxWidth: 345 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof GameCardWrapper>;

export default meta;
type Story = StoryObj<typeof GameCardWrapper>;

export const Default: Story = {
  args: {
    title: 'Cyberpunk 2077',
    description:
      'An open-world action game set in Night City, a megalopolis obsessed with power, glamour, and body modification.',
  },
};

export const WithPlatforms: Story = {
  args: {
    title: 'Elden Ring',
    description:
      'A new fantasy action-RPG from FromSoftware Inc. and BANDAI NAMCO Entertainment Inc.',
    coverImage:
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1770&auto=format&fit=crop',
    platforms: [
      {
        ...basePlatform,
        id: 'ps5',
        name: 'PS5',
        manufacturer: 'Sony',
      },
      {
        ...basePlatform,
        id: 'xbox',
        name: 'Xbox Series X',
        manufacturer: 'Microsoft',
      },
      {
        ...basePlatform,
        id: 'pc',
        name: 'PC',
        manufacturer: 'Multiple',
      },
    ],
  },
};

export const WithReleaseDate: Story = {
  args: {
    title: 'Final Fantasy XVI',
    description:
      'The latest entry in the legendary RPG series from Square Enix.',
    coverImage:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1770&auto=format&fit=crop',
    releaseDate: '2024-06-22',
    platforms: [
      {
        ...basePlatform,
        id: 'ps5',
        name: 'PS5',
        manufacturer: 'Sony',
      },
    ],
  },
};

export const LongDescription: Story = {
  args: {
    title: 'The Legend of Heroes: Trails into Reverie',
    description: `Experience an epic story spanning multiple characters and timelines. 
      The intertwining fates of three distinct protagonists will shape the future of 
      key locations in the series' universe. This grand finale to the long-running 
      saga delivers everything fans have come to love about the series: a massive 
      cast of characters, intricate political intrigue, deep worldbuilding, and 
      refined turn-based combat.`,
    coverImage:
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=1770&auto=format&fit=crop',
    releaseDate: '2024-07-07',
    platforms: [
      {
        ...basePlatform,
        id: 'ps5',
        name: 'PS5',
        manufacturer: 'Sony',
      },
      {
        ...basePlatform,
        id: 'switch',
        name: 'Switch',
        manufacturer: 'Nintendo',
      },
      {
        ...basePlatform,
        id: 'pc',
        name: 'PC',
        manufacturer: 'Multiple',
      },
    ],
  },
};

export const NoImage: Story = {
  args: {
    title: 'Upcoming Indie Game',
    description: 'A promising indie game currently in development.',
    releaseDate: '2025-01-01',
    platforms: [
      {
        ...basePlatform,
        id: 'pc',
        name: 'PC',
        manufacturer: 'Multiple',
      },
    ],
  },
};

export const MinimalData: Story = {
  args: {
    title: 'Untitled Game Project',
  },
};

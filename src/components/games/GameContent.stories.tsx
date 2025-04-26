import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { GameContent } from './GameContent';

const meta = {
  title: 'Games/GameContent',
  component: GameContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <Box sx={{ maxWidth: 800, width: '100%' }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof GameContent>;

export default meta;
type Story = StoryObj<typeof GameContent>;

const platforms = [
  {
    id: 'ps5',
    name: 'PlayStation 5',
    manufacturer: 'Sony',
  },
  {
    id: 'xbox',
    name: 'Xbox Series X',
    manufacturer: 'Microsoft',
  },
  {
    id: 'pc',
    name: 'PC',
    manufacturer: 'Multiple',
  },
];

const shortDescription = `Un jeu d'action-RPG en monde ouvert épique dans un univers post-apocalyptique.`;

const longDescription = `Plongez dans une aventure épique dans un monde post-apocalyptique où la nature a repris ses droits. 

Ce jeu d'action-RPG en monde ouvert vous propose :
- Un vaste monde à explorer
- Des combats intenses et stratégiques
- Une histoire riche et immersive
- Des graphismes nouvelle génération
- Un système de progression approfondi

Faites vos choix et forgez votre destin dans cet univers impitoyable où chaque décision compte. Créez des alliances, développez vos compétences et découvrez les mystères qui se cachent dans les ruines de l'ancien monde.

Le jeu propose également un mode coopératif en ligne pour partager l'aventure avec vos amis.`;

export const Default: Story = {
  args: {
    description: shortDescription,
    platforms,
  },
};

export const Contained: Story = {
  args: {
    description: shortDescription,
    platforms,
    variant: 'contained',
  },
};

export const DescriptionOnly: Story = {
  args: {
    description: shortDescription,
  },
  parameters: {
    docs: {
      description: {
        story: 'Affiche uniquement la description, sans plateformes.',
      },
    },
  },
};

export const PlatformsOnly: Story = {
  args: {
    platforms,
  },
  parameters: {
    docs: {
      description: {
        story: 'Affiche uniquement les plateformes, sans description.',
      },
    },
  },
};

export const LongDescription: Story = {
  args: {
    description: longDescription,
    platforms,
  },
  parameters: {
    docs: {
      description: {
        story: 'Affiche une description longue avec mise en forme.',
      },
    },
  },
};

export const SinglePlatform: Story = {
  args: {
    description: shortDescription,
    platforms: [platforms[0]],
  },
  parameters: {
    docs: {
      description: {
        story: 'Pour les jeux exclusifs à une plateforme.',
      },
    },
  },
};

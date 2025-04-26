import { Box, Stack } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import {
  FiBell,
  FiCheckCircle,
  FiHeart,
  FiStar,
  FiAlertCircle,
  FiMessageCircle,
} from 'react-icons/fi';

import { IconAnimation } from './IconAnimation';

const meta = {
  title: 'Common/IconAnimation',
  component: IconAnimation,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "Un wrapper qui ajoute une animation de survol à n'importe quel icône. Passez la souris sur les icônes pour voir l'effet.",
      },
    },
  },
  decorators: [
    Story => (
      <Box sx={{ p: 4, bgcolor: 'background.paper' }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof IconAnimation>;

export default meta;
type Story = StoryObj<typeof IconAnimation>;

export const Default: Story = {
  args: {
    children: <FiBell size={24} />,
  },
};

export const MultipleIcons: Story = {
  render: () => (
    <Stack
      spacing={4}
      sx={{
        'p': 2,
        'borderRadius': 2,
        'bgcolor': 'background.paper',
        '& > div': {
          display: 'flex',
          gap: 4,
        },
      }}
    >
      <Box sx={{ color: 'primary.main' }}>
        <IconAnimation>
          <FiBell size={24} />
        </IconAnimation>
        <IconAnimation>
          <FiCheckCircle size={24} />
        </IconAnimation>
        <IconAnimation>
          <FiHeart size={24} />
        </IconAnimation>
      </Box>
      <Box sx={{ color: 'secondary.main' }}>
        <IconAnimation>
          <FiStar size={24} />
        </IconAnimation>
        <IconAnimation>
          <FiAlertCircle size={24} />
        </IconAnimation>
        <IconAnimation>
          <FiMessageCircle size={24} />
        </IconAnimation>
      </Box>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "L'animation fonctionne avec tous types d'icônes et préserve leur couleur.",
      },
    },
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <Stack spacing={4}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          color: 'secondary.main',
        }}
      >
        <IconAnimation>
          <FiBell size={16} />
        </IconAnimation>
        <IconAnimation>
          <FiBell size={24} />
        </IconAnimation>
        <IconAnimation>
          <FiBell size={32} />
        </IconAnimation>
        <IconAnimation>
          <FiBell size={48} />
        </IconAnimation>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          color: 'primary.main',
        }}
      >
        <IconAnimation>
          <FiStar size={16} />
        </IconAnimation>
        <IconAnimation>
          <FiStar size={24} />
        </IconAnimation>
        <IconAnimation>
          <FiStar size={32} />
        </IconAnimation>
        <IconAnimation>
          <FiStar size={48} />
        </IconAnimation>
      </Box>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: "L'animation s'adapte automatiquement à la taille de l'icône.",
      },
    },
  },
};

export const CustomContent: Story = {
  render: () => (
    <Box
      sx={{
        display: 'flex',
        gap: 4,
      }}
    >
      <Box sx={{ color: 'warning.main' }}>
        <IconAnimation>
          <Box sx={{ border: 2, borderRadius: 1, p: 2 }}>
            <FiStar size={32} />
          </Box>
        </IconAnimation>
      </Box>
      <Box sx={{ color: 'info.main' }}>
        <IconAnimation>
          <Box
            sx={{
              bgcolor: 'info.main',
              color: 'info.contrastText',
              borderRadius: 1,
              p: 2,
            }}
          >
            <FiBell size={32} />
          </Box>
        </IconAnimation>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "L'animation peut être appliquée à n'importe quel contenu, pas seulement les icônes.",
      },
    },
  },
};

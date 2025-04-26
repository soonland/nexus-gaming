import { Box, Typography } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { SideColorBadge } from './SideColorBadge';

const meta = {
  title: 'Common/SideColorBadge',
  component: SideColorBadge,
  tags: ['autodocs'],
} satisfies Meta<typeof SideColorBadge>;

export default meta;
type Story = StoryObj<typeof SideColorBadge>;

export const Default: Story = {
  args: {
    children: <div style={{ padding: '16px' }}>Default Badge Content</div>,
  },
};

export const CustomColor: Story = {
  args: {
    children: <div style={{ padding: '16px' }}>Content with Custom Color</div>,
    color: '#2196f3',
  },
};

export const RichContent: Story = {
  args: {
    children: (
      <Box p={2}>
        <Typography variant='h6'>Rich Content Example</Typography>
        <Typography>With multiple elements inside</Typography>
      </Box>
    ),
    color: '#4caf50',
  },
};

export const LongContent: Story = {
  args: {
    children: (
      <Box p={2} width='300px'>
        <Typography variant='h6'>Notification Title</Typography>
        <Typography color='text.secondary' variant='body2'>
          This is a longer piece of content that demonstrates how the side color
          badge extends the full height of its container, no matter how much
          content is inside.
        </Typography>
      </Box>
    ),
    color: '#ff9800',
  },
};

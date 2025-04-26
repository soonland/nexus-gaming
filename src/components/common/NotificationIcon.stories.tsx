import { Stack, Typography } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { NotificationIcon } from './NotificationIcon';

const meta = {
  title: 'Common/NotificationIcon',
  component: NotificationIcon,
  tags: ['autodocs'],
} satisfies Meta<typeof NotificationIcon>;

export default meta;
type Story = StoryObj<typeof NotificationIcon>;

export const Default: Story = {
  args: {
    type: 'SYSTEM_ALERT',
  },
};

// Story showing all notification types
const AllTypes = () => (
  <Stack spacing={2}>
    <Stack alignItems='center' direction='row' spacing={2}>
      <NotificationIcon type='ARTICLE_REVIEW' />
      <Typography variant='body2'>ARTICLE_REVIEW</Typography>
    </Stack>
    <Stack alignItems='center' direction='row' spacing={2}>
      <NotificationIcon type='STATUS_CHANGE' />
      <Typography variant='body2'>STATUS_CHANGE</Typography>
    </Stack>
    <Stack alignItems='center' direction='row' spacing={2}>
      <NotificationIcon type='MENTION' />
      <Typography variant='body2'>MENTION</Typography>
    </Stack>
    <Stack alignItems='center' direction='row' spacing={2}>
      <NotificationIcon type='SYSTEM_ALERT' />
      <Typography variant='body2'>SYSTEM_ALERT</Typography>
    </Stack>
    <Stack alignItems='center' direction='row' spacing={2}>
      <NotificationIcon type='PASSWORD_EXPIRATION' />
      <Typography variant='body2'>PASSWORD_EXPIRATION</Typography>
    </Stack>
  </Stack>
);

export const Types: Story = {
  render: () => <AllTypes />,
};

// Story showing all notification levels
const AllLevels = () => (
  <Stack spacing={2}>
    <Stack alignItems='center' direction='row' spacing={2}>
      <NotificationIcon level='info' type='SYSTEM_ALERT' />
      <Typography variant='body2'>Info</Typography>
    </Stack>
    <Stack alignItems='center' direction='row' spacing={2}>
      <NotificationIcon level='warning' type='SYSTEM_ALERT' />
      <Typography variant='body2'>Warning</Typography>
    </Stack>
    <Stack alignItems='center' direction='row' spacing={2}>
      <NotificationIcon level='urgent' type='SYSTEM_ALERT' />
      <Typography variant='body2'>Urgent</Typography>
    </Stack>
    <Stack alignItems='center' direction='row' spacing={2}>
      <NotificationIcon level='error' type='SYSTEM_ALERT' />
      <Typography variant='body2'>Error</Typography>
    </Stack>
  </Stack>
);

export const Levels: Story = {
  render: () => <AllLevels />,
};

// Story showing different sizes
const DifferentSizes = () => (
  <Stack alignItems='center' direction='row' spacing={3}>
    <NotificationIcon size={16} type='SYSTEM_ALERT' />
    <NotificationIcon size={24} type='SYSTEM_ALERT' />
    <NotificationIcon size={32} type='SYSTEM_ALERT' />
    <NotificationIcon size={48} type='SYSTEM_ALERT' />
  </Stack>
);

export const Sizes: Story = {
  render: () => <DifferentSizes />,
};

// Story showing type and level combinations
const TypeLevelCombinations = () => (
  <Stack spacing={3}>
    <Stack alignItems='center' direction='row' spacing={2}>
      <NotificationIcon level='info' type='ARTICLE_REVIEW' />
      <NotificationIcon level='warning' type='ARTICLE_REVIEW' />
      <NotificationIcon level='urgent' type='ARTICLE_REVIEW' />
      <NotificationIcon level='error' type='ARTICLE_REVIEW' />
      <Typography variant='body2'>Article Review</Typography>
    </Stack>
    <Stack alignItems='center' direction='row' spacing={2}>
      <NotificationIcon level='info' type='PASSWORD_EXPIRATION' />
      <NotificationIcon level='warning' type='PASSWORD_EXPIRATION' />
      <NotificationIcon level='urgent' type='PASSWORD_EXPIRATION' />
      <NotificationIcon level='error' type='PASSWORD_EXPIRATION' />
      <Typography variant='body2'>Password Expiration</Typography>
    </Stack>
  </Stack>
);

export const Combinations: Story = {
  render: () => <TypeLevelCombinations />,
};

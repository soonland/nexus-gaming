import { Box, Stack } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { DateDisplay } from './DateDisplay';

const meta = {
  title: 'Common/DateDisplay',
  component: DateDisplay,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DateDisplay>;

export default meta;
type Story = StoryObj<typeof DateDisplay>;

const date = new Date('2025-04-26T10:00:00Z');

export const Default: Story = {
  args: {
    date,
  },
};

export const ExplicitColor: Story = {
  args: {
    date,
    color: 'text.secondary',
  },
};

export const AllFormats: Story = {
  render: () => (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Box color='text.secondary'>Format: relative (default)</Box>
        <DateDisplay date={date} format='relative' />
      </Stack>
      <Stack spacing={1}>
        <Box color='text.secondary'>Format: short</Box>
        <DateDisplay date={date} format='short' />
      </Stack>
      <Stack spacing={1}>
        <Box color='text.secondary'>Format: long</Box>
        <DateDisplay date={date} format='long' />
      </Stack>
      <Stack spacing={1}>
        <Box color='text.secondary'>Format: calendar</Box>
        <DateDisplay date={date} format='calendar' />
      </Stack>
      <Stack spacing={1}>
        <Box color='text.secondary'>Custom format: DD MMM YYYY</Box>
        <DateDisplay customFormat='DD MMM YYYY' date={date} />
      </Stack>
    </Stack>
  ),
};

export const ColorContexts: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box color='primary.main'>
        <DateDisplay date={date} />
      </Box>
      <Box color='secondary.main'>
        <DateDisplay date={date} />
      </Box>
      <Box bgcolor='primary.main' color='primary.contrastText' p={2}>
        <DateDisplay date={date} />
      </Box>
      <Box bgcolor='secondary.main' color='secondary.contrastText' p={2}>
        <DateDisplay date={date} />
      </Box>
    </Stack>
  ),
};

export const WithoutTooltip: Story = {
  args: {
    date,
    withTooltip: false,
  },
};

export const CustomTooltipFormat: Story = {
  args: {
    date,
    format: 'short',
    tooltipFormat: 'calendar',
  },
};

import type { Meta, StoryObj } from '@storybook/react';

import { AnimatedCounter } from './AnimatedCounter';

const meta = {
  title: 'Common/AnimatedCounter',
  component: AnimatedCounter,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AnimatedCounter>;

export default meta;
type Story = StoryObj<typeof AnimatedCounter>;

export const Default: Story = {
  args: {
    end: 100,
  },
};

export const SlowAnimation: Story = {
  args: {
    end: 1000,
    duration: 4,
  },
};

export const WithAffixes: Story = {
  args: {
    end: 42,
    prefix: '€ ',
    suffix: ' TTC',
  },
};

export const LargeNumber: Story = {
  args: {
    end: 1000000,
    prefix: '$ ',
  },
};

export const SmallDuration: Story = {
  args: {
    end: 500,
    duration: 1,
  },
};

// Story demonstrating multiple counters with different configurations
const MultipleCounters = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <AnimatedCounter end={150} prefix='Views: ' />
    <AnimatedCounter duration={3} end={1234} prefix='Likes: ' />
    <AnimatedCounter end={98} prefix='Progress: ' suffix='%' />
  </div>
);

export const Multiple: Story = {
  render: () => <MultipleCounters />,
};

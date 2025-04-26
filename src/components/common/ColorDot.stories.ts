import type { Meta, StoryObj } from '@storybook/react';

import { ColorDot } from './ColorDot';

const meta: Meta<typeof ColorDot> = {
  title: 'Common/ColorDot',
  component: ColorDot,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ColorDot>;

export const Default: Story = {
  args: {
    label: 'Default',
    color: '#FF5733',
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { CategoryChip } from './CategoryChip';

const meta = {
  title: 'Common/CategoryChip',
  component: CategoryChip,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined'],
    },
    clickable: {
      control: 'boolean',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CategoryChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    category: {
      id: '1',
      name: 'Tests',
    },
  },
};

export const WithColor: Story = {
  args: {
    category: {
      id: '2',
      name: 'News',
      color: '#007FFF',
    },
  },
};

export const Clickable: Story = {
  args: {
    category: {
      id: '3',
      name: 'Previews',
      color: '#FF6B6B',
    },
    clickable: true,
    onChipClick: category => {
      alert(`Clicked category: ${category.name}`);
    },
  },
};

export const LargeSize: Story = {
  args: {
    category: {
      id: '4',
      name: 'Reviews',
      color: '#4CAF50',
    },
    size: 'medium',
  },
};

export const FilledVariant: Story = {
  args: {
    category: {
      id: '5',
      name: 'Guides',
      color: '#9C27B0',
    },
    variant: 'filled',
  },
};

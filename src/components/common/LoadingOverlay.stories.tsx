import { Button, Typography, Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { LoadingOverlay } from './LoadingOverlay';

const meta = {
  title: 'Common/LoadingOverlay',
  component: LoadingOverlay,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof LoadingOverlay>;

export default meta;
type Story = StoryObj<typeof LoadingOverlay>;

// Simple story showing the overlay in its loading state
export const Default: Story = {
  args: {
    isLoading: true,
  },
};

// Story showing the overlay in its hidden state
export const Hidden: Story = {
  args: {
    isLoading: false,
  },
  decorators: [
    Story => (
      <Box p={2}>
        <Typography>Content is visible when overlay is hidden</Typography>
        <Story />
      </Box>
    ),
  ],
};

// Interactive story with toggle button
const LoadingDemo = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = () => {
    setIsLoading(prev => !prev);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate loading for 2 seconds
  };
  return (
    <Box p={2} sx={{ minHeight: '100vh' }}>
      <Box mb={2}>
        <Typography gutterBottom>
          Click the button below to toggle the loading overlay
        </Typography>
        <Button
          sx={{ mb: 2 }}
          variant='contained'
          onClick={() => handleToggle()}
        >
          {isLoading ? 'Hide Overlay' : 'Show Overlay'}
        </Button>
      </Box>
      <Box sx={{ opacity: isLoading ? 0.3 : 1, transition: 'opacity 0.2s' }}>
        <Typography gutterBottom variant='h4'>
          Page Content
        </Typography>
        <Typography paragraph>
          This content will be visible when the overlay is hidden, and slightly
          faded when the overlay is visible.
        </Typography>
        <Typography paragraph>
          The overlay includes a smooth fade animation powered by Framer Motion,
          and displays a centered CircularProgress component.
        </Typography>
      </Box>
      <LoadingOverlay isLoading={isLoading} />
    </Box>
  );
};

export const Interactive: Story = {
  render: () => <LoadingDemo />,
};

// Story demonstrating a common loading scenario
const LoadingScenario = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);

  const handleLoad = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setData(['Item 1', 'Item 2', 'Item 3']);
      setIsLoading(false);
    }, 2000);
  };

  const handleReset = () => {
    setData([]);
  };

  return (
    <Box p={2} sx={{ minHeight: '100vh' }}>
      <Box mb={2}>
        <Typography gutterBottom>
          Click Load to simulate fetching data with a loading state
        </Typography>
        <Box sx={{ '& > button': { mr: 1 } }}>
          <Button
            disabled={isLoading || data.length > 0}
            variant='contained'
            onClick={handleLoad}
          >
            Load Data
          </Button>
          <Button
            disabled={isLoading || data.length === 0}
            variant='outlined'
            onClick={handleReset}
          >
            Reset
          </Button>
        </Box>
      </Box>
      <Box sx={{ opacity: isLoading ? 0.3 : 1, transition: 'opacity 0.2s' }}>
        {data.length > 0 ? (
          data.map((item, index) => (
            <Typography key={index} paragraph>
              {item}
            </Typography>
          ))
        ) : (
          <Typography color='text.secondary'>No data loaded</Typography>
        )}
      </Box>
      <LoadingOverlay isLoading={isLoading} />
    </Box>
  );
};

export const DataLoadingExample: Story = {
  render: () => <LoadingScenario />,
};

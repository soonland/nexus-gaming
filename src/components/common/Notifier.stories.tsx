import { Button, Stack } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';

import { NotifierProvider, useNotifier } from './Notifier';

const meta = {
  title: 'Common/Notifier',
  component: NotifierProvider,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <NotifierProvider>
        <Story />
      </NotifierProvider>
    ),
  ],
} satisfies Meta<typeof NotifierProvider>;

export default meta;
type Story = StoryObj<typeof NotifierProvider>;

const NotifierDemo = () => {
  const { showSuccess, showError } = useNotifier();

  return (
    <Stack direction='row' p={2} spacing={2}>
      <Button
        color='success'
        variant='contained'
        onClick={() => showSuccess('Operation completed successfully!')}
      >
        Show Success
      </Button>
      <Button
        color='error'
        variant='contained'
        onClick={() => showError('An error occurred!')}
      >
        Show Error
      </Button>
    </Stack>
  );
};

export const Default: Story = {
  render: () => <NotifierDemo />,
};

export const SuccessNotification: Story = {
  render: () => {
    const Demo = () => {
      const { showSuccess } = useNotifier();

      useEffect(() => {
        const timer = setTimeout(() => {
          showSuccess('Your changes have been saved successfully');
        }, 1000);

        return () => clearTimeout(timer);
      }, [showSuccess]);

      return (
        <div style={{ padding: 16 }}>
          Success notification will appear automatically...
        </div>
      );
    };

    return <Demo />;
  },
};

export const ErrorNotification: Story = {
  render: () => {
    const Demo = () => {
      const { showError } = useNotifier();

      useEffect(() => {
        const timer = setTimeout(() => {
          showError('Failed to save changes. Please try again.');
        }, 1000);

        return () => clearTimeout(timer);
      }, [showError]);

      return (
        <div style={{ padding: 16 }}>
          Error notification will appear automatically...
        </div>
      );
    };

    return <Demo />;
  },
};

export const QueuedNotifications: Story = {
  render: () => {
    const Demo = () => {
      const { showSuccess, showError } = useNotifier();

      useEffect(() => {
        const timers = [
          setTimeout(() => showSuccess('First notification'), 1000),
          setTimeout(() => showError('Second notification'), 1500),
          setTimeout(() => showSuccess('Third notification'), 2000),
        ];

        return () => timers.forEach(clearTimeout);
      }, [showSuccess, showError]);

      return (
        <div style={{ padding: 16 }}>
          Multiple notifications will appear in sequence...
        </div>
      );
    };

    return <Demo />;
  },
};

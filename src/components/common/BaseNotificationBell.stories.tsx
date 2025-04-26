import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import { FiBell } from 'react-icons/fi';

import { BaseNotificationBell } from './BaseNotificationBell';
import type { INotification } from '@/types/notifications';

const meta = {
  title: 'Common/BaseNotificationBell',
  component: BaseNotificationBell,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          border: '1px dashed grey',
          width: 400,
        }}
      >
        <Story />
      </Box>
    ),
  ],
  argTypes: {
    onAction: { action: 'onAction' },
    onMarkAllAsRead: { action: 'onMarkAllAsRead' },
    onNotificationClick: { action: 'onNotificationClick' },
  },
} satisfies Meta<typeof BaseNotificationBell>;

export default meta;
type Story = StoryObj<typeof BaseNotificationBell>;

const baseNotification: Partial<INotification> = {
  type: 'SYSTEM_ALERT',
  isRead: false,
  createdAt: new Date(),
  expiresAt: null,
  userId: 'user-1',
  data: null,
};

export const Empty: Story = {
  args: {
    notifications: [],
  },
};

export const UnreadInfo: Story = {
  args: {
    notifications: [
      {
        ...baseNotification,
        id: '1',
        title: 'New Feature Available',
        message: 'Check out our latest feature in the dashboard!',
        level: 'info',
        data: null,
      },
      {
        ...baseNotification,
        id: '2',
        title: 'Welcome to Nexus Gaming',
        message: 'Thanks for joining our platform.',
        level: 'info',
        isRead: true,
        data: null,
      },
    ] as INotification[],
  },
};

export const UnreadWarning: Story = {
  args: {
    notifications: [
      {
        ...baseNotification,
        id: '1',
        title: 'Account Settings Update',
        message: 'Please review your security settings.',
        level: 'warning',
        data: null,
      },
      {
        ...baseNotification,
        id: '2',
        title: 'Profile Incomplete',
        message: 'Add more information to your profile.',
        level: 'warning',
        data: null,
      },
    ] as INotification[],
  },
};

export const UnreadError: Story = {
  args: {
    notifications: [
      {
        ...baseNotification,
        id: '1',
        type: 'PASSWORD_EXPIRATION',
        title: 'Action Required',
        message: 'Your password will expire in 3 days.',
        level: 'error',
        data: {
          daysUntilExpiration: 3,
          warningLevel: 'urgent',
        },
      },
      {
        ...baseNotification,
        id: '2',
        title: 'Security Alert',
        message: 'Unusual login activity detected.',
        level: 'error',
        data: null,
      },
    ] as INotification[],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows error notifications including a password expiration warning that cannot be marked as read.',
      },
    },
  },
};

export const Mixed: Story = {
  args: {
    notifications: [
      {
        ...baseNotification,
        id: '1',
        title: 'Critical Update',
        message: 'System maintenance in 1 hour.',
        level: 'error',
        data: null,
      },
      {
        ...baseNotification,
        id: '2',
        type: 'STATUS_CHANGE',
        title: 'Complete Your Profile',
        message: 'Add your gaming preferences.',
        level: 'warning',
        data: {
          previousStatus: 'draft',
          newStatus: 'pending',
        },
      },
      {
        ...baseNotification,
        id: '3',
        type: 'ARTICLE_REVIEW',
        title: 'New Article',
        message: 'Check out our latest gaming review.',
        level: 'info',
        data: {
          articleId: 'article-123',
        },
      },
    ] as INotification[],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows different types of notifications with various levels and custom data.',
      },
    },
  },
};

export const AllRead: Story = {
  args: {
    notifications: [
      {
        ...baseNotification,
        id: '1',
        title: 'Welcome Message',
        message: 'Thanks for joining Nexus Gaming!',
        level: 'info',
        isRead: true,
        data: null,
      },
      {
        ...baseNotification,
        id: '2',
        title: 'Profile Update',
        message: 'Your profile has been updated.',
        level: 'info',
        isRead: true,
        data: null,
      },
    ] as INotification[],
  },
};

export const WithCustomIcon: Story = {
  args: {
    notifications: [
      {
        ...baseNotification,
        id: '1',
        title: 'New Message',
        message: 'You have a new message.',
        level: 'info',
        data: null,
      },
    ] as INotification[],
    icon: <FiBell size={24} />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how to customize the bell icon.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    notifications: [
      {
        ...baseNotification,
        id: '1',
        title: 'Game Release',
        message: 'New game available in your region.',
        level: 'info',
        data: null,
      },
      {
        ...baseNotification,
        id: '2',
        title: 'Friend Request',
        message: 'Someone wants to connect with you.',
        level: 'info',
        data: null,
      },
    ] as INotification[],
    isMarkingAsRead: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the loading state when marking a single notification as read.',
      },
    },
  },
};

export const LoadingAll: Story = {
  args: {
    notifications: [
      {
        ...baseNotification,
        id: '1',
        title: 'Platform Update',
        message: 'New features have been added.',
        level: 'info',
        data: null,
      },
      {
        ...baseNotification,
        id: '2',
        title: 'Weekly Summary',
        message: 'Check your gaming activity.',
        level: 'info',
        data: null,
      },
    ] as INotification[],
    isMarkingAllAsRead: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the loading state when marking all notifications as read.',
      },
    },
  },
};

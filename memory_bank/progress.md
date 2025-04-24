## 24 Apr 2025

### Notification System Improvements

Added a complete notification system with the following features:

#### API Endpoints

- `GET /api/notifications` - List all notifications with sorting (unread first)
- `PATCH /api/notifications/[id]` - Update a notification (mark as read)
- `POST /api/notifications/read-all` - Mark multiple notifications as read

#### Components

- **BaseNotificationBell**:

  - Reusable base component with bell icon and popover
  - Shows unread indicator with severity color
  - Individual "Mark as read" buttons with loading state
  - "Mark all as read" action with rotated bar chart icon
  - Visual distinction between read/unread notifications (opacity)

- **NotificationBell**:
  - Integration with password expiration notifications
  - Manages system notifications
  - Handles notification actions and loading states
  - Profile redirection for password notifications

#### Data Management

- `useNotifications` hook with TanStack Query:
  - Optimistic updates
  - Loading states per action
  - Proper error handling
  - Cache invalidation
  - Response typing

#### UX Improvements

- Loading spinners only on active notification actions
- Proper disabled states during actions
- Tooltips for clearer actions
- Sorted notifications (unread first, then by date)
- Visual feedback for read/unread state

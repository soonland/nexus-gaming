# Product Context

## User Management

### Account Deactivation

Two distinct flows for account deactivation have been implemented:

1. Self-Service Deactivation

- Users can deactivate their own accounts
- 7-day grace period before deactivation takes effect
- Can be cancelled during grace period
- Visual indicators show countdown to deactivation

2. Administrative Deactivation

- Administrators can deactivate accounts immediately
- No grace period for admin actions
- Protected against deactivating all system administrators
- Role hierarchy enforced for permissions

### Role Hierarchy & Permissions

- Strict role hierarchy (USER < MODERATOR < EDITOR < SENIOR_EDITOR < ADMIN <
  SYSADMIN)
- Actions only available to strictly higher roles
- Special protections for ADMIN and SYSADMIN accounts
- Batch operations respect role hierarchy

## User Interface Components

### Status Indicators

- Active accounts: Green status
- Pending deactivation: Orange status with countdown
- Inactive accounts: Red status
- Color-coded role badges

### Account Management

- Individual and batch actions
- Role-appropriate action visibility
- Confirmation dialogs with context-aware messages
- Clear status indicators and warnings

## Security Considerations

### Permission System

- Role-based access control
- Strict hierarchy enforcement
- Protected system administrator accounts
- Batch operation safeguards

### Grace Period

- 7 days for self-deactivation
- Immediate effect for administrative actions
- Cancellation capability during grace period
- Clear status tracking and notifications

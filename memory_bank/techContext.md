# Technical Context

## Database Schema Updates

### User Model Extensions

```prisma
model User {
  // Existing fields...
  isActive             Boolean    @default(true)
  deactivationRequestedAt DateTime?
}
```

## API Endpoints

### User Status Management

- `PATCH /api/admin/users/[id]/status`

  - Handles both immediate admin deactivation and user self-deactivation
  - Returns deactivationEffectiveDate for self-deactivation cases
  - Validates role hierarchy and permissions

- `PATCH /api/admin/users/[id]/cancel-deactivation`
  - Cancels pending deactivation during grace period
  - Validates user permissions

## Type Definitions

### Status Types

```typescript
type UserStatusValue = 'all' | 'active' | 'inactive';

interface IStatusOption<T = UserStatusValue> {
  value: T;
  label: string;
}
```

### API Response Types

```typescript
interface IToggleStatusResponse {
  success: boolean;
  message: string;
  deactivationEffectiveDate?: string;
}

interface IUserData {
  // ...existing fields
  isActive: boolean;
  deactivationRequestedAt?: string;
}
```

## Components

### Admin Interface

- `AdminDeactivateDialog`: Context-aware confirmation dialogs
- `AdminFilters<T>`: Generic status filtering
- `ColorDot`: Status visualization
- Custom hooks for user management

## Permission System

### Role Hierarchy

```typescript
const roleHierarchy: Record<Role, number> = {
  USER: 1,
  MODERATOR: 2,
  EDITOR: 3,
  SENIOR_EDITOR: 4,
  ADMIN: 5,
  SYSADMIN: 6,
};

// Strict role comparison
hasSufficientRole(userRole, targetRole, '>');
```

## Implementation Details

### Deactivation Logic

- Immediate for admin actions
- 7-day grace period for self-deactivation
- Batch operations with role filtering
- Status updates with optimistic UI updates

### Security Measures

- Role hierarchy enforcement
- Permission validation on both client and server
- Protected system administrator accounts
- Concurrent modification handling

### UI/UX Considerations

- Real-time status updates
- Clear visual indicators
- Batch action management
- Error handling and feedback

## Testing Considerations

- Role hierarchy validation
- Grace period functionality
- Permission edge cases
- Batch operation scenarios
- Concurrent modification handling

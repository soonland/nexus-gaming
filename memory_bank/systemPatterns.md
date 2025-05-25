# System Patterns

## Permission Management

### Role-Based Access Control

- Hierarchical role system
- Strict role comparison using operators ('>', '>=', etc.)
- Permission validation at multiple levels:
  1. UI component visibility
  2. Client-side action validation
  3. Server-side enforcement

### Status Management Pattern

- Clear status transitions
- Grace period implementation
- Cancellation capability
- Visual status indicators

## Component Patterns

### Generic Filters

```typescript
interface IStatusOption<T> {
  value: T;
  label: string;
}

<AdminFilters<T extends string>>
```

### Action Buttons

- Conditional rendering based on permissions
- Context-aware actions
- Batch operation support
- Consistent styling and layout

## API Response Patterns

### Success Responses

```typescript
interface ISuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
}

// Example: Deactivation Response
{
  success: true,
  message: "Deactivation scheduled",
  deactivationEffectiveDate: "2025-05-31T..."
}
```

### Error Handling

```typescript
interface IErrorResponse {
  success: false;
  error: string;
}
```

## State Management

### Optimistic Updates

- Immediate UI feedback
- Graceful error handling
- State reversion on failure

### Batch Operations

- Role-based filtering
- All-or-nothing transactions
- Progress feedback

## Security Patterns

### Multi-Level Validation

1. UI Level

   - Action visibility control
   - Permission pre-checks
   - Input validation

2. API Level

   - Authentication check
   - Permission validation
   - Business rule enforcement

3. Database Level
   - Constraints
   - Cascading updates
   - Data integrity

### Protected Operations

- System stability safeguards
- Critical user protection
- Concurrent modification handling

## User Experience Patterns

### Status Visualization

- Color coding
- Icon usage
- Clear labeling
- Progress indicators

### Confirmation Flows

- Context-aware messages
- Clear consequences
- Cancellation options
- Batch operation warnings

### Error Handling

- Clear error messages
- Recovery options
- User guidance
- State preservation

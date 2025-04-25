# System Patterns

## UI Components

### Loading States

- Individual loading states for actions (e.g., notification mark as read)
- Loading spinners inside buttons to maintain layout
- Disabled states during loading
- Loading state resets after action completion
- Global loading overlay for page transitions
- Skeleton loaders for content

### Form Patterns

- Field-level validation
- Submission handling
- Error messages
- Loading states
- Success feedback
- Auto-save handling

### Notifications

- Severity levels with corresponding colors: info, warning, urgent, error
- Visual indicators for unread status
- Read/unread state changes with visual feedback
- Batch actions with individual spinners
- Tooltips for action buttons
- Event propagation control for nested clickables

### Layout

- Responsive design patterns
- Container management
- Grid system usage
- Spacing consistency
- Breakpoint handling
- Navigation patterns

## Data Management

### React Query Integration

- Optimistic updates for better UX
- Cache invalidation after mutations
- Loading states tracking with isPending
- Response typing with Prisma types
- Error state handling
- Prefetching strategies
- Infinite loading

### API Response Format

```typescript
interface ApiResponse<T> {
  data: T;
  error?: string;
}
```

### State Management

- Context usage guidelines
- Local vs global state
- Form state handling
- UI state persistence
- Route state management

### Mutation Patterns

- Reset mutation state after completion
- Handle success/error states
- Proper typing for request/response
- Load masks during operation
- Optimistic updates
- Rollback handling

## Security Patterns

### API Routes

- User authentication check
- Resource ownership validation
- Input validation
- Error handling with appropriate status codes
- Rate limiting
- Request sanitization

### Authorization

- Role-based access
- Resource permissions
- Route protection
- API endpoint security
- Token management

## Database Patterns

### Prisma Queries

- Sorting by multiple fields
- Filtering with dynamic conditions
- Data selection optimization
- Proper type safety
- Relation handling
- Pagination strategies
- Transaction management

### Data Integrity

- Validation rules
- Constraint handling
- Cascade operations
- Soft deletes
- Audit trails
- Backup strategies

## Error Handling

### Client-Side

- API error handling
- Form validation errors
- Network error recovery
- Mutation error handling
- Toast notifications
- Error boundaries

### Server-Side

- HTTP status codes
- Error messages
- Validation errors
- Database errors
- Authentication errors
- Rate limit errors

## Testing Patterns

### Unit Testing

- Component testing
- Hook testing
- Utility testing
- Mock patterns
- Test organization

### Integration Testing

- API route testing
- Database testing
- Authentication flow
- End-to-end flows
- Error scenarios

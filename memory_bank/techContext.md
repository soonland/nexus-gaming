# Technical Context

## Frontend Architecture

### Components Organization

- Base components for reusability
- Integration components for business logic
- Clear separation of concerns between UI and data management
- Form components with validation
- Protected routes with role-based access
- Shared layout components

### State Management

- TanStack Query v5 for server state
- Local state for UI interactions
- Proper loading state management
- Optimistic updates for better UX
- Form state with validation
- Authentication context

### Type Safety

- TypeScript interfaces for components props
- API response typing
- Prisma generated types
- Type guards for runtime validation
- Zod schema validation
- Route params typing

## Backend Architecture

### API Routes

- RESTful endpoints
- Clear error handling
- Resource-based URLs
- Proper HTTP methods usage (GET, PATCH, POST)
- Role-based access control
- Input validation

### Authentication & Authorization

- JWT-based authentication
- Per-resource authorization checks
- User context handling
- Role-based permissions
- Session management
- Password policies

### File Upload

- Cloudinary integration
- Image optimization
- File type validation
- Size limits
- Progress tracking

## Database Design

### Prisma Schema

- Proper relation handling
- Type generation
- Schema validation
- Cascade operations
- Soft delete patterns
- Indexing strategy

### Models

```prisma
model User {
  id                String              @id @default(cuid())
  email             String              @unique
  firstName         String?
  lastName          String?
  role              Role                @default(USER)
  password          String
  lastPasswordChange DateTime           @default(now())
  articles          Article[]
  notifications     SystemNotification[]
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
}

model Article {
  id          String    @id @default(cuid())
  title       String
  content     String
  status      Status    @default(DRAFT)
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model SystemNotification {
  id        String      @id @default(cuid())
  userId    String
  type      NotificationType
  level     String
  title     String
  message   String
  isRead    Boolean     @default(false)
  data      Json?
  expiresAt DateTime?
  createdAt DateTime    @default(now())
  user      User        @relation(fields: [userId], references: [id])
}
```

## Libraries and Tools

### Core Dependencies

- Next.js 14+ (App Router)
- MUI (Material UI)
- TanStack Query v5
- Prisma ORM
- React Icons
- React Hook Form
- Zod
- Cloudinary
- JWT
- bcrypt

### Development Tools

- TypeScript
- ESLint
- Prettier
- Vitest
- MSW (Mock Service Worker)
- Storybook
- Husky
- lint-staged

### Testing Strategy

- Unit tests with Vitest
- Integration tests
- API mocking with MSW
- Component testing
- E2E with Playwright

## Security Measures

### Authentication

- Password hashing with bcrypt
- JWT token management
- Password expiration
- Multi-factor authentication (planned)

### Authorization

- Role-based access control
- Resource ownership validation
- API route protection
- Frontend route guards

### Data Protection

- Input sanitization
- XSS prevention
- CSRF protection
- Rate limiting
- File upload validation

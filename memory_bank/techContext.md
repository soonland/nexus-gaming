# Technical Context: Nexus Gaming News

## Development Standards

### Code Quality

- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Unit test coverage
- Component documentation

### Coding Standards

#### Component Patterns

##### Generic Data Tables

```tsx
// Type-safe generic data table
<AdminDataTable<TData, TSortField>
  // Reserved props first
  selectable
  // Regular props
  columns={[
    {
      field: 'name',
      headerName: 'Name',
      sortable: true,
      render: row => customRender(row),
    },
  ]}
  rows={data}
  selectedIds={selectedIds}
  sortField={sortField}
  sortOrder={sortOrder}
  // Batch operations
  batchActions={selectedIds => <BatchActions ids={selectedIds} />}
  // Event handlers
  onSelectionChange={handleSelectionChange}
  onSort={handleSort}
/>
```

##### Status Management

```tsx
// Article status types
type ArticleStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'NEEDS_CHANGES'
  | 'PUBLISHED'
  | 'ARCHIVED';

// Status transition validation
const isValidTransition = (
  from: ArticleStatus,
  to: ArticleStatus,
  role: Role
): boolean => {
  const transitions = {
    DRAFT: ['PENDING_APPROVAL'],
    PENDING_APPROVAL: ['PUBLISHED', 'NEEDS_CHANGES'],
    NEEDS_CHANGES: ['PENDING_APPROVAL'],
    PUBLISHED: ['ARCHIVED'],
    ARCHIVED: [],
  };

  const allowed = transitions[from];
  const hasPermission =
    role === 'SENIOR_EDITOR' ||
    (role === 'EDITOR' && to === 'PENDING_APPROVAL');

  return allowed.includes(to) && hasPermission;
};
```

##### History Tracking

```tsx
// Approval history entry
interface ApprovalHistoryEntry {
  id: string;
  fromStatus: ArticleStatus;
  toStatus: ArticleStatus;
  action:
    | 'SUBMITTED'
    | 'APPROVED'
    | 'CHANGES_NEEDED'
    | 'PUBLISHED'
    | 'ARCHIVED';
  comment?: string;
  actionBy: User;
  createdAt: Date;
}

// History display component
const ApprovalHistory: React.FC<{ entries: ApprovalHistoryEntry[] }> = ({
  entries,
}) => (
  <Timeline>
    {entries.map(entry => (
      <TimelineItem key={entry.id}>
        <TimelineContent>
          <Typography variant='h6'>{entry.action}</Typography>
          <Typography>{`${entry.fromStatus} → ${entry.toStatus}`}</Typography>
          {entry.comment && (
            <Typography color='textSecondary'>{entry.comment}</Typography>
          )}
        </TimelineContent>
      </TimelineItem>
    ))}
  </Timeline>
);
```

##### Selection Management

```tsx
// Type-safe selection state
const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);

// Selection handlers
const handleSelectAll = (ids: Array<string | number>) => {
  setSelectedIds(ids);
};

const handleSelectOne = (id: string | number) => {
  setSelectedIds(prev =>
    prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
  );
};
```

##### Batch Operations

```tsx
// Batch action handlers
const handleBatchAction = async (ids: Array<string | number>) => {
  try {
    await Promise.all(ids.map(id => performAction(id)));
    setSelectedIds([]);
    showSuccess('Opération effectuée avec succès');
  } catch (error) {
    showError('Une erreur est survenue');
  }
};

// Batch action components
const BatchActions = ({ ids }: { ids: Array<string | number> }) => (
  <Stack direction='row' spacing={2}>
    <Button onClick={() => handleBatchAction(ids)}>Action groupée</Button>
  </Stack>
);
```

#### React Props Ordering

1. Reserved props (key, ref)
2. TypeScript props interface
3. Event handlers
4. Render props
5. Optional props
6. Style props

#### MaterialUI Patterns

##### Theme Constants

```ts
// Color definitions
const colors = {
  primary: {
    main: '#1976d2',
    dark: '#115293',
    light: '#4791db',
  },
  // ... other colors
};

// Typography scale
const typography = {
  h1: { fontSize: '2.5rem' },
  h2: { fontSize: '2rem' },
  // ... other styles
};
```

##### Data Table Styling

```tsx
// Table layout
<TableContainer>
  <Table>
    <TableHead>
      <TableRow>
        {/* Selection checkbox */}
        <TableCell padding="checkbox">
          <Checkbox />
        </TableCell>
        {/* Data columns */}
        <TableCell>
          <TableSortLabel>
            Column Name
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>
  </Table>
</TableContainer>

// Batch actions footer
<Stack
  direction="row"
  justifyContent="space-between"
  sx={{
    bgcolor: 'action.selected',
    borderTop: 1,
    borderColor: 'divider',
    p: 2,
  }}
>
  <Typography>
    {selectedCount} élément(s) sélectionné(s)
  </Typography>
  <BatchActions />
</Stack>
```

### API Patterns

#### Error Handling

```ts
// Error types
type ApiError = {
  code: string;
  message: string;
  details?: Record<string, any>;
};

// Error response
const errorResponse = (error: ApiError) => {
  return new Response(JSON.stringify(error), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

#### Authentication

```ts
// JWT middleware
const authenticateToken = async (req: NextRequest) => {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) throw new Error('Token required');

  try {
    const payload = await verifyToken(token);
    return payload;
  } catch {
    throw new Error('Invalid token');
  }
};
```

### Database Patterns

#### Query Optimization

```ts
// Efficient includes
const article = await prisma.article.findUnique({
  where: { id },
  include: {
    category: true,
    user: {
      select: {
        id: true,
        username: true,
        avatarUrl: true,
      },
    },
  },
});

// Pagination
const articles = await prisma.article.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { [sortField]: sortOrder },
});
```

#### Data Validation

```ts
// Input validation
const validateArticle = (data: ArticleInput): boolean => {
  if (!data.title || data.title.length < 3) return false;
  if (!data.content || data.content.length < 100) return false;
  return true;
};

// Status transition validation
const validateStatusTransition = (
  from: ArticleStatus,
  to: ArticleStatus
): boolean => {
  const validTransitions = {
    DRAFT: ['PENDING_APPROVAL'],
    PENDING_APPROVAL: ['PUBLISHED', 'NEEDS_CHANGES'],
    // ... other transitions
  };
  return validTransitions[from]?.includes(to) ?? false;
};
```

### Testing Standards

#### Component Testing

```tsx
describe('ArticleForm', () => {
  it('validates required fields', () => {
    render(<ArticleForm />);
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByText('Title is required')).toBeInTheDocument();
  });
});
```

#### API Testing

```ts
describe('POST /api/articles', () => {
  it('creates new article', async () => {
    const response = await fetch('/api/articles', {
      method: 'POST',
      body: JSON.stringify(mockArticle),
    });
    expect(response.status).toBe(201);
  });
});
```

This technical context document serves as a reference for maintaining consistent
development practices across the project.

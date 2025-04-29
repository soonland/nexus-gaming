import {
  Checkbox,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { type ReactNode } from 'react';
import { FiChevronsLeft, FiChevronsRight, FiInbox } from 'react-icons/fi';

type DataColumn<TData> = {
  field: keyof TData;
  headerName: string;
  headerAlign?: 'left' | 'right' | 'center';
  itemsAlign?: 'left' | 'right' | 'center';
  render?: (row: TData) => ReactNode;
  sortable?: boolean;
  width?: string;
};

type ActionsColumn<TData> = {
  field: 'actions';
  headerName: string;
  headerAlign?: 'left' | 'right' | 'center';
  itemsAlign?: 'left' | 'right' | 'center';
  render: (row: TData) => ReactNode;
  sortable?: false;
  width?: string;
};

export interface IAdminDataTableProps<TData, TSortField extends keyof TData> {
  error?: string;
  isLoading?: boolean;
  batchActions?:
    | ReactNode
    | ((selectedIds: Array<string | number>) => ReactNode);
  columns: Array<DataColumn<TData> | ActionsColumn<TData>>;
  getRowId?: (row: TData) => string;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onSort?: (field: TSortField) => void;
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  pages?: number;
  rows: TData[];
  selectable?: boolean;
  selectedIds?: string[];
  sortField?: TSortField;
  sortOrder?: 'asc' | 'desc';
  emptyMessage?: string;
}

export const AdminDataTable = <TData, TSortField extends keyof TData>({
  batchActions,
  columns,
  emptyMessage,
  error,
  getRowId,
  isLoading,
  onPageChange,
  onPageSizeChange,
  onSelectionChange,
  onSort,
  page = 1,
  pageSize,
  pageSizeOptions,
  pages = 1,
  rows,
  selectable,
  selectedIds = [],
  sortField,
  sortOrder,
}: IAdminDataTableProps<TData, TSortField>) => {
  const theme = useTheme();
  const handleSort = (field: keyof TData | 'actions') => {
    if (field !== 'actions' && onSort) {
      onSort(field as TSortField);
    }
  };

  const isSelected = (row: TData) => {
    return selectable && getRowId ? selectedIds.includes(getRowId(row)) : false;
  };

  const handleSelectAll = () => {
    if (!selectable || !getRowId || !onSelectionChange) return;

    if (selectedIds.length === rows.length) {
      onSelectionChange([]);
    } else {
      const allIds = rows.map(getRowId);
      onSelectionChange(allIds);
    }
  };

  const handleSelectRow = (row: TData) => {
    if (!selectable || !getRowId || !onSelectionChange) return;

    const id = getRowId(row);
    const newSelection = isSelected(row)
      ? selectedIds.filter(selectedId => selectedId !== id)
      : [...selectedIds, id];
    onSelectionChange(newSelection);
  };

  return (
    <Paper elevation={0} variant='outlined'>
      <TableContainer>
        {(selectable || (pages > 1 && onPageChange)) && (
          <Stack
            alignItems='center'
            direction='row'
            justifyContent='space-between'
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              borderBottom: 1,
              borderColor: 'divider',
              minHeight: 44,
              px: 2,
              py: 0.5,
              transition: theme =>
                theme.transitions.create(
                  ['background-color', 'min-height', 'padding'],
                  {
                    duration: theme.transitions.duration.standard,
                    easing: theme.transitions.easing.easeInOut,
                  }
                ),
            }}
          >
            {/* Zone gauche : Compteur de sélection et Actions groupées */}
            <Stack alignItems='center' direction='row' spacing={2}>
              <Typography
                color={
                  selectedIds.length > 0 ? 'text.secondary' : 'text.disabled'
                }
                variant='body2'
              >
                {selectedIds.length > 0 &&
                  `${selectedIds.length} item${
                    selectedIds.length > 1 ? 's' : ''
                  } selected`}
              </Typography>
              {/* Actions groupées */}
              {selectable && (
                <div style={{ opacity: selectedIds.length > 0 ? 1 : 0.5 }}>
                  {typeof batchActions === 'function'
                    ? batchActions(selectedIds)
                    : batchActions}
                </div>
              )}
            </Stack>

            {/* Zone droite : Pagination */}
            {onPageChange && (
              <Stack alignItems='center' direction='row' spacing={2}>
                {/* Controles pagination */}
                <Stack alignItems='center' direction='row' spacing={1}>
                  {/* Sélecteur de taille */}
                  {onPageSizeChange && pageSize && pageSizeOptions && (
                    <Stack alignItems='center' direction='row' spacing={1}>
                      <Typography
                        color='text.secondary'
                        sx={{ whiteSpace: 'nowrap' }}
                        variant='body2'
                      >
                        Show
                      </Typography>
                      <Select
                        size='small'
                        sx={{
                          '.MuiSelect-select': {
                            py: 0.5,
                            px: 1.5,
                            minWidth: '30px',
                          },
                        }}
                        value={pageSize}
                        onChange={e => onPageSizeChange(Number(e.target.value))}
                      >
                        {pageSizeOptions.map(size => (
                          <MenuItem key={size} value={size}>
                            {size}
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  )}

                  <IconButton
                    disabled={page === 1}
                    size='small'
                    onClick={() => onPageChange(page - 1)}
                  >
                    <FiChevronsLeft />
                  </IconButton>
                  {/* Info pagination */}
                  <Typography
                    color='text.secondary'
                    sx={{ whiteSpace: 'nowrap' }}
                    variant='body2'
                  >
                    Page {page} sur {pages}
                  </Typography>
                  <IconButton
                    disabled={page === pages}
                    size='small'
                    onClick={() => onPageChange(page + 1)}
                  >
                    <FiChevronsRight />
                  </IconButton>
                </Stack>
              </Stack>
            )}
          </Stack>
        )}
        <Table>
          <TableHead>
            <TableRow>
              {selectable && getRowId && (
                <TableCell
                  padding='checkbox'
                  sx={{
                    transition: theme =>
                      theme.transitions.create('background-color', {
                        duration: theme.transitions.duration.standard,
                      }),
                  }}
                >
                  <Checkbox
                    checked={
                      rows.length > 0 && selectedIds.length === rows.length
                    }
                    indeterminate={
                      selectedIds.length > 0 && selectedIds.length < rows.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map(column => (
                <TableCell
                  key={String(column.field)}
                  align={column.headerAlign ?? 'left'}
                  style={{ width: column.width }}
                >
                  {column.sortable && onSort ? (
                    <TableSortLabel
                      active={sortField === column.field}
                      direction={sortOrder}
                      onClick={() => handleSort(column.field)}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    column.headerName
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  sx={{ border: 0 }}
                >
                  <Stack
                    alignItems='center'
                    justifyContent='center'
                    sx={{ py: 4 }}
                  >
                    <CircularProgress size={28} />
                  </Stack>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  sx={{ border: 0 }}
                >
                  <Stack
                    alignItems='center'
                    justifyContent='center'
                    sx={{ py: 4 }}
                  >
                    <Typography color='error' sx={{ mb: 0.5 }} variant='body2'>
                      {error}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  sx={{ border: 0 }}
                >
                  <Stack
                    alignItems='center'
                    justifyContent='center'
                    sx={{ py: 4 }}
                  >
                    <FiInbox
                      size={24}
                      style={{
                        color: theme.palette.text.disabled,
                        marginBottom: theme.spacing(0.5),
                      }}
                    />
                    <Typography color='text.secondary' variant='body2'>
                      {emptyMessage || 'No items to display'}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow
                  key={getRowId ? getRowId(row) : index}
                  hover
                  selected={isSelected(row)}
                >
                  {selectable && getRowId && (
                    <TableCell padding='checkbox' sx={{ py: 0.75 }}>
                      <Checkbox
                        checked={isSelected(row)}
                        onChange={() => handleSelectRow(row)}
                      />
                    </TableCell>
                  )}
                  {columns.map(column => (
                    <TableCell
                      key={String(column.field)}
                      align={column.itemsAlign ?? 'left'}
                      sx={{ py: 1, px: 2 }}
                    >
                      {column.render
                        ? column.render(row)
                        : column.field === 'actions'
                          ? null
                          : String(row[column.field] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

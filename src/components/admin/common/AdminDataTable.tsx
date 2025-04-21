import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { type ReactNode } from 'react';
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

type DataColumn<TData> = {
  field: keyof TData;
  headerName: string;
  render?: (row: TData) => ReactNode;
  sortable?: boolean;
  width?: string;
};

type ActionsColumn<TData> = {
  field: 'actions';
  headerName: string;
  render: (row: TData) => ReactNode;
  sortable?: false;
  width?: string;
};

export interface IAdminDataTableProps<TData, TSortField extends keyof TData> {
  columns: Array<DataColumn<TData> | ActionsColumn<TData>>;
  rows: TData[];
  sortField?: TSortField;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pages?: number;
  onPageChange?: (page: number) => void;
  onSort?: (field: TSortField) => void;
}

export const AdminDataTable = <TData, TSortField extends keyof TData>({
  columns,
  rows,
  sortField,
  sortOrder,
  page = 1,
  pages = 1,
  onPageChange,
  onSort,
}: IAdminDataTableProps<TData, TSortField>) => {
  const handleSort = (field: keyof TData | 'actions') => {
    if (field !== 'actions' && onSort) {
      onSort(field as TSortField);
    }
  };

  return (
    <Paper elevation={0} variant='outlined'>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={String(column.field)}
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
            {rows.map((row, index) => (
              <TableRow key={index} hover>
                {columns.map(column => (
                  <TableCell key={String(column.field)}>
                    {column.render
                      ? column.render(row)
                      : column.field === 'actions'
                        ? null
                        : String(row[column.field] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {pages > 1 && onPageChange && (
        <Stack
          alignItems='center'
          direction='row'
          justifyContent='flex-end'
          padding={2}
          spacing={2}
        >
          <Typography variant='body2'>
            Page {page} sur {pages}
          </Typography>
          <Stack direction='row' spacing={1}>
            <Button
              disabled={page === 1}
              size='small'
              startIcon={<FiChevronsLeft />}
              variant='outlined'
              onClick={() => onPageChange(page - 1)}
            >
              Précédent
            </Button>
            <Button
              disabled={page === pages}
              endIcon={<FiChevronsRight />}
              size='small'
              variant='outlined'
              onClick={() => onPageChange(page + 1)}
            >
              Suivant
            </Button>
          </Stack>
        </Stack>
      )}
    </Paper>
  );
};

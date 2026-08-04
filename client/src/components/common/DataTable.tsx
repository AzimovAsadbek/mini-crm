import type { Breakpoint } from '@mui/material';
import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T, index: number) => ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
  /** Shu breakpointdan pastda ustun yashiriladi — mobil ko'rinish uchun. */
  hideBelow?: Breakpoint;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string | number;
  isLoading?: boolean;
  skeletonRows?: number;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  isLoading = false,
  skeletonRows = 5,
  emptyMessage = "Ma'lumot topilmadi",
}: DataTableProps<T>) {
  const hiddenSx = (column: Column<T>) =>
    column.hideBelow ? { display: { xs: 'none', [column.hideBelow]: 'table-cell' } } : undefined;

  return (
    <TableContainer sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 640 }}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.key}
                align={column.align}
                sx={{ width: column.width, ...hiddenSx(column) }}
              >
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {isLoading &&
            Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`}>
                {columns.map((column) => (
                  <TableCell key={column.key} sx={hiddenSx(column)}>
                    <Skeleton variant="text" height={22} />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!isLoading && rows.length === 0 && (
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent' } }}>
              <TableCell colSpan={columns.length}>
                <Box sx={{ py: 5, textAlign: 'center' }}>
                  <Typography color="text.secondary">{emptyMessage}</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            rows.map((row, index) => (
              <TableRow key={getRowKey(row)}>
                {columns.map((column) => (
                  <TableCell key={column.key} align={column.align} sx={hiddenSx(column)}>
                    {column.render(row, index)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

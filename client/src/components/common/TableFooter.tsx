import { formatRange } from '@/lib/format';
import type { PaginationMeta } from '@/types';
import { Box, Pagination, Typography } from '@mui/material';

interface TableFooterProps {
  meta?: PaginationMeta;
  page: number;
  onPageChange: (page: number) => void;
}

export function TableFooter({ meta, page, onPageChange }: TableFooterProps) {
  if (!meta) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        px: 2,
        py: 1.5,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {formatRange(meta.page, meta.limit, meta.total)}
      </Typography>

      <Pagination
        count={meta.totalPages}
        page={page}
        onChange={(_, value) => onPageChange(value)}
        shape="rounded"
        color="primary"
        size="small"
        siblingCount={0}
        boundaryCount={1}
      />
    </Box>
  );
}

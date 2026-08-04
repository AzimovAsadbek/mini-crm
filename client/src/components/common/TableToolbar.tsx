import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, InputAdornment, TextField } from '@mui/material';
import type { ReactNode } from 'react';

interface TableToolbarProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function TableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Qidirish...',
  filters,
  actionLabel,
  onAction,
}: TableToolbarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 1.5,
        p: 2,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      {filters}

      {onSearchChange && (
        <TextField
          size="small"
          value={search ?? ''}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          sx={{ width: { xs: '100%', sm: 240 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
        />
      )}

      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAction}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

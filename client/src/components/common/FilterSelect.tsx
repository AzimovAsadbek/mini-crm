import type { SelectOption } from '@/types';
import { MenuItem, TextField } from '@mui/material';

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  allLabel: string;
  minWidth?: number;
}

export function FilterSelect({
  value,
  onChange,
  options,
  allLabel,
  minWidth = 170,
}: FilterSelectProps) {
  return (
    <TextField
      select
      size="small"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      sx={{ minWidth: { xs: '100%', sm: minWidth } }}
    >
      <MenuItem value="">{allLabel}</MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={String(option.value)}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

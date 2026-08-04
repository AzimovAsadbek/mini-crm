import type { ChipTone } from '@/constants/status';
import { tokens } from '@/theme/tokens';
import { Chip } from '@mui/material';

interface StatusChipProps {
  label: string;
  tone: ChipTone;
}

export function StatusChip({ label, tone }: StatusChipProps) {
  const colors = tokens.status[tone];

  return (
    <Chip
      label={label}
      size="small"
      sx={{ bgcolor: colors.bg, color: colors.fg, px: 0.5 }}
    />
  );
}

import type { ChipTone } from '@/constants/status';
import { tokens } from '@/theme/tokens';
import { Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface StatusChipProps {
  label: string;
  tone: ChipTone;
}

export function StatusChip({ label, tone }: StatusChipProps) {
  const theme = useTheme();
  const colors = tokens.status[tone][theme.palette.mode];

  return (
    <Chip
      label={label}
      size="small"
      sx={{ bgcolor: colors.bg, color: colors.fg, px: 0.5 }}
    />
  );
}

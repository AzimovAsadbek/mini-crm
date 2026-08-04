import { Box, Card, Typography } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  icon: SvgIconComponent;
}

export function StatCard({ label, value, color, icon: Icon }: StatCardProps) {
  return (
    <Card
      sx={{
        bgcolor: color,
        border: 'none',
        color: '#fff',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        height: '100%',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
            opacity: 0.9,
            lineHeight: 1.4,
          }}
        >
          {label}
        </Typography>
        <Typography sx={{ fontSize: 30, fontWeight: 700, lineHeight: 1.2 }}>{value}</Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          flexShrink: 0,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.2)',
        }}
      >
        <Icon sx={{ fontSize: 24 }} />
      </Box>
    </Card>
  );
}

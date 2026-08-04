import { AuthIllustration } from '@/components/common/AuthIllustration';
import { Box, Card, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ display: 'grid', placeItems: 'center', p: { xs: 2, sm: 4 } }}>
        <Card sx={{ width: '100%', maxWidth: 420, p: { xs: 3, sm: 4 } }}>
          <Stack spacing={0.5} sx={{ mb: 3 }}>
            <Typography variant="h2">{title}</Typography>
            <Typography color="text.secondary" variant="body2">
              {subtitle}
            </Typography>
          </Stack>

          {children}
        </Card>
      </Box>

      <Box
        sx={{
          display: { xs: 'none', md: 'grid' },
          placeItems: 'center',
          p: 6,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? '#EEF4FF' : '#111A2B'),
        }}
      >
        <AuthIllustration />
      </Box>
    </Box>
  );
}

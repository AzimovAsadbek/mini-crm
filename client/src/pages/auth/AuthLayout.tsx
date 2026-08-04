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
        placeItems: 'center',
        p: { xs: 2, sm: 4 },
        // Illyustratsiya foni bilan bir xil rang — rasm chegarasi ko'rinmaydi.
        bgcolor: '#F4F7FE',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1000,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 420px) minmax(0, 1fr)' },
          alignItems: 'center',
          justifyItems: 'center',
          gap: { md: 6 },
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 420, p: { xs: 3, sm: 4 } }}>
          <Stack spacing={0.5} sx={{ mb: 3 }}>
            <Typography variant="h2">{title}</Typography>
            <Typography color="text.secondary" variant="body2">
              {subtitle}
            </Typography>
          </Stack>

          {children}
        </Card>

        <Box sx={{ display: { xs: 'none', md: 'block' }, width: '100%' }}>
          <AuthIllustration />
        </Box>
      </Box>
    </Box>
  );
}

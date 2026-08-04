import { Box, Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh', p: 3 }}>
      <Stack spacing={2} alignItems="center">
        <Typography sx={{ fontSize: 64, fontWeight: 700, color: 'primary.main' }}>404</Typography>
        <Typography variant="h4">Sahifa topilmadi</Typography>
        <Typography color="text.secondary">Siz izlagan sahifa mavjud emas.</Typography>
        <Button component={Link} to="/dashboard" variant="contained">
          Dashboardga qaytish
        </Button>
      </Stack>
    </Box>
  );
}

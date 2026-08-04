import { Card } from '@mui/material';
import type { ReactNode } from 'react';

/** Ro'yxat sahifalarining umumiy konteyneri: toolbar + jadval + pagination. */
export function PageCard({ children }: { children: ReactNode }) {
  return <Card sx={{ overflow: 'hidden' }}>{children}</Card>;
}

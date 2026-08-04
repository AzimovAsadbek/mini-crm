import { DetailRow } from '@/components/common/DetailDialog';
import { ROLE_LABEL } from '@/constants/status';
import { useAuth } from '@/hooks/use-auth';
import { formatDate, getInitials } from '@/lib/format';
import { Avatar, Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { EditProfileDialog } from './EditProfileDialog';

export function ProfilePage() {
  const { user } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <>
      <Card>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 3, md: 5 },
              gridTemplateColumns: { xs: '1fr', md: '260px 1fr' },
              alignItems: 'start',
            }}
          >
            <Stack alignItems="center" spacing={1.5}>
              <Avatar
                sx={{ width: 96, height: 96, bgcolor: 'primary.main', fontSize: 32, fontWeight: 600 }}
              >
                {getInitials(user.fullname)}
              </Avatar>

              <Stack alignItems="center" spacing={0.25}>
                <Typography variant="h4">{user.fullname}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {ROLE_LABEL[user.role]}
                </Typography>
              </Stack>

              <Stack spacing={1} sx={{ width: '100%', pt: 1 }}>
                <Button variant="contained" onClick={() => setEditOpen(true)}>
                  Ma'lumotni tahrirlash
                </Button>
                <Button variant="outlined" onClick={() => setPasswordOpen(true)}>
                  Parolni o'zgartirish
                </Button>
              </Stack>
            </Stack>

            <Stack spacing={2.5}>
              <DetailRow label="To'liq ism">{user.fullname}</DetailRow>
              <DetailRow label="Email">{user.email}</DetailRow>
              <DetailRow label="Role">{ROLE_LABEL[user.role]}</DetailRow>
              <DetailRow label="Sana">{formatDate(user.createdAt)}</DetailRow>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <EditProfileDialog open={editOpen} onClose={() => setEditOpen(false)} />
      <ChangePasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </>
  );
}

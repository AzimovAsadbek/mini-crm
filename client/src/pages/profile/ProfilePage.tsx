import { StatusChip } from '@/components/common/StatusChip';
import { ROLE_LABEL } from '@/constants/status';
import { useAuth } from '@/hooks/use-auth';
import { useColorMode } from '@/hooks/use-color-mode';
import { formatDate, getInitials } from '@/lib/format';
import { tokens } from '@/theme/tokens';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import TranslateIcon from '@mui/icons-material/Translate';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { SvgIconComponent } from '@mui/icons-material';
import { useState } from 'react';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { EditProfileDialog } from './EditProfileDialog';

interface InfoTileProps {
  icon: SvgIconComponent;
  label: string;
  value: string;
  color: string;
}

function InfoTile({ icon: Icon, label, value, color }: InfoTileProps) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          borderRadius: 2,
          display: 'grid',
          placeItems: 'center',
          bgcolor: alpha(color, 0.12),
          color,
        }}
      >
        <Icon fontSize="small" />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 12 }} color="text.secondary">
          {label}
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 600, wordBreak: 'break-word' }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  const { mode, toggleMode } = useColorMode();
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <>
      <Stack spacing={3}>
        <Card>
          <Box
            sx={{
              height: 116,
              background: `linear-gradient(120deg, ${tokens.primary} 0%, ${tokens.stat.completed} 100%)`,
            }}
          />

          <CardContent sx={{ pt: 0, pb: 3 }}>
            <Stack alignItems="center" spacing={1.25} sx={{ mt: '-54px' }}>
              <Avatar
                sx={{
                  width: 104,
                  height: 104,
                  fontSize: 36,
                  fontWeight: 600,
                  bgcolor: 'primary.main',
                  border: '4px solid',
                  borderColor: 'background.paper',
                }}
              >
                {getInitials(user.fullname)}
              </Avatar>

              <Stack alignItems="center" spacing={0.75}>
                <Typography variant="h2">{user.fullname}</Typography>
                <StatusChip
                  label={ROLE_LABEL[user.role]}
                  tone={user.role === 'ADMIN' ? 'success' : 'neutral'}
                />
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 1.5 }}>
                <Button
                  variant="contained"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() => setEditOpen(true)}
                >
                  Ma'lumotni tahrirlash
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LockOutlinedIcon />}
                  onClick={() => setPasswordOpen(true)}
                >
                  Parolni o'zgartirish
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            alignItems: 'start',
          }}
        >
          <Card>
            <CardHeader
              title="Shaxsiy ma'lumotlar"
              slotProps={{ title: { variant: 'h5' } }}
            />
            <Divider />
            <CardContent>
              <Stack spacing={2.5}>
                <InfoTile
                  icon={BadgeOutlinedIcon}
                  label="To'liq ism"
                  value={user.fullname}
                  color={tokens.stat.customers}
                />
                <InfoTile
                  icon={MailOutlineIcon}
                  label="Email"
                  value={user.email}
                  color={tokens.stat.projects}
                />
                <InfoTile
                  icon={AdminPanelSettingsOutlinedIcon}
                  label="Role"
                  value={ROLE_LABEL[user.role]}
                  color={tokens.stat.completed}
                />
                <InfoTile
                  icon={CalendarMonthOutlinedIcon}
                  label="Ro'yxatdan o'tgan sana"
                  value={formatDate(user.createdAt)}
                  color={tokens.stat.tasks}
                />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Sozlamalar" slotProps={{ title: { variant: 'h5' } }} />
            <Divider />
            <CardContent>
              <Stack spacing={2.5}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <InfoTile
                    icon={DarkModeOutlinedIcon}
                    label="Ko'rinish"
                    value="Dark Mode"
                    color={tokens.stat.inProgress}
                  />
                  <Switch checked={mode === 'dark'} onChange={toggleMode} />
                </Stack>

                <InfoTile
                  icon={TranslateIcon}
                  label="Til"
                  value="O'zbekcha"
                  color={tokens.stat.customers}
                />

                <InfoTile
                  icon={CalendarMonthOutlinedIcon}
                  label="Sana formati"
                  value="kk.oo.yyyy"
                  color={tokens.stat.projects}
                />
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>

      <EditProfileDialog open={editOpen} onClose={() => setEditOpen(false)} />
      <ChangePasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </>
  );
}

import { StatusChip } from '@/components/common/StatusChip';
import { ROLE_LABEL } from '@/constants/status';
import { useAuth } from '@/hooks/use-auth';
import { useMyTasks } from '@/hooks/use-my-tasks';
import { formatDate, getInitials } from '@/lib/format';
import { tokens } from '@/theme/tokens';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import type { SvgIconComponent } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useState } from 'react';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { EditProfileDialog } from './EditProfileDialog';

interface TileProps {
  icon: SvgIconComponent;
  label: string;
  value: string;
  color: string;
}

function InfoTile({ icon: Icon, label, value, color }: TileProps) {
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

function MetricTile({ icon: Icon, label, value, color }: TileProps) {
  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={1.75} alignItems="center">
        <Box
          sx={{
            width: 46,
            height: 46,
            flexShrink: 0,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            bgcolor: alpha(color, 0.12),
            color,
          }}
        >
          <Icon />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>{value}</Typography>
          <Typography sx={{ fontSize: 13 }} color="text.secondary" noWrap>
            {label}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  const { total, completed, open, isLoading } = useMyTasks();
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  if (!user) {
    return null;
  }

  const metrics: TileProps[] = [
    {
      icon: AssignmentOutlinedIcon,
      label: 'Biriktirilgan vazifalar',
      value: String(total),
      color: tokens.stat.customers,
    },
    {
      icon: CheckCircleOutlineIcon,
      label: 'Tugallangan',
      value: String(completed),
      color: tokens.stat.projects,
    },
    {
      icon: ScheduleIcon,
      label: 'Ochiq vazifalar',
      value: String(open),
      color: tokens.stat.tasks,
    },
  ];

  return (
    <>
      <Stack spacing={3}>
        <Card>
          <Box
            sx={{
              height: { xs: 116, md: 132 },
              background: `linear-gradient(120deg, ${tokens.primary} 0%, ${tokens.stat.completed} 100%)`,
            }}
          />

          <CardContent sx={{ pt: 0, pb: 3, px: { xs: 2, md: 4 } }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'center', md: 'flex-end' },
                textAlign: { xs: 'center', md: 'left' },
                gap: { xs: 1.5, md: 3 },
                // Avatar bannerga chiqadi, ammo ism gradient ustiga tushmasligi kerak.
                mt: { xs: '-54px', md: '-48px' },
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 104, md: 124 },
                  height: { xs: 104, md: 124 },
                  fontSize: { xs: 36, md: 42 },
                  fontWeight: 600,
                  bgcolor: 'primary.main',
                  border: '4px solid',
                  borderColor: 'background.paper',
                }}
              >
                {getInitials(user.fullname)}
              </Avatar>

              <Stack
                spacing={0.75}
                alignItems={{ xs: 'center', md: 'flex-start' }}
                sx={{ flex: 1, minWidth: 0, pb: { md: 1 } }}
              >
                <Typography variant="h2">{user.fullname}</Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  flexWrap="wrap"
                  justifyContent={{ xs: 'center', md: 'flex-start' }}
                >
                  <StatusChip
                    label={ROLE_LABEL[user.role]}
                    tone={user.role === 'ADMIN' ? 'success' : 'neutral'}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Stack>
              </Stack>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{ pt: { xs: 1, md: 0 }, pb: { md: 1 }, flexShrink: 0 }}
              >
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
            </Box>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          }}
        >
          {metrics.map((metric) =>
            isLoading ? (
              <Skeleton key={metric.label} variant="rounded" height={82} />
            ) : (
              <MetricTile key={metric.label} {...metric} />
            ),
          )}
        </Box>

        <Card>
          <CardHeader title="Shaxsiy ma'lumotlar" slotProps={{ title: { variant: 'h5' } }} />
          <Divider />
          <CardContent>
            <Box
              sx={{
                display: 'grid',
                gap: 2.5,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
              }}
            >
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
            </Box>
          </CardContent>
        </Card>
      </Stack>

      <EditProfileDialog open={editOpen} onClose={() => setEditOpen(false)} />
      <ChangePasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </>
  );
}

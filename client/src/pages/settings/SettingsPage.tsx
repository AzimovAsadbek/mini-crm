import { DetailRow } from '@/components/common/DetailDialog';
import { ROLE_LABEL } from '@/constants/status';
import { useAuth } from '@/hooks/use-auth';
import { useColorMode } from '@/hooks/use-color-mode';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Switch,
  Typography,
} from '@mui/material';

export function SettingsPage() {
  const { mode, toggleMode } = useColorMode();
  const { user } = useAuth();

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader title="Ko'rinish" slotProps={{ title: { variant: 'h5' } }} />
        <Divider />
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <DarkModeOutlinedIcon sx={{ color: 'text.secondary' }} />
              <Stack>
                <Typography variant="body2" fontWeight={600}>
                  Dark Mode
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Qorong'i mavzuni yoqish yoki o'chirish
                </Typography>
              </Stack>
            </Stack>

            <Switch checked={mode === 'dark'} onChange={toggleMode} />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Hisob" slotProps={{ title: { variant: 'h5' } }} />
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            <DetailRow label="To'liq ism">{user?.fullname}</DetailRow>
            <DetailRow label="Email">{user?.email}</DetailRow>
            <DetailRow label="Role">{user ? ROLE_LABEL[user.role] : ''}</DetailRow>
            <DetailRow label="Til">O'zbekcha</DetailRow>
            <DetailRow label="Sana formati">kk.oo.yyyy</DetailRow>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

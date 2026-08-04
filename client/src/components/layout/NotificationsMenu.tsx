import { getUrgency, useMyTasks, type Urgency } from '@/hooks/use-my-tasks';
import { daysUntil, formatDate } from '@/lib/format';
import { tokens } from '@/theme/tokens';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URGENCY_COLOR: Record<Urgency, string> = {
  overdue: tokens.stat.inProgress,
  soon: tokens.stat.tasks,
  normal: tokens.primary,
};

function deadlineLabel(deadline: string | null): string {
  const days = daysUntil(deadline);

  if (days === null) {
    return 'Muddat belgilanmagan';
  }

  if (days < 0) {
    return `${Math.abs(days)} kun kechikdi`;
  }

  if (days === 0) {
    return 'Bugun tugaydi';
  }

  if (days <= 3) {
    return `${days} kun qoldi`;
  }

  return formatDate(deadline);
}

export function NotificationsMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { open: openCount, upcoming, isLoading } = useMyTasks();
  const navigate = useNavigate();

  const closeMenu = () => setAnchorEl(null);

  const goToTasks = () => {
    closeMenu();
    navigate('/tasks');
  };

  return (
    <>
      <Tooltip title="Bildirishnomalar">
        <IconButton
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{ color: 'text.secondary' }}
        >
          <Badge
            color="error"
            badgeContent={openCount}
            max={99}
            invisible={isLoading || openCount === 0}
          >
            <NotificationsNoneIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 340, maxWidth: '100vw', mt: 1 } } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="h6">Bildirishnomalar</Typography>
          <Typography variant="body2" color="text.secondary">
            {openCount > 0 ? `Sizda ${openCount} ta ochiq vazifa bor` : 'Ochiq vazifalaringiz yo‘q'}
          </Typography>
        </Box>

        <Divider />

        {upcoming.length === 0 && (
          <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Yangi bildirishnoma yo'q
            </Typography>
          </Box>
        )}

        {upcoming.map((task) => {
          const urgency = getUrgency(task);

          return (
            <MenuItem key={task.id} onClick={goToTasks} sx={{ py: 1.25, alignItems: 'flex-start' }}>
              <Stack direction="row" spacing={1.25} sx={{ minWidth: 0, width: '100%' }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    mt: 0.75,
                    flexShrink: 0,
                    borderRadius: '50%',
                    bgcolor: URGENCY_COLOR[urgency],
                  }}
                />

                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 500 }} noWrap title={task.title}>
                    {task.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {task.project.projectName}
                  </Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: URGENCY_COLOR[urgency] }}>
                    {deadlineLabel(task.deadline)}
                  </Typography>
                </Box>
              </Stack>
            </MenuItem>
          );
        })}

        <Divider />

        <Box sx={{ p: 1 }}>
          <Button fullWidth size="small" onClick={goToTasks}>
            Barcha vazifalar
          </Button>
        </Box>
      </Menu>
    </>
  );
}

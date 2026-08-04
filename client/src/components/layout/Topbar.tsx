import { useAuth } from '@/hooks/use-auth';
import { useColorMode } from '@/hooks/use-color-mode';
import { getInitials } from '@/lib/format';
import { ROLE_LABEL } from '@/constants/status';
import { SIDEBAR_WIDTH, TOPBAR_HEIGHT } from '@/theme/tokens';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
  onLogout: () => void;
}

export function Topbar({ title, onMenuClick, onLogout }: TopbarProps) {
  const { user } = useAuth();
  const { mode, toggleMode } = useColorMode();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const closeMenu = () => setAnchorEl(null);

  const goTo = (path: string) => {
    closeMenu();
    navigate(path);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{
        width: { lg: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        ml: { lg: `${SIDEBAR_WIDTH}px` },
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: `${TOPBAR_HEIGHT}px !important`, gap: 1 }}>
        <IconButton
          onClick={onMenuClick}
          edge="start"
          sx={{ display: { lg: 'none' }, color: 'text.secondary' }}
        >
          <MenuIcon />
        </IconButton>

        <IconButton sx={{ display: { xs: 'none', lg: 'inline-flex' }, color: 'text.secondary' }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h4" sx={{ flexGrow: 1, ml: 0.5 }}>
          {title}
        </Typography>

        <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
          <IconButton onClick={toggleMode} sx={{ color: 'text.secondary' }}>
            {mode === 'light' ? (
              <DarkModeOutlinedIcon fontSize="small" />
            ) : (
              <LightModeOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        <IconButton sx={{ color: 'text.secondary' }}>
          <Badge color="error" variant="dot">
            <NotificationsNoneIcon fontSize="small" />
          </Badge>
        </IconButton>

        <Box
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            ml: 0.5,
            px: 0.5,
            py: 0.5,
            borderRadius: 1,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13 }}>
            {getInitials(user?.fullname)}
          </Avatar>

          <Box sx={{ display: { xs: 'none', sm: 'block' }, lineHeight: 1.2 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{user?.fullname}</Typography>
            <Typography sx={{ fontSize: 11 }} color="text.secondary">
              {user ? ROLE_LABEL[user.role] : ''}
            </Typography>
          </Box>

          <KeyboardArrowDownIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: { minWidth: 180, mt: 1 } } }}
        >
          <MenuItem onClick={() => goTo('/profile')}>
            <ListItemIcon>
              <PersonOutlineIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>

          <MenuItem onClick={() => goTo('/settings')}>
            <ListItemIcon>
              <SettingsOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={() => {
              closeMenu();
              onLogout();
            }}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

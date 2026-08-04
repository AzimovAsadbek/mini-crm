import { useAuth } from '@/hooks/use-auth';
import { SIDEBAR_WIDTH } from '@/theme/tokens';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './nav-items';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

function SidebarContent({ onNavigate, onLogout }: { onNavigate: () => void; onLogout: () => void }) {
  const { isAdmin } = useAuth();
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  const itemSx = {
    borderRadius: 1,
    mx: 1.5,
    my: 0.25,
    py: 1,
    color: 'sidebar.text',
    position: 'relative',
    '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', color: 'sidebar.activeText' },
    '&.active': {
      bgcolor: 'sidebar.activeBg',
      color: 'sidebar.activeText',
      '&::before': {
        content: '""',
        position: 'absolute',
        left: -12,
        top: 8,
        bottom: 8,
        width: 3,
        borderRadius: 4,
        bgcolor: 'primary.main',
      },
    },
  } as const;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'sidebar.bg' }}>
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ px: 3, py: 2.5 }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          M
        </Box>
        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 17 }}>Mini CRM</Typography>
      </Stack>

      <List sx={{ flex: 1, py: 1 }}>
        {items.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={onNavigate}
            sx={itemSx}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
              <item.icon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              slotProps={{ primary: { fontSize: 14, fontWeight: 500 } }}
            />
          </ListItemButton>
        ))}

        <ListItemButton onClick={onLogout} sx={itemSx}>
          <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            slotProps={{ primary: { fontSize: 14, fontWeight: 500 } }}
          />
        </ListItemButton>
      </List>
    </Box>
  );
}

export function Sidebar({ mobileOpen, onClose, onLogout }: SidebarProps) {
  const paperSx = {
    width: SIDEBAR_WIDTH,
    boxSizing: 'border-box',
    border: 'none',
    bgcolor: 'sidebar.bg',
  } as const;

  return (
    <Box component="nav" sx={{ width: { lg: SIDEBAR_WIDTH }, flexShrink: { lg: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': paperSx,
        }}
      >
        <SidebarContent onNavigate={onClose} onLogout={onLogout} />
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': paperSx,
        }}
      >
        <SidebarContent onNavigate={() => {}} onLogout={onLogout} />
      </Drawer>
    </Box>
  );
}

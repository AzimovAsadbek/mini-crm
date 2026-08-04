import { useAuth } from '@/hooks/use-auth';
import { NAV_ITEMS } from '@/components/layout/nav-items';
import { SIDEBAR_WIDTH, TOPBAR_HEIGHT } from '@/theme/tokens';
import { Box, Toolbar } from '@mui/material';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const title = NAV_ITEMS.find((item) => pathname.startsWith(item.path))?.label ?? 'Mini CRM';

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
      />

      <Topbar
        title={title}
        onMenuClick={() => setMobileOpen(true)}
        onLogout={handleLogout}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: { lg: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          p: { xs: 2, md: 3 },
        }}
      >
        <Toolbar sx={{ minHeight: `${TOPBAR_HEIGHT}px !important` }} />
        <Outlet />
      </Box>
    </Box>
  );
}
